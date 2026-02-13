# Task 02: Simulation Types & Constants

**Depends on**: Task 01 (project scaffolding)
**Produces**: `src/simulation/types.ts` and `src/simulation/constants.ts` — the shared foundation that all other simulation modules import from.

---

## What to do

### `src/simulation/types.ts`

Define all TypeScript interfaces and types for the simulation. These are the data shapes — no logic.

**`BacterialPopulation`** — a single commensal species:
- `name: string` (e.g., "Bacteroides", "Faecalibacterium")
- `abundance: number` (0.0 to 1.0, fraction of gut capacity)
- `isCommensal: boolean` (always true for commensals)
- `antibioticSensitivity: number` (0.0 = resistant, 1.0 = fully sensitive)
- `growthRate: number` (per-tick logistic growth rate)
- `competitiveStrength: number` (ability to exclude pathogens)

**`CDiffState`** — C. difficile has two forms:
- `spores: number` (0-1, dormant, survive antibiotics)
- `vegetative: number` (0-1, active, produce toxin, killed by antibiotics)
- `toxinLevel: number` (derived from vegetative, drives health decline)
- `germinationRate: number` (how fast spores become vegetative)

**`SimulationState`** — the complete state at any point in time:
- `tick: number` (current time step, each tick = ~1 day)
- `phase: SimulationPhase`
- `commensals: BacterialPopulation[]`
- `cdiff: CDiffState`
- `totalCommensalAbundance: number`
- `diversityIndex: number` (Shannon diversity)
- `healthScore: number` (0-100)
- `antibioticActive: boolean`
- `antibioticTicksRemaining: number`
- `antibioticCoursesGiven: number`
- `therapeuticApplied: boolean`
- `recurrenceCount: number`
- `history: HistoryEntry[]` (full time series for charting)
- `events: GameEvent[]` (narrative log)
- `rngSeed: number`
- `outcome: SimulationOutcome | null`

**`SimulationPhase`** — union type:
`'healthy_baseline' | 'antibiotic_disruption' | 'cdiff_bloom' | 'antibiotic_trap' | 'microbiome_therapeutic' | 'resolved' | 'chronic_infection'`

**`HistoryEntry`** — one data point for charts:
- `tick`, `totalCommensalAbundance`, `cdiffVegetative`, `cdiffSpores`, `diversityIndex`, `healthScore`

**`GameEvent`** — narrative log entry:
- `tick: number`, `type: 'info' | 'warning' | 'critical' | 'success'`, `message: string`

**`PlayerAction`** — discriminated union:
- `{ type: 'ADMINISTER_ANTIBIOTICS'; intensity?: number }`
- `{ type: 'ADMINISTER_THERAPEUTIC'; dose?: number }`
- `{ type: 'WAIT_AND_MONITOR' }`

**`SimulationOutcome`**: `'durable_cure' | 'chronic_cdiff' | 'in_progress'`

---

### `src/simulation/constants.ts`

Export a `DEFAULTS` object with all tunable biological parameters. These control the simulation's behavior and can be adjusted later for tuning.

```
// Commensal parameters
INITIAL_COMMENSAL_SPECIES_COUNT: 12
COMMENSAL_TOTAL_CAPACITY: 1.0      // carrying capacity
COMMENSAL_BASE_GROWTH_RATE: 0.08   // per-tick logistic growth
COMMENSAL_ANTIBIOTIC_KILL_RATE: 0.7

// C. diff parameters
INITIAL_CDIFF_SPORES: 0.02
INITIAL_CDIFF_VEGETATIVE: 0.0
CDIFF_VEGETATIVE_GROWTH_RATE: 0.15   // faster than commensals
CDIFF_SPORE_GERMINATION_BASE: 0.01  // very low when commensals present
CDIFF_SPORE_GERMINATION_EMPTY: 0.25 // high when gut is vacant
CDIFF_ANTIBIOTIC_KILL_VEGETATIVE: 0.8
CDIFF_ANTIBIOTIC_KILL_SPORES: 0.0   // spores are resistant
CDIFF_TOXIN_PRODUCTION_RATE: 0.5
CDIFF_SPORULATION_RATE: 0.05

// Competitive exclusion
COMPETITIVE_EXCLUSION_THRESHOLD: 0.5
COMPETITIVE_EXCLUSION_STRENGTH: 0.9

// Antibiotic course
ANTIBIOTIC_COURSE_DURATION: 10  // ticks (days)

// Therapeutic (SER-109/Vowst-like)
THERAPEUTIC_COMMENSAL_BOOST: 0.4
THERAPEUTIC_SPECIES_ADDED: 8
THERAPEUTIC_ENGRAFTMENT_BONUS: 0.03

// Health score
HEALTH_BASELINE: 100
HEALTH_TOXIN_DAMAGE_RATE: 40
HEALTH_RECOVERY_RATE: 2

// Recurrence detection
RECURRENCE_THRESHOLD: 0.3

// Outcome thresholds
DURABLE_CURE_TICKS: 30  // consecutive low-C.diff ticks = cure
MAX_SIMULATION_TICKS: 180  // ~6 months

// Randomization variance
GROWTH_RATE_VARIANCE: 0.03
SENSITIVITY_VARIANCE: 0.15
```

## Verify

- `npm run build` still succeeds (types compile cleanly)
- Both files export cleanly and can be imported from other modules
