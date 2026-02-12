# Task 09: Core UI Components (Dashboard, Controls, Indicators)

**Depends on**: Task 08 (chart working)
**Produces**: `PatientDashboard.tsx`, `TreatmentControls.tsx`, `TimeControls.tsx`, `HealthScoreBar.tsx`, `RecurrenceCounter.tsx`, `PhaseIndicator.tsx` — the main interactive UI.

---

## What to do

### `src/components/PatientDashboard.tsx`

Main layout component that arranges all child components in a grid. Use Tailwind CSS for layout.

Layout (top to bottom):
1. **Header row**: Title "GUT CHECK — The Microbiome Game", phase indicator, day counter
2. **Chart**: Full-width `PopulationChart`
3. **Stats row**: Health score bar, recurrence counter, antibiotic courses given (3 cards side by side)
4. **Controls row**: Treatment controls and time controls side by side

### `src/components/TreatmentControls.tsx`

Three treatment action buttons:
- **"Give Antibiotics"** — dispatches `ADMINISTER_ANTIBIOTICS`. Disabled when antibiotics are already active or game is over.
- **"Give Microbiome Therapy"** — dispatches `ADMINISTER_THERAPEUTIC`. Disabled when game is over. (Optionally: disabled until C. diff has been detected at least once, to guide the educational flow.)
- **"Wait and Monitor"** — dispatches `WAIT_AND_MONITOR` then auto-advances 7 ticks (one week). Disabled when game is over.

Style: Prominent buttons with distinct colors. Antibiotics = amber/orange, Therapy = green, Wait = gray/blue.

Show a brief description under each button explaining what it does (1 sentence, educational).

### `src/components/TimeControls.tsx`

Time advancement controls:
- **"Advance 1 Day"** button — dispatches `ADVANCE_ONE_TICK`
- **"Advance 1 Week"** button — dispatches `ADVANCE_WEEK`
- **"Auto-play" toggle** — when enabled, uses `setInterval` (every 300ms) to dispatch `ADVANCE_ONE_TICK`. Button toggles between "Start Auto-play" and "Stop Auto-play".
- All disabled when game outcome is not null.

Show current day counter: "Day {tick} / {MAX_SIMULATION_TICKS}"

### `src/components/HealthScoreBar.tsx`

Visual health indicator:
- Horizontal progress bar showing `healthScore` as percentage (0-100)
- Color transitions: green (>70), yellow (40-70), red (<40)
- Numeric display alongside: "Health: 82/100"
- Smooth CSS transitions on width and color changes

### `src/components/RecurrenceCounter.tsx`

Simple card showing:
- "C. diff Recurrences: {recurrenceCount}"
- Color intensifies with count (0 = green, 1 = yellow, 2+ = red)
- Show antibiotic courses given as a secondary stat: "Antibiotic Courses: {antibioticCoursesGiven}"

### `src/components/PhaseIndicator.tsx`

Shows the current simulation phase with educational context:
- Display phase name in human-readable form (e.g., "Healthy Baseline", "C. diff Bloom")
- Color-coded badge (green for healthy, red for bloom, etc.)
- Tooltip or subtitle with 1-sentence explanation of what's happening biologically:
  - healthy_baseline: "Your patient's gut is healthy with diverse commensal bacteria."
  - antibiotic_disruption: "Antibiotics are killing bacteria — both good and bad."
  - cdiff_bloom: "C. difficile is expanding into the empty gut niche!"
  - antibiotic_trap: "Antibiotics kill C. diff temporarily, but also prevent commensal recovery."
  - microbiome_therapeutic: "Therapeutic commensal spores are restoring the gut ecosystem."
  - resolved: "Durable cure achieved! The microbiome has recovered."
  - chronic_infection: "The patient developed chronic C. difficile infection."

### Update `src/App.tsx`

Replace the temporary layout with `<PatientDashboard />` as the main component (wrapped in `SimulationProvider`).

## Verify

- `npm run dev` — full dashboard renders with all components
- Treatment buttons are clickable and produce correct state changes (visible in chart)
- Buttons disable correctly (e.g., can't give antibiotics while a course is running)
- Time controls advance the simulation
- Auto-play animates the chart smoothly
- Health bar changes color as health declines
- Phase indicator updates as the simulation progresses
- `npm run build` — compiles cleanly
