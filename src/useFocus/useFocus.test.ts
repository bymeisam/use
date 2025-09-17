import { renderHook, act } from '@testing-library/react'
import { useFocus } from './useFocus'
import { vi, beforeEach, describe, it, expect } from 'vitest'

describe('useFocus', () => {
  beforeEach(() => {
    // Clear any focused element
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur()
    }
  })

  it('should return ref, focus, blur functions and isFocused property', () => {
    const { result } = renderHook(() => useFocus())

    expect(result.current).toHaveProperty('ref')
    expect(result.current).toHaveProperty('focus')
    expect(result.current).toHaveProperty('blur')
    expect(result.current).toHaveProperty('isFocused')
    expect(typeof result.current.focus).toBe('function')
    expect(typeof result.current.blur).toBe('function')
    expect(typeof result.current.isFocused).toBe('boolean')
  })

  it('should initialize with ref.current as null', () => {
    const { result } = renderHook(() => useFocus())

    expect(result.current.ref.current).toBeNull()
  })

  it('should focus the element when focus() is called', () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>())

    // Create a focusable element
    const input = document.createElement('input')
    document.body.appendChild(input)
    result.current.ref.current = input

    const focusSpy = vi.spyOn(input, 'focus')

    act(() => {
      result.current.focus()
    })

    expect(focusSpy).toHaveBeenCalledTimes(1)

    // Clean up
    document.body.removeChild(input)
    focusSpy.mockRestore()
  })

  it('should blur the element when blur() is called', () => {
    const { result } = renderHook(() => useFocus<HTMLInputElement>())

    // Create a focusable element
    const input = document.createElement('input')
    document.body.appendChild(input)
    result.current.ref.current = input

    const blurSpy = vi.spyOn(input, 'blur')

    act(() => {
      result.current.blur()
    })

    expect(blurSpy).toHaveBeenCalledTimes(1)

    // Clean up
    document.body.removeChild(input)
    blurSpy.mockRestore()
  })

  it('should not throw when focus() is called with null ref', () => {
    const { result } = renderHook(() => useFocus())

    expect(() => {
      act(() => {
        result.current.focus()
      })
    }).not.toThrow()
  })

  it('should not throw when blur() is called with null ref', () => {
    const { result } = renderHook(() => useFocus())

    expect(() => {
      act(() => {
        result.current.blur()
      })
    }).not.toThrow()
  })

  it('should return false for isFocused when ref is null', () => {
    const { result } = renderHook(() => useFocus())

    expect(result.current.isFocused).toBe(false)
  })

  it('should return correct isFocused status', async () => {
    const { result, rerender } = renderHook(() => useFocus<HTMLInputElement>())

    // Create a focusable element
    const input = document.createElement('input')
    document.body.appendChild(input)

    act(() => {
      result.current.ref.current = input
    })

    // Re-render to trigger useEffect
    rerender()

    // Initially not focused
    expect(result.current.isFocused).toBe(false)

    // Focus the element using the hook's focus method
    act(() => {
      result.current.focus()
    })

    expect(result.current.isFocused).toBe(true)

    // Blur the element
    act(() => {
      result.current.blur()
    })

    expect(result.current.isFocused).toBe(false)

    // Clean up
    document.body.removeChild(input)
  })

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useFocus())

    const firstFocus = result.current.focus
    const firstBlur = result.current.blur
    const firstRef = result.current.ref

    rerender()

    expect(result.current.focus).toBe(firstFocus)
    expect(result.current.blur).toBe(firstBlur)
    expect(result.current.ref).toBe(firstRef)
  })

  it('should work with different element types', () => {
    const { result: inputResult } = renderHook(() => useFocus<HTMLInputElement>())
    const { result: buttonResult } = renderHook(() => useFocus<HTMLButtonElement>())

    const input = document.createElement('input')
    const button = document.createElement('button')

    document.body.appendChild(input)
    document.body.appendChild(button)

    inputResult.current.ref.current = input
    buttonResult.current.ref.current = button

    const inputFocusSpy = vi.spyOn(input, 'focus')
    const buttonFocusSpy = vi.spyOn(button, 'focus')

    act(() => {
      inputResult.current.focus()
      buttonResult.current.focus()
    })

    expect(inputFocusSpy).toHaveBeenCalledTimes(1)
    expect(buttonFocusSpy).toHaveBeenCalledTimes(1)

    // Clean up
    document.body.removeChild(input)
    document.body.removeChild(button)
    inputFocusSpy.mockRestore()
    buttonFocusSpy.mockRestore()
  })

  describe('autoFocus', () => {
    it('should not auto focus by default', () => {
      const { result } = renderHook(() => useFocus<HTMLInputElement>())

      const input = document.createElement('input')
      document.body.appendChild(input)

      const focusSpy = vi.spyOn(input, 'focus')

      act(() => {
        result.current.ref.current = input
      })

      expect(focusSpy).not.toHaveBeenCalled()

      // Clean up
      document.body.removeChild(input)
      focusSpy.mockRestore()
    })

    it('should auto focus when autoFocus is true', () => {
      const { result, rerender } = renderHook(() => useFocus<HTMLInputElement>({ autoFocus: true }))

      const input = document.createElement('input')
      document.body.appendChild(input)

      const focusSpy = vi.spyOn(input, 'focus')

      act(() => {
        result.current.ref.current = input
      })

      // Re-render to trigger useEffect
      rerender()

      expect(focusSpy).toHaveBeenCalledTimes(1)
      expect(result.current.isFocused).toBe(true)

      // Clean up
      document.body.removeChild(input)
      focusSpy.mockRestore()
    })

    it('should not auto focus when autoFocus is false', () => {
      const { result } = renderHook(() => useFocus<HTMLInputElement>({ autoFocus: false }))

      const input = document.createElement('input')
      document.body.appendChild(input)

      const focusSpy = vi.spyOn(input, 'focus')

      act(() => {
        result.current.ref.current = input
      })

      expect(focusSpy).not.toHaveBeenCalled()
      expect(result.current.isFocused).toBe(false)

      // Clean up
      document.body.removeChild(input)
      focusSpy.mockRestore()
    })

    it('should handle autoFocus when element is not yet attached', () => {
      const { result, rerender } = renderHook(() => useFocus<HTMLInputElement>({ autoFocus: true }))

      // No element attached yet
      expect(result.current.ref.current).toBeNull()
      expect(result.current.isFocused).toBe(false)

      const input = document.createElement('input')
      document.body.appendChild(input)

      const focusSpy = vi.spyOn(input, 'focus')

      // Attach element
      act(() => {
        result.current.ref.current = input
      })

      // Re-render to trigger useEffect
      rerender()

      expect(focusSpy).toHaveBeenCalledTimes(1)

      // Clean up
      document.body.removeChild(input)
      focusSpy.mockRestore()
    })
  })
})