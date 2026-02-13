# Task 05: Antibiotic Effects & Regrowth Simulation

**Depends on**: Tasks 02-04 (types, constants, random, cdiff, health)
**Produces**: `src/simulation/antibiotics.ts`, `src/simulation/regrowth.ts`, and tests for both.

---

## What to do

### `src/simulation/antibiotics.ts` — Antibiotic Effect Per Tick

Export an `applyAntibioticTick(state: SimulationState, rng: RNG): SimulationState` function.

Per-tick logic when antibiotics are active:
1. **Kill commensals**: For each commensal species, reduce abundance:
   ```
   newAbundance = abundance * (1 - antibioticSensitivity * COMMENSAL_ANTIBIOTIC_KILL_RATE * (1 + rng.gaussian(0, 0.02)))
   ```
   Clamp to >= 0. Species with higher `antibioticSensitivity` die faster.

2. **Kill C. diff vegetative cells**:
   ```
   newVegetative = vegetative * (1 - CDIFF_ANTIBIOTIC_KILL_VEGETATIVE)
   ```

3. **C. diff spores are NOT affected** — this is the key biological insight that drives the antibiotic trap.

4. Return updated state with new commensal abundances and C. diff state.

### `src/simulation/regrowth.ts` — Natural & Therapeutic Regrowth

Export two functions:

#### `applyNaturalRegrowthTick(state: SimulationState, rng: RNG): SimulationState`

Natural regrowth is **slow** — this is why the gut stays vulnerable for months after antibiotics.

For each commensal species:
- If `abundance < 0.001` (nearly extinct): only a 2% chance per tick (`rng.next() < 0.02`) to begin recovering (set to 0.005). Otherwise stays near-zero.
- If alive: logistic growth toward carrying capacity:
  ```
  available = CAPACITY - totalCommensal - cdiff.vegetative
  growth = growthRate * abundance * (available / CAPACITY) * (1 + rng.gaussian(0, 0.02))
  abundance += growth
  ```
- Clamp to >= 0.

#### `applyTherapeuticIntervention(state: SimulationState, rng: RNG): SimulationState`

Simulates administering a Vowst/SER-109-like microbiome therapeutic — a bolus of commensal bacterial spores.

1. Find depleted commensal species (`abundance < 0.05`)
2. Boost up to `THERAPEUTIC_SPECIES_ADDED` (8) of them:
   - Add `THERAPEUTIC_COMMENSAL_BOOST / THERAPEUTIC_SPECIES_ADDED` abundance (+ small gaussian noise)
   - Add `THERAPEUTIC_ENGRAFTMENT_BONUS` to their growth rate
3. If fewer than 8 depleted species exist, add new species named `Therapeutic_1`, `Therapeutic_2`, etc. with the same boost amounts and randomized parameters.
4. Set `therapeuticApplied = true`
5. Add a success event to the events log: "Microbiome therapeutic administered. Commensal spores delivered to the gut."
6. Return updated state.

### Tests — `tests/simulation/antibiotics.test.ts` and `tests/simulation/regrowth.test.ts`

**antibiotics.test.ts**:
- Commensal abundances decrease after one tick
- More sensitive species decrease more than less sensitive ones
- C. diff vegetative cells decrease
- C. diff spores remain unchanged (critical test!)
- Multiple ticks drive commensals toward zero

**regrowth.test.ts**:
- Natural regrowth: from a depleted state (all commensals < 0.001), after 30 ticks, total abundance is still very low (< 0.2). After 90+ ticks, shows meaningful recovery.
- Natural regrowth: nearly-extinct species mostly stay near zero (stochastic recovery is rare)
- Therapeutic: immediately increases total commensal abundance by approximately `THERAPEUTIC_COMMENSAL_BOOST`
- Therapeutic: sets `therapeuticApplied` flag
- Therapeutic: adds event to log
- Therapeutic: after 10 ticks of natural regrowth following therapy, commensals are much higher than natural-only

## Verify

- `npx vitest run` — all tests pass
- `npm run build` — compiles cleanly
