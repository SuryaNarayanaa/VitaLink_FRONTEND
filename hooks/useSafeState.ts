// useSafeState.ts
import { useState, useRef, useEffect } from 'react';

export function useSafeState<T>(initial: T | (() => T)) {
  const [state, setState] = useState(initial);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const safeSetState = (value: T | ((prevState: T) => T)) => {
    if (mountedRef.current) {
      setState(value);
    }
  };

  return [state, safeSetState] as const;
}
