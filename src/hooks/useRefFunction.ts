import { useCallback, useRef } from "react";

export function useRefFunction<T extends (...args: any[]) => any>(
  callback: T
): T {
  const ref = useRef<T>();
  ref.current = callback;

  return useCallback((...args: unknown[]) => ref.current?.(...args), []) as T;
}
