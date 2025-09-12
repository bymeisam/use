import { useState, useCallback } from "react";

function useToggle(defaultValue: boolean): [boolean, () => void, () => void];
function useToggle<T>(
  defaultValue: T,
  alternateValue: T,
): [T, () => void, () => void];
function useToggle<T>(
  defaultValue: T,
  alternateValue?: T,
): [T, () => void, () => void] {
  if (alternateValue === undefined && typeof defaultValue === "boolean") {
    alternateValue = !defaultValue as T;
  }

  if (alternateValue === undefined) {
    throw new Error("useToggle requires two arguments for non-boolean values");
  }

  const [state, setState] = useState(true);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, [setState]);

  const reset = useCallback(() => {
    setState(true);
  }, [setState]);
  const value = state ? defaultValue : alternateValue;
  return [value, toggle, reset];
}

export { useToggle };
