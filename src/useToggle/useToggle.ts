import { useState, useCallback } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return [value, toggle] as const;
}