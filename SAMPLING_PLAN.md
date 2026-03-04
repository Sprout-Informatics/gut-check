# Metagenomic Sampling Feature — Implementation Plan

## Overview

A new "Take Sample" capability that captures the simulation state at the current tick,
distributes commensal abundances across a 30-species pool using a log-normal distribution,
generates 500 synthetic sequencing reads, then challenges students to classify a subset of
those reads as *commensal*, *C. difficile*, or *therapeutic* before revealing the true
composition.

## User Experience

1. During the simulation, the user clicks **"Take Sample"** (enabled whenever the simulation
   is ongoing).
2. A full-screen modal opens with three phases:
   - **Intro**: sample stats (commensal %, C. diff %, therapeutic %) and a "Begin
     Classification" button.
   - **Classify**: 20 stratified reads shown as cards (24-bp sequence + 3 category buttons).
     Each card locks and shows correct/incorrect immediately after classification.
   - **Results**: accuracy score, true composition donut chart, species breakdown bar chart,
     educational blurb (Kraken2/BLAST analogy), "Return to Simulation" button.

## New Data Types (`src/simulation/types.ts`)

```typescript
export type SpeciesCategory = 'commensal' | 'cdiff' | 'therapeutic'

export interface SampleSpecies {
  name: string
  category: SpeciesCategory
  abundance: number   // 0–100; all species sum to 100
  readCount: number
}

export interface SequencingRead {
  id: number
  species: string
  category: SpeciesCategory
  sequence: string         // 24-bp deterministic fake sequence
  userLabel: SpeciesCategory | null
}

export interface MicrobiomeSample {
  tick: number
  species: SampleSpecies[]
  reads: SequencingRead[]  // 500 reads, pre-shuffled
  totalReads: number
}
```

Also add `isTherapeutic?: boolean` to `BacterialPopulation` so the engine can tag species
added by the therapeutic intervention.

## New File: `src/simulation/commensal-species.ts`

Defines 30 named gut bacteria with the same fields as `BacterialPopulation`. The main
simulation continues to sample 12 from this pool for the ecology game. The sampling module
uses the full 30 as the "reference database."

30 species (15 existing + 15 new):
- Existing 15: Bacteroides, Faecalibacterium, Roseburia, Bifidobacterium, Lactobacillus,
  Eubacterium, Ruminococcus, Prevotella, Akkermansia, Clostridium_commensal, Blautia,
  Coprococcus, Dorea, Streptococcus, Enterococcus
- New 15: Lachnospiraceae_bacterium, Alistipes_putredinis, Parabacteroides_distasonis,
  Dialister_invisus, Phascolarctobacterium_faecium, Oscillibacter_valericigenes,
  Subdoligranulum_variabile, Anaerostipes_caccae, Collinsella_aerofaciens,
  Butyricicoccus_pullicaecorum, Megamonas_hypermegale, Sutterella_wadsworthensis,
  Veillonella_parvula, Turicibacter_sanguinis, Fusobacterium_nucleatum

## New File: `src/simulation/sampling.ts`

### `generateSample(state, rng): MicrobiomeSample`

1. Compute category percentages from `state`:
   - `cdiffRaw = state.cdiff.vegetative + state.cdiff.spores`
   - `commensalRaw = state.totalCommensalAbundance`
   - `grandTotal = cdiffRaw + commensalRaw`
   - Scale both to 100 via `grandTotal`
2. Carve therapeutic species (those with `isTherapeutic: true`) out of `commensalPct` into
   their own `therapeuticPct`.
3. Distribute remaining `commensalPct` across 10–20 randomly selected species from the
   30-species pool using **log-normal weights** (`Math.exp(rng.gaussian(0, 1.2))`), then
   normalize. This produces the characteristic long-tailed microbiome distribution.
4. Assemble `SampleSpecies[]` and call `generateReads`.

### `generateReads(species, n=500, rng): SequencingRead[]`

- For each species: `readCount = Math.round(abundance/100 × n)` (clamp remainders so
  total = 500 exactly).
- Each species gets a **deterministic 24-bp DNA sequence** derived from a seeded hash of
  the species name. Same species → same motif, mirroring real reference-based alignment.
- Shuffle all reads with Fisher-Yates before returning.

## New File: `src/components/SamplingModal.tsx`

Full-screen overlay managing phase state: `'intro' | 'classify' | 'results'`.

## New File: `src/components/ReadCard.tsx`

Single card: monospace 24-bp sequence + three classification buttons (commensal/C.
difficile/therapeutic). Locks after click and shows ✓/✗ immediately.

## New File: `src/components/SamplingResults.tsx`

Recharts PieChart of true composition + BarChart of student classifications vs. truth +
educational text.

## Modified Files

| File | Change |
|---|---|
| `src/simulation/types.ts` | Add `SpeciesCategory`, `SampleSpecies`, `SequencingRead`, `MicrobiomeSample`; add `isTherapeutic?` to `BacterialPopulation` |
| `src/simulation/profiles.ts` | Import from `commensal-species.ts`; use 30-species pool |
| `src/simulation/regrowth.ts` | Tag therapeutic-added species with `isTherapeutic: true` |
| `src/components/PatientDashboard.tsx` | Add "Take Sample" button + `activeSample` state + render `SamplingModal` |

## Key Design Decisions

- **Log-normal distribution** reflects the real long-tail structure of gut microbiome data.
  Students see this pattern emerge in the composition chart.
- **Deterministic sequences per species** lets the same species always produce the same
  motif, mirroring how real alignment works against a reference database.
- **Immediate per-card feedback** teaches via rapid iteration rather than deferring all
  feedback to the end.
- **Stratified read sampling** for the 20 displayed reads ensures the student's
  classification task is fair and the accuracy score is meaningful.
- **Three categories** (commensal / C. difficile / therapeutic) reflect the real clinical
  question: which bacteria in the sample are harmful vs. native vs. introduced by therapy?
