import { useState, useCallback } from 'react';

export function useToggle(): [boolean, () => void];
export function useToggle(initialValue: boolean): [boolean, () => void];
export function useToggle<T>(defaultValue: T, alternateValue: T): [T, () => void];
export function useToggle<T>(
  defaultValue?: boolean | T,
  alternateValue?: T
): [boolean | T, () => void] {
  // Boolean mode
  if (arguments.length <= 1) {
    const [value, setValue] = useState<boolean>(
      defaultValue as boolean ?? false
    );

    const toggle = useCallback(() => {
      setValue(prev => !prev);
    }, []);

    return [value, toggle] as const;
  }

  // Custom values mode
  const [value, setValue] = useState<T>(defaultValue as T);

  const toggle = useCallback(() => {
    setValue(prev => 
      prev === defaultValue ? alternateValue! : defaultValue as T
    );
  }, [defaultValue, alternateValue]);

  return [value, toggle] as const;
}