# Gut-Check: Microbiome Simulation Web App — Implementation Plan

## Context

This is an educational web app for a high school workshop called "The Microbiome Game — Why More Antibiotics Can Make Things Worse." Students manage a simulated patient's gut microbiome, making treatment decisions and observing population dynamics in real time. The goal is to teach competitive exclusion, antibiotic resistance traps, and microbiome therapeutics through interactive simulation.

The repo (`Sprout-Informatics/gut-check`) currently contains only a `README.md` with the workshop concept. Everything needs to be built from scratch.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18+ via Vite | Fast dev, minimal config, modern standard |
| Language | TypeScript | Catches simulation math bugs early |
| Charting | Recharts | React-native, simple API for line/area charts |
| Styling | Tailwind CSS | Rapid UI prototyping for educational tool |
| State | React `useReducer` + Context | Simulation is a state machine; no need for Redux |
| Testing | Vitest | Comes with Vite; critical for validating simulation math |
| Deployment | Static (GitHub Pages or Vercel) | No backend needed — all client-side |

---

## Project Structure

```
gut-check/
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── simulation/          # PURE LOGIC — no React, no UI
│   │   ├── types.ts         # All TypeScript interfaces
│   │   ├── constants.ts     # Biological parameters & defaults
│   │   ├── engine.ts        # Core tick function: state -> state
│   │   ├── antibiotics.ts   # Antibiotic effect calculations
│   │   ├── regrowth.ts      # Natural and therapeutic regrowth
│   │   ├── cdiff.ts         # C. diff spore/vegetative dynamics
│   │   ├── health.ts        # Patient health score
│   │   ├── random.ts        # Seeded PRNG
│   │   └── profiles.ts      # Randomized initial microbiome profiles
│   │
│   ├── state/               # React state management
│   │   ├── SimulationContext.tsx
│   │   └── reducer.ts
│   │
│   └── components/          # React UI components
│       ├── PatientDashboard.tsx
│       ├── PopulationChart.tsx
│       ├── HealthScoreBar.tsx
│       ├── TreatmentControls.tsx
│       ├── ParameterSliders.tsx
│       ├── RecurrenceCounter.tsx
│       ├── PhaseIndicator.tsx
│       ├── TimeControls.tsx
│       ├── EventLog.tsx
│       └── GameSummary.tsx
│
└── tests/
    └── simulation/
        ├── engine.test.ts
        ├── antibiotics.test.ts
        ├── regrowth.test.ts
        └── cdiff.test.ts
```

**Key architectural principle**: `simulation/` contains **zero React imports** — pure TypeScript functions that take state in and return state out. This makes the simulation testable, debuggable, and portable. The React layer is a thin shell that calls into the engine and renders results.

---

## Core Simulation Engine

### Population Dynamics Model

Modified **Lotka-Volterra competition model** with discrete daily time steps (Euler method). Simplified for educational clarity while producing qualitatively correct dynamics across all 5 phases.

### Per-Tick Update (pseudocode)

```
For each commensal species i:
  if antibiotics_active:
    abundance[i] *= (1 - sensitivity[i] * kill_rate)     # exponential decay
  else:
    available = CAPACITY - total_commensal - cdiff_vegetative
    growth = growth_rate[i] * abundance[i] * (available / CAPACITY)  # logistic growth
    abundance[i] += growth

# C. diff dynamics
exclusion_factor = 1 - (total_commensal / threshold) * strength   # 0=healthy, 1=empty gut
germination_rate = lerp(BASE_GERMINATION, EMPTY_GERMINATION, exclusion_factor)
vegetative += spores * germination_rate                            # spores -> active cells
vegetative grows logistically into available capacity
some vegetative -> spores (sporulation)

if antibiotics_active:
  vegetative *= (1 - kill_rate)    # antibiotics kill active cells
  spores unchanged                  # SPORES SURVIVE — this is the key insight

toxin = vegetative * toxin_rate
health -= damage(toxin) or health += recovery
```

This produces the correct 5-phase narrative:
1. **Healthy baseline**: Commensals near capacity, competitive exclusion suppresses C. diff
2. **Antibiotic disruption**: Commensals and C. diff vegetative cells killed; spores survive
3. **C. diff bloom**: Vacant niche + spore germination = rapid C. diff expansion
4. **Antibiotic trap**: Treating again kills C. diff temporarily but also kills recovering commensals, leading to recurrence
5. **Microbiome therapeutic**: Commensal bolus restores competitive exclusion durably

### Key Simulation Modules

#### `random.ts` — Seeded PRNG
- Mulberry32 algorithm (fast, seedable, deterministic)
- Seed from `Date.now()` on game start; student can enter a seed for reproducibility
- Provides `next()`, `range(min, max)`, `gaussian(mean, stddev)`

#### `profiles.ts` — Microbiome Profile Generator
- Pool of ~15 real commensal genus names (Bacteroides, Faecalibacterium, etc.)
- Each run picks 8-12 species randomly with randomized abundances, growth rates, antibiotic sensitivities, and competitive strengths
- Different seeds = different patient profiles = different gameplay

#### `antibiotics.ts` — Antibiotic Simulation
- Kills commensals proportional to each species' sensitivity (randomized per species)
- Kills C. diff vegetative cells at high rate
- C. diff spores completely unaffected
- Course lasts ~10 ticks (days)

#### `regrowth.ts` — Natural vs. Therapeutic Regrowth
- **Natural (no intervention)**: Very slow. Nearly-extinct species have only ~2% per-tick chance of beginning recovery. Takes months (60-90+ ticks) to reach healthy steady state. Leaves gut vulnerable to C. diff outgrowth.
- **Vowst/SER-109 therapeutic**: Immediate bolus adding ~0.4 total commensal abundance across 8 species. Boosted species get extra growth rate. Competitive exclusion re-established within days.

#### `cdiff.ts` — C. difficile Dynamics
- Two-form model: spores (dormant, antibiotic-resistant) and vegetative (active, toxin-producing)
- Germination rate inversely proportional to commensal abundance (competitive exclusion)
- Sporulation: some vegetative cells become spores each tick (survival strategy)
- Toxin production drives health decline

#### `health.ts` — Patient Health Score
- 0-100 scale
- Toxin above threshold causes damage; below threshold allows recovery
- Maps directly to C. diff vegetative abundance

#### `engine.ts` — Core Tick & Action Handler
- `tick(state, rng) -> newState`: Runs one simulation step (all modules above in sequence)
- `applyAction(state, action, rng) -> newState`: Handles player decisions
- Actions: `ADMINISTER_ANTIBIOTICS`, `ADMINISTER_THERAPEUTIC`, `WAIT_AND_MONITOR`
- Tracks recurrences, phase transitions, events, full history for charting

---

## React State Management

- `useReducer` with actions: `INIT_SIMULATION`, `PLAYER_ACTION`, `ADVANCE_ONE_TICK`, `ADVANCE_WEEK`, `RESET`
- Reducer calls into pure simulation engine functions
- Context provider makes state available to all components
- RNG seeded deterministically per-tick: `createRNG(seed + tick)`

---

## UI Components

| Component | Responsibility |
|-----------|---------------|
| `PatientDashboard` | Main layout grid arranging all components |
| `PopulationChart` | Recharts `ComposedChart` — stacked area for commensals (greens), lines for C. diff (red), diversity index (blue). **Centerpiece visual.** |
| `HealthScoreBar` | Animated bar, color-coded: green >70, yellow >40, red <40 |
| `TreatmentControls` | Three buttons: Give Antibiotics, Give Microbiome Therapy, Wait & Monitor. Contextually disabled. |
| `ParameterSliders` | Range inputs for antibiotic intensity, therapeutic dose. Behind "Advanced" toggle. |
| `RecurrenceCounter` | Numeric display of C. diff relapses |
| `PhaseIndicator` | Current phase name + educational tooltip |
| `TimeControls` | Advance 1 day, 1 week, or auto-play |
| `EventLog` | Scrollable log of game events, color-coded by severity |
| `GameSummary` | End-state: final stats, score, educational takeaway |

---

## Implementation Sequence

### Phase A: Project Scaffolding
1. `npm create vite@latest` with React + TypeScript template
2. Install dependencies: `recharts`, `tailwindcss`, `@tailwindcss/vite`
3. Set up directory structure
4. Configure Vitest

### Phase B: Simulation Engine (core logic, no UI)
1. `types.ts` — all interfaces
2. `constants.ts` — biological parameters
3. `random.ts` — seeded PRNG
4. `profiles.ts` — profile generator
5. `cdiff.ts` — C. diff dynamics
6. `antibiotics.ts` — antibiotic effects
7. `regrowth.ts` — natural + therapeutic regrowth
8. `health.ts` — health score
9. `engine.ts` — tick function + action handler
10. Write tests validating the 5-phase narrative plays out correctly

### Phase C: State Management
1. `reducer.ts` — wraps simulation engine for React
2. `SimulationContext.tsx` — context provider + `useSimulation` hook

### Phase D: Core UI
1. `App.tsx` — layout skeleton with SimulationProvider
2. `PopulationChart.tsx` — the chart (build first, it's the primary feedback)
3. `TreatmentControls.tsx` — action buttons
4. `TimeControls.tsx` — advance time
5. `HealthScoreBar.tsx`, `RecurrenceCounter.tsx`, `PhaseIndicator.tsx`
6. `EventLog.tsx`

### Phase E: Polish
1. `ParameterSliders.tsx` — advanced parameter tweaking
2. `GameSummary.tsx` — end-state summary + educational message
3. Responsive layout, color theming, tooltips

---

## Verification

1. **Unit tests**: Run `npx vitest` — all simulation module tests pass
2. **Manual playthrough**: Start app (`npm run dev`), play through all 5 phases:
   - Observe healthy baseline (commensals high, C. diff suppressed)
   - Trigger antibiotic disruption (commensals crash)
   - Watch C. diff bloom (red grows as green collapses)
   - Try antibiotic trap (temporary relief, then recurrence)
   - Apply therapeutic (commensals restored, durable cure)
3. **Randomization**: Refresh page multiple times — each run produces a different but coherent trajectory
4. **Edge cases**: Give 5+ antibiotic courses, give therapeutic immediately, wait 180 days without intervening
5. **Build**: `npm run build` succeeds with no errors
