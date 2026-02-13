# Task 10: Event Log & Game Summary

**Depends on**: Task 09 (core UI working)
**Produces**: `src/components/EventLog.tsx`, `src/components/GameSummary.tsx` — narrative feedback and end-state.

---

## What to do

### `src/components/EventLog.tsx`

A scrollable log panel showing the simulation's narrative events.

**Data source**: `state.simulation.events` array.

**Display**:
- Most recent events at the top
- Each entry shows: Day number, icon/color by type, message text
- Type styling:
  - `info`: blue/neutral — general simulation events
  - `warning`: amber — antibiotics started, potential concern
  - `critical`: red — C. diff recurrence, health crisis
  - `success`: green — therapeutic applied, cure achieved
- Scrollable container with max height (~200px), auto-scrolls to show newest
- If no events yet, show placeholder text

**Layout**: Place below the chart and stats area in the PatientDashboard.

### `src/components/GameSummary.tsx`

Modal or overlay that appears when `state.simulation.outcome` is not null.

**For `durable_cure`**:
- Title: "Durable Cure Achieved!"
- Green styling
- Stats: Days to cure, recurrence count, antibiotic courses used, whether therapeutic was used
- Educational message: "By restoring the commensal bacteria, competitive exclusion pushed C. difficile out of the gut permanently. This is how microbiome therapeutics like Vowst work — they don't kill the pathogen directly, they restore the ecosystem that keeps it in check."
- Score/rating based on performance (fewer courses + fewer recurrences + fewer days = better)

**For `chronic_cdiff`**:
- Title: "Chronic C. difficile Infection"
- Red styling
- Stats: Same as above
- Educational message varies based on what the student did:
  - If they only used antibiotics: "Repeated antibiotic courses kept killing the recovering commensals, creating a cycle of recurrence. The microbiome therapeutic could have broken this cycle by directly repopulating the gut."
  - If they never intervened: "Without intervention, the depleted microbiome couldn't recover fast enough to prevent C. difficile from taking over."
- "Try Again" button that dispatches `RESET`

### Update `PatientDashboard.tsx`

- Add `EventLog` to the layout (below the main content area)
- Add `GameSummary` (renders conditionally when outcome is set)

## Verify

- `npm run dev` — event log shows events as simulation progresses
- Events appear with correct coloring and chronological order
- Game summary appears when outcome is reached (play through to durable cure or chronic infection)
- "Try Again" resets the simulation
- Educational messages display correctly for both outcomes
- `npm run build` — compiles cleanly
