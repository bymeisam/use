import { renderHook, act } from '@testing-library/react'
import { useClickOutside } from './useClickOutside'
import { vi, beforeEach, describe, it, expect } from 'vitest'

describe('useClickOutside', () => {
  const mockCallback = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a ref object', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    expect(result.current).toHaveProperty('current')
    expect(result.current.current).toBeNull()
  })

  it('should call callback when clicking outside the element', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    // Create a mock element
    const mockElement = document.createElement('div')
    result.current.current = mockElement

    // Create a click event outside the element
    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        enumerable: true,
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)

    // Clean up
    document.body.removeChild(outsideElement)
  })

  it('should not call callback when clicking inside the element', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    // Create a mock element with a child
    const mockElement = document.createElement('div')
    const childElement = document.createElement('span')
    mockElement.appendChild(childElement)
    result.current.current = mockElement

    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'target', {
        value: childElement,
        enumerable: true,
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should not call callback when clicking on the element itself', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    result.current.current = mockElement

    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'target', {
        value: mockElement,
        enumerable: true,
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should not call callback when ref.current is null', () => {
    renderHook(() => useClickOutside(mockCallback))

    // ref.current is null by default
    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        enumerable: true,
      })
      document.dispatchEvent(event)
    })

    expect(mockCallback).not.toHaveBeenCalled()

    // Clean up
    document.body.removeChild(outsideElement)
  })

  it('should update event listener when callback changes', () => {
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    const { result, rerender } = renderHook(
      ({ callback }) => useClickOutside(callback),
      { initialProps: { callback: firstCallback } }
    )

    const mockElement = document.createElement('div')
    result.current.current = mockElement

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    // Click with first callback
    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        enumerable: true,
      })
      document.dispatchEvent(event)
    })

    expect(firstCallback).toHaveBeenCalledTimes(1)
    expect(secondCallback).not.toHaveBeenCalled()

    // Update callback
    rerender({ callback: secondCallback })

    // Click with second callback
    act(() => {
      const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        enumerable: true,
      })
      document.dispatchEvent(event)
    })

    expect(firstCallback).toHaveBeenCalledTimes(1) // Should not increase
    expect(secondCallback).toHaveBeenCalledTimes(1)

    // Clean up
    document.body.removeChild(outsideElement)
  })

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => useClickOutside(mockCallback))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })

  it('should handle multiple clicks correctly', () => {
    const { result } = renderHook(() => useClickOutside(mockCallback))

    const mockElement = document.createElement('div')
    result.current.current = mockElement

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    // Multiple clicks outside
    act(() => {
      const event1 = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event1, 'target', {
        value: outsideElement,
        enumerable: true,
      })
      document.dispatchEvent(event1)

      const event2 = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(event2, 'target', {
        value: outsideElement,
        enumerable: true,
      })
      document.dispatchEvent(event2)
    })

    expect(mockCallback).toHaveBeenCalledTimes(2)

    // Clean up
    document.body.removeChild(outsideElement)
  })
})