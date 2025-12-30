export type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const err = (error: Error): Result<never> => ({ ok: false, error });

export const map = <T, U>(r: Result<T>, f: (v: T) => U): Result<U> =>
  r.ok ? ok(f(r.value)) : r;

export const andThen = <T, U>(r: Result<T>, f: (v: T) => Result<U>): Result<U> =>
  r.ok ? f(r.value) : r;
