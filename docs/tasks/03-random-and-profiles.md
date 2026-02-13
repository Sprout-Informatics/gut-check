# Task 03: Seeded RNG & Microbiome Profile Generator

**Depends on**: Task 02 (types and constants)
**Produces**: `src/simulation/random.ts`, `src/simulation/profiles.ts`, and tests for both.

---

## What to do

### `src/simulation/random.ts` — Seeded PRNG

Implement a seeded pseudo-random number generator using the **Mulberry32** algorithm. This ensures each student run is different, but reproducible given the same seed.

Export a `createRNG(seed: number)` function that returns an object with:
- `next(): number` — returns float in [0, 1)
- `range(min: number, max: number): number` — returns float in [min, max)
- `gaussian(mean: number, stddev: number): number` — returns normally-distributed value (Box-Muller transform)
- `getSeed(): number` — returns the original seed

Also export a `fisherYatesShuffle<T>(array: T[], rng): T[]` helper that returns a shuffled copy of the array using the seeded RNG (do not mutate the input).

Export a TypeScript type `RNG` for the return type of `createRNG`.

### `src/simulation/profiles.ts` — Microbiome Profile Generator

Export a `generateInitialProfile(rng: RNG): BacterialPopulation[]` function.

Behavior:
1. Define a pool of ~15 real commensal genus names: Bacteroides, Faecalibacterium, Roseburia, Bifidobacterium, Lactobacillus, Eubacterium, Ruminococcus, Prevotella, Akkermansia, Clostridium_commensal, Blautia, Coprococcus, Dorea, Streptococcus, Enterococcus
2. Use `fisherYatesShuffle` to randomize the order
3. Pick `INITIAL_COMMENSAL_SPECIES_COUNT` species (from constants, default 12)
4. Assign random abundances using `rng.range(0.1, 1.0)`, then normalize so the total sums to ~0.85 of `COMMENSAL_TOTAL_CAPACITY`
5. For each species, randomize:
   - `growthRate`: `rng.gaussian(COMMENSAL_BASE_GROWTH_RATE, GROWTH_RATE_VARIANCE)`
   - `antibioticSensitivity`: `rng.gaussian(0.7, SENSITIVITY_VARIANCE)`, clamped to [0.1, 1.0]
   - `competitiveStrength`: `rng.range(0.3, 0.9)`
6. Return the array of `BacterialPopulation` objects

Also export a `generateInitialCDiffState(rng: RNG): CDiffState` function that returns the starting C. diff state using constants (low spores, zero vegetative).

### Tests — `tests/simulation/random.test.ts` and `tests/simulation/profiles.test.ts`

**random.test.ts**:
- Same seed produces same sequence
- Different seeds produce different sequences
- `range(min, max)` stays within bounds (run 1000 iterations)
- `gaussian` produces values centered around mean (statistical check over 1000 samples)
- `fisherYatesShuffle` returns same elements in different order, doesn't mutate input

**profiles.test.ts**:
- Returns correct number of species
- All abundances are positive
- Total abundance is in [0.7, 1.0] range
- All growth rates are positive
- All antibiotic sensitivities are in [0.1, 1.0]
- Different seeds produce different profiles
- `generateInitialCDiffState` returns low spores and zero vegetative

## Verify

- `npx vitest run` — all tests pass
- `npm run build` — compiles cleanly
