import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    const [debouncedValue, setValue, currentValue] = result.current;

    expect(debouncedValue).toBe("initial");
    expect(currentValue).toBe("initial");
    expect(typeof setValue).toBe("function");
  });

  it("should debounce value changes", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    let [debouncedValue, setValue, currentValue] = result.current;
    expect(debouncedValue).toBe("initial");
    expect(currentValue).toBe("initial");

    act(() => {
      setValue("updated");
    });

    [debouncedValue, setValue, currentValue] = result.current;
    expect(debouncedValue).toBe("initial");
    expect(currentValue).toBe("updated");

    act(() => {
      vi.advanceTimersByTime(250);
    });

    [debouncedValue, setValue, currentValue] = result.current;
    expect(debouncedValue).toBe("initial");
    expect(currentValue).toBe("updated");

    act(() => {
      vi.advanceTimersByTime(250);
    });

    [debouncedValue, setValue, currentValue] = result.current;
    expect(debouncedValue).toBe("updated");
    expect(currentValue).toBe("updated");
  });

  it("should reset timer on subsequent changes", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    act(() => {
      result.current[1]("first");
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    act(() => {
      result.current[1]("second");
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current[0]).toBe("initial");
    expect(result.current[2]).toBe("second");

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current[0]).toBe("second");
    expect(result.current[2]).toBe("second");
  });

  it("should work with different data types", () => {
    const { result } = renderHook(() => useDebounce({ count: 0 }, 300));

    expect(result.current[0]).toEqual({ count: 0 });
    expect(result.current[2]).toEqual({ count: 0 });

    act(() => {
      result.current[1]({ count: 1 });
    });

    expect(result.current[0]).toEqual({ count: 0 });
    expect(result.current[2]).toEqual({ count: 1 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current[0]).toEqual({ count: 1 });
    expect(result.current[2]).toEqual({ count: 1 });
  });

  it("should maintain stable setter function reference", () => {
    const { result, rerender } = renderHook(() => useDebounce("test", 500));

    const initialSetter = result.current[1];

    act(() => {
      result.current[1]("updated");
    });

    rerender();

    expect(result.current[1]).toBe(initialSetter);
  });

  it("should handle rapid successive updates", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));

    act(() => {
      result.current[1]("first");
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current[1]("second");
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current[1]("third");
    });

    // Should still be initial after 200ms total
    expect(result.current[0]).toBe("initial");
    expect(result.current[2]).toBe("third");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now should be updated to the last value
    expect(result.current[0]).toBe("third");
    expect(result.current[2]).toBe("third");
  });
});