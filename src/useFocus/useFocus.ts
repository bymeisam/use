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

  // Check for element changes and set up listeners on every render
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setIsFocused(false);
      return;
    }

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);

    // Set initial focus state based on current active element
    const isCurrentlyFocused = document.activeElement === element;
    setIsFocused(isCurrentlyFocused);

    // Handle auto focus when element is attached and not already focused
    if (autoFocus && !isCurrentlyFocused) {
      element.focus();
    }

    return () => {
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
    };
  }); // No dependency array - run on every render to catch ref changes

  return {
    ref,
    focus,
    blur,
    isFocused,
  };
}

