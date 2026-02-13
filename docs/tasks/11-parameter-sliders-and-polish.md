# Task 11: Parameter Sliders, Seed Input & Visual Polish

**Depends on**: Task 10 (all core features working)
**Produces**: `src/components/ParameterSliders.tsx`, seed input, responsive layout, visual polish.

---

## What to do

### `src/components/ParameterSliders.tsx`

An "Advanced Settings" panel, hidden behind a toggle/collapsible section so it doesn't overwhelm students by default.

**Sliders** (range inputs):
- **Antibiotic Intensity** (0.3 - 1.0, default 0.7): Scales `COMMENSAL_ANTIBIOTIC_KILL_RATE`. Higher = more destructive antibiotics.
- **Therapeutic Dose** (0.1 - 0.8, default 0.4): Scales `THERAPEUTIC_COMMENSAL_BOOST`. Higher = more commensal spores delivered.
- **C. diff Growth Rate** (0.05 - 0.3, default 0.15): Adjusts `CDIFF_VEGETATIVE_GROWTH_RATE`. Higher = more aggressive pathogen.
- **Commensal Recovery Rate** (0.03 - 0.15, default 0.08): Adjusts `COMMENSAL_BASE_GROWTH_RATE`.

Each slider shows its current value and has a label explaining what it controls.

**Implementation note**: These adjustments only apply to NEW simulations (dispatch `RESET` after changing parameters) OR you can make them apply live by passing parameter overrides into the tick function. Choose whichever is simpler — applying on reset is fine for the educational purpose.

### Seed Input

Add a small input field (in the header or advanced settings) where students can:
- See their current simulation seed
- Enter a specific seed and click "Start with Seed" to replay a specific scenario
- This enables the teacher to give all students the same seed for a guided walkthrough

### Visual Polish

Apply Tailwind CSS refinements across all components:

1. **Color theme**: Clean, medical/scientific feel. White background, subtle borders, good contrast.
2. **Typography**: Clear hierarchy — h1 for title, h2 for section headers, readable body text.
3. **Responsive layout**: Works on both a classroom projector (wide) and a student laptop (narrower). Use Tailwind responsive breakpoints:
   - Desktop: 2-column layout for controls
   - Tablet/small: stacked single column
4. **Button states**: Clear hover, active, and disabled styles. Disabled buttons should look obviously inactive.
5. **Transitions**: Smooth CSS transitions on health bar, phase badge color changes.
6. **Card styling**: Stats cards (health, recurrences, courses) should have consistent card styling with subtle shadows.
7. **Chart container**: Give it a bordered container with a header label.

### Update PatientDashboard

- Add ParameterSliders in a collapsible "Advanced Settings" section at the bottom
- Add seed display/input in the header area
- Ensure the overall layout is responsive and polished

## Verify

- `npm run dev` — sliders work, adjusting parameters affects simulation behavior after reset
- Seed input allows replaying specific scenarios
- Advanced settings toggle hides/shows the sliders panel
- Layout looks good at different viewport widths (resize browser)
- All interactive elements have clear visual feedback (hover, active, disabled states)
- `npm run build` — compiles cleanly
- Full playthrough: start → antibiotics → C. diff bloom → more antibiotics (trap) → therapeutic → cure. All phases are visually clear and educationally compelling.
