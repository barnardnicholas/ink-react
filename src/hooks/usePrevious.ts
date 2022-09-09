import { useEffect, useRef } from 'react';

/**
 * Use in React Components for prevProps
 * @param value - Value to reference
 * @return Reference to value
 */

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export default usePrevious;
