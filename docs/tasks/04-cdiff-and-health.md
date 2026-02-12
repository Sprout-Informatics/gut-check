# Task 04: C. diff Dynamics & Health Score

**Depends on**: Tasks 02-03 (types, constants, random)
**Produces**: `src/simulation/cdiff.ts`, `src/simulation/health.ts`, and tests for both.

---

## What to do

### `src/simulation/cdiff.ts` — C. difficile Population Dynamics

Export an `updateCDiff(state: SimulationState, rng: RNG): CDiffState` function.

The model has two C. diff forms with different behaviors:
- **Spores**: Dormant, survive antibiotics, germinate when commensals are low
- **Vegetative**: Active, produce toxin, grow rapidly, killed by antibiotics

Per-tick logic:

1. **Competitive exclusion factor**: Determines how much commensals suppress C. diff.
   ```
   exclusionRatio = clamp(totalCommensalAbundance / COMPETITIVE_EXCLUSION_THRESHOLD, 0, 1)
   exclusionFactor = clamp(1 - exclusionRatio * COMPETITIVE_EXCLUSION_STRENGTH, 0, 1)
   ```
   - When commensals are healthy (~0.85): exclusionFactor ≈ 0 (strong suppression)
   - When gut is empty (~0.0): exclusionFactor ≈ 1 (no suppression)

2. **Germination** (spores → vegetative):
   ```
   germinationRate = lerp(GERMINATION_BASE, GERMINATION_EMPTY, exclusionFactor) * (1 + rng.gaussian(0, 0.05))
   germinating = spores * germinationRate
   spores -= germinating
   vegetative += germinating
   ```

3. **Vegetative growth** (logistic, into available gut capacity):
   ```
   available = COMMENSAL_TOTAL_CAPACITY - totalCommensalAbundance - vegetative
   if available > 0:
     growth = CDIFF_VEGETATIVE_GROWTH_RATE * vegetative * (available / CAPACITY) * (1 + rng.gaussian(0, 0.03))
     vegetative += max(0, growth)
   ```

4. **Sporulation** (vegetative → spores, survival strategy):
   ```
   sporulating = vegetative * CDIFF_SPORULATION_RATE
   vegetative -= sporulating
   spores += sporulating
   ```

5. **Toxin production**:
   ```
   toxinLevel = vegetative * CDIFF_TOXIN_PRODUCTION_RATE
   ```

6. Clamp all values to >= 0. Return new `CDiffState`.

Also export a helper `lerp(a: number, b: number, t: number): number` (linear interpolation).

### `src/simulation/health.ts` — Patient Health Score

Export an `updateHealthScore(currentHealth: number, toxinLevel: number): number` function.

Logic:
- If `toxinLevel > 0.05`: `health -= HEALTH_TOXIN_DAMAGE_RATE * toxinLevel`
- Otherwise: `health += HEALTH_RECOVERY_RATE`
- Clamp result to [0, 100]

Also export a `shannonDiversity(commensals: BacterialPopulation[]): number` function:
- Calculate Shannon diversity index: `H = -Σ(p_i * log2(p_i))` where `p_i = abundance_i / total`
- Skip species with abundance <= 0
- Return 0 if total abundance is 0

### Tests — `tests/simulation/cdiff.test.ts` and `tests/simulation/health.test.ts`

**cdiff.test.ts**:
- With high commensal abundance (0.85): germination is very low, vegetative stays near 0
- With zero commensal abundance: germination is high, vegetative grows rapidly over multiple ticks
- Sporulation converts some vegetative to spores each tick
- Toxin level is proportional to vegetative cells
- All values stay non-negative

**health.test.ts**:
- High toxin causes health to decrease
- Low/zero toxin allows health recovery
- Health never goes below 0 or above 100
- Shannon diversity: equal abundances → maximum diversity; single species → 0; empty → 0

## Verify

- `npx vitest run` — all tests pass
- `npm run build` — compiles cleanly
