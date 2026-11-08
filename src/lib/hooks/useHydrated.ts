import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Server and the first client render must agree (both "false") to avoid a
// hydration mismatch; only after hydration does the client snapshot flip to
// "true". Extracted from ThemeToggle (see docs/decisions.md, "Revisão:
// ThemeToggle precisa de guarda 'mounted'") now that TetrisCanvas needs the
// same guard for its pause/resume button.
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
