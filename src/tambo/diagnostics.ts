export type TamboDiag = {
  message: string;
  name?: string;
  stack?: string;
  apiKeyPresent: boolean;
  origin: string;
  userAgent: string;
  time: string;
};

export function toTamboDiag(err: unknown): TamboDiag {
  const e = err instanceof Error ? err : new Error(String(err));
  return {
    message: e.message,
    name: e.name,
    stack: e.stack,
    apiKeyPresent: Boolean(import.meta.env.VITE_TAMBO_API_KEY),
    origin: window.location.origin,
    userAgent: navigator.userAgent,
    time: new Date().toISOString(),
  };
}
