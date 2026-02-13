# Task 07: React State Management (Reducer + Context)

**Depends on**: Task 06 (simulation engine)
**Produces**: `src/state/reducer.ts`, `src/state/SimulationContext.tsx` — the bridge between the pure simulation engine and the React UI.

---

## What to do

### `src/state/reducer.ts`

Define the React reducer that wraps the simulation engine for use with `useReducer`.

**App-level state type**:
```typescript
interface AppState {
  simulation: SimulationState;
}
```

**Action types** (discriminated union `AppAction`):
- `{ type: 'INIT_SIMULATION'; seed?: number }` — start a new game
- `{ type: 'PLAYER_ACTION'; action: PlayerAction }` — player makes a treatment decision
- `{ type: 'ADVANCE_ONE_TICK' }` — advance 1 day
- `{ type: 'ADVANCE_WEEK' }` — advance 7 days
- `{ type: 'RESET' }` — restart the simulation
- `{ type: 'UPDATE_PARAMETER'; key: string; value: number }` — for advanced parameter tweaking (future use)

**Reducer logic**:
- `INIT_SIMULATION`: Generate seed from `Date.now()` (or use provided seed), create RNG, call `createInitialState(rng, seed)`.
- `PLAYER_ACTION`: Create per-tick RNG as `createRNG(state.simulation.rngSeed + state.simulation.tick)`, call `applyAction()` then `tick()` to apply the action and advance one step.
- `ADVANCE_ONE_TICK`: Create per-tick RNG, call `tick()` once.
- `ADVANCE_WEEK`: Loop 7 times, each time creating a per-tick RNG and calling `tick()`.
- `RESET`: Dispatch `INIT_SIMULATION` internally.
- `UPDATE_PARAMETER`: Store parameter overrides (placeholder for now — can be expanded in Task 11).

Export the reducer function and the `AppAction` type.

### `src/state/SimulationContext.tsx`

Create a React Context + Provider that makes the simulation state and dispatch function available to all components.

**Exports**:
- `SimulationProvider` — wraps children with the context. Uses `useReducer` with the simulation reducer, initialized with a fresh simulation.
- `useSimulation()` — custom hook that returns `{ state: AppState; dispatch: React.Dispatch<AppAction> }`. Throws an error if used outside the provider.

**Provider setup**:
```tsx
function SimulationProvider({ children }) {
  const [state, dispatch] = useReducer(simulationReducer, null, () => {
    const seed = Date.now();
    const rng = createRNG(seed);
    return { simulation: createInitialState(rng, seed) };
  });

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
}
```

### Update `src/App.tsx`

Wrap the app content in `<SimulationProvider>`. For now, just render a placeholder that shows:
- Current tick/day
- Current phase
- Health score
- Total commensal abundance (as a number)
- C. diff vegetative level (as a number)

This is a temporary debug display to verify the state management is wired up correctly before building real UI components.

## Verify

- `npm run dev` — app loads, shows initial state values (day 0, healthy baseline, health 100, commensals ~0.85, C. diff ~0)
- Refreshing the page shows slightly different commensal values (different seed each time)
- `npm run build` — compiles cleanly
