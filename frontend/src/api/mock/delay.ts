export function wait(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface SimulateOptions {
  ms?: number;
  failRate?: number;
  errorMessage?: string;
}

/** Wraps a synchronous mock computation with realistic async latency and an optional simulated failure rate. */
export async function simulate<T>(fn: () => T, opts: SimulateOptions = {}): Promise<T> {
  await wait(opts.ms ?? 400 + Math.random() * 250);
  if (opts.failRate && Math.random() < opts.failRate) {
    throw new Error(opts.errorMessage ?? "We couldn't complete that request. Please try again.");
  }
  return fn();
}
