import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Runs an async mock-API call and exposes loading/data/error, plus a refetch for retry buttons. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const requestId = useRef(0);

  const run = useCallback(() => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    fn()
      .then((data) => {
        if (id === requestId.current) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (id === requestId.current) {
          const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
          setState({ data: null, loading: false, error: message });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}
