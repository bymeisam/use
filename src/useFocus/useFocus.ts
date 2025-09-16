import { useRef, useCallback, useState, useEffect, RefObject } from "react";

export interface UseFocusOptions {
  autoFocus?: boolean;
}

export interface UseFocusReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T | null>;
  focus: () => void;
  blur: () => void;
  isFocused: boolean;
}

export function useFocus<T extends HTMLElement = HTMLElement>(
  options: UseFocusOptions = {},
): UseFocusReturn<T> {
  const { autoFocus = false } = options;
  const ref = useRef<T>(null);
  const [isFocused, setIsFocused] = useState(false);

  const focus = useCallback(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const blur = useCallback(() => {
    if (ref.current) {
      ref.current.blur();
    }
  }, []);

  // Set up event listeners (only when element changes)
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);

    // Set initial focus state
    setIsFocused(document.activeElement === element);

    return () => {
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Handle auto focus (separate effect)
  useEffect(() => {
    const element = ref.current;
    if (!element || !autoFocus) return;

    element.focus();
  }, [autoFocus]);

  return {
    ref,
    focus,
    blur,
    isFocused,
  };
}

