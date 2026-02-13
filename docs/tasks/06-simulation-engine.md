# Task 06: Simulation Engine (Core Tick & Action Handler)

**Depends on**: Tasks 02-05 (all simulation modules)
**Produces**: `src/simulation/engine.ts` and `tests/simulation/engine.test.ts` — the orchestrator that ties all modules together.

---

## What to do

### `src/simulation/engine.ts`

This is the heart of the simulation. It composes all the individual modules into a single tick function and handles player actions.

#### `tick(state: SimulationState, rng: RNG): SimulationState`

Runs one simulation step (1 day). Pure function: state in, state out.

Order of operations per tick:
1. Increment `tick` counter
2. If `antibioticActive`: call `applyAntibioticTick()`, decrement `antibioticTicksRemaining`. If remaining hits 0, set `antibioticActive = false` and push an info event "Antibiotic course completed."
3. If antibiotics NOT active: call `applyNaturalRegrowthTick()` for commensal regrowth
4. Recalculate `totalCommensalAbundance` (sum of all commensal abundances)
5. Recalculate `diversityIndex` using `shannonDiversity()`
6. Call `updateCDiff()` to update C. diff spore/vegetative/toxin dynamics
7. Call `updateHealthScore()` to update patient health
8. Check for **recurrence**: if `cdiff.vegetative` crossed above `RECURRENCE_THRESHOLD` this tick (was below last tick, now above), increment `recurrenceCount` and push a critical event
9. Call `determinePhase()` to update the simulation phase
10. Append a `HistoryEntry` to `history` array
11. Call `checkOutcome()` to see if the game has ended
12. Return the new state

#### `applyAction(state: SimulationState, action: PlayerAction, rng: RNG): SimulationState`

Handles player decisions:
- `ADMINISTER_ANTIBIOTICS`: Set `antibioticActive = true`, `antibioticTicksRemaining = ANTIBIOTIC_COURSE_DURATION`, increment `antibioticCoursesGiven`, push a warning event. If `intensity` is provided, optionally scale the kill rates.
- `ADMINISTER_THERAPEUTIC`: Call `applyTherapeuticIntervention()`
- `WAIT_AND_MONITOR`: No-op (just return state; time advancement happens separately)

#### `determinePhase(state: SimulationState): SimulationPhase`

Logic:
- If `outcome === 'durable_cure'` → `'resolved'`
- If `outcome === 'chronic_cdiff'` → `'chronic_infection'`
- If `therapeuticApplied && totalCommensalAbundance > 0.5` → `'microbiome_therapeutic'`
- If `antibioticActive && antibioticCoursesGiven > 1` → `'antibiotic_trap'`
- If `cdiff.vegetative > RECURRENCE_THRESHOLD` → `'cdiff_bloom'`
- If `antibioticActive` → `'antibiotic_disruption'`
- Default → `'healthy_baseline'`

#### `checkOutcome(state: SimulationState): SimulationOutcome | null`

- **Durable cure**: C. diff vegetative has been below 0.05 for the last `DURABLE_CURE_TICKS` consecutive ticks AND commensals are above 0.5 → return `'durable_cure'`
- **Chronic infection**: Tick count exceeds `MAX_SIMULATION_TICKS` without cure → return `'chronic_cdiff'`
- Otherwise → return `null` (game continues)

#### `createInitialState(rng: RNG, seed: number): SimulationState`

Factory function that builds the starting state:
- Call `generateInitialProfile(rng)` for commensals
- Call `generateInitialCDiffState(rng)` for C. diff
- Calculate initial `totalCommensalAbundance` and `diversityIndex`
- Set `healthScore = 100`, all counters to 0
- Initialize empty `history` (with one entry for tick 0) and `events` (with an intro message)
- Set `outcome = null`, `phase = 'healthy_baseline'`

### Tests — `tests/simulation/engine.test.ts`

This is the most important test file — it validates the **5-phase narrative arc**:

1. **Healthy baseline test**: Create initial state, run 10 ticks. Verify commensals stay near capacity, C. diff stays near zero, health stays at 100.

2. **Antibiotic disruption test**: From healthy state, apply `ADMINISTER_ANTIBIOTICS`, run 10 ticks. Verify commensals drop dramatically, C. diff vegetative also drops, but spores are preserved.

3. **C. diff bloom test**: After antibiotics complete (from test 2), run 20 more ticks WITHOUT intervention. Verify C. diff vegetative rises significantly, health drops.

4. **Antibiotic trap test**: From C. diff bloom, apply antibiotics again. Verify temporary C. diff reduction, then after course ends, another bloom occurs. Recurrence count should increase.

5. **Microbiome therapeutic test**: From a post-antibiotic depleted state, apply `ADMINISTER_THERAPEUTIC`, then run 30 ticks. Verify commensals recover rapidly, C. diff gets suppressed, health recovers.

6. **Durable cure test**: After therapeutic, run enough ticks (30+) to confirm `outcome` becomes `'durable_cure'`.

7. **Determinism test**: Same seed produces identical state after N ticks.

## Verify

- `npx vitest run` — ALL tests pass (including prior tasks' tests)
- `npm run build` — compiles cleanly
- The 5-phase narrative test is the critical validation that the simulation "tells the right story"
