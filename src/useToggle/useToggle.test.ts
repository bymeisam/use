import { renderHook, act } from '@testing-library/react'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useToggle())
    const [value] = result.current
    
    expect(value).toBe(false)
  })

  it('should initialize with provided initial value', () => {
    const { result } = renderHook(() => useToggle(true))
    const [value] = result.current
    
    expect(value).toBe(true)
  })

  it('should toggle value when toggle function is called', () => {
    const { result } = renderHook(() => useToggle(false))
    
    // Initial value should be false
    expect(result.current[0]).toBe(false)
    
    // Toggle to true
    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(true)
    
    // Toggle back to false
    act(() => {
      result.current[1]()
    })
    expect(result.current[0]).toBe(false)
  })

  it('should maintain stable toggle function reference', () => {
    const { result, rerender } = renderHook(() => useToggle())
    const firstToggle = result.current[1]
    
    // Trigger a re-render
    rerender()
    const secondToggle = result.current[1]
    
    expect(firstToggle).toBe(secondToggle)
  })
})