# Task 08: Population Dynamics Chart

**Depends on**: Task 07 (state management wired up)
**Produces**: `src/components/PopulationChart.tsx` — the centerpiece visualization of the app.

---

## What to do

### `src/components/PopulationChart.tsx`

Build the main chart using Recharts. This is the most important visual in the app — it's what students look at to understand the microbiome dynamics.

**Chart type**: `ComposedChart` (combines area and line charts)

**Data source**: `state.simulation.history` array — each entry is one tick's worth of data.

**What to plot**:
1. **Commensals** (stacked area, green shades): `totalCommensalAbundance` as a filled area chart in green
2. **C. diff vegetative** (area, red): `cdiffVegetative` as a filled area in red/coral
3. **C. diff spores** (dashed line, orange): `cdiffSpores` as a dashed line
4. **Diversity index** (line, blue, secondary Y-axis): `diversityIndex` as a line on the right Y-axis
5. **Health score** (line, purple, secondary Y-axis): `healthScore` as a line on the right Y-axis (0-100 scale)

**Chart features**:
- X-axis: `tick` labeled as "Day"
- Left Y-axis: Abundance (0 to 1.0)
- Right Y-axis: Score (0 to 100) for health, and a matching scale for diversity
- Tooltip showing all values on hover
- Legend at the bottom
- Responsive width (fills container)
- Height: ~400px

**Styling**:
- Commensals: `#22c55e` (green-500)
- C. diff vegetative: `#ef4444` (red-500)
- C. diff spores: `#f97316` (orange-500), dashed stroke
- Diversity: `#3b82f6` (blue-500)
- Health: `#a855f7` (purple-500)

### Update `src/App.tsx`

Replace the debug number display with the `PopulationChart` component. Also add temporary buttons for testing:
- "Advance 1 Day" — dispatches `ADVANCE_ONE_TICK`
- "Advance 1 Week" — dispatches `ADVANCE_WEEK`
- "Give Antibiotics" — dispatches `PLAYER_ACTION` with `ADMINISTER_ANTIBIOTICS`
- "Give Therapeutic" — dispatches `PLAYER_ACTION` with `ADMINISTER_THERAPEUTIC`

These temporary buttons let you visually verify the chart by stepping through the simulation manually.

## Verify

- `npm run dev` — chart renders with initial data point
- Click "Advance 1 Week" several times — chart shows stable green area (healthy baseline)
- Click "Give Antibiotics" then advance — green drops, watch for red C. diff bloom after antibiotics end
- Click "Give Therapeutic" from depleted state — green area recovers
- Chart is responsive (resize browser window)
- `npm run build` — compiles cleanly
