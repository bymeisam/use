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

  describe('Custom values mode', () => {
    it('should toggle between custom string values', () => {
      const { result } = renderHook(() => useToggle('light', 'dark'))
      
      expect(result.current[0]).toBe('light')
      
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe('dark')
      
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe('light')
    })

    it('should toggle between custom number values', () => {
      const { result } = renderHook(() => useToggle(0, 1))
      
      expect(result.current[0]).toBe(0)
      
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(1)
    })

    it('should toggle between empty string and value', () => {
      const { result } = renderHook(() => useToggle('', 'active'))
      
      expect(result.current[0]).toBe('')
      
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe('active')
    })

    it('should toggle between object values', () => {
      const obj1 = { theme: 'light' }
      const obj2 = { theme: 'dark' }
      const { result } = renderHook(() => useToggle(obj1, obj2))
      
      expect(result.current[0]).toBe(obj1)
      
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(obj2)
    })

    it('should maintain stable toggle function reference with custom values', () => {
      const { result, rerender } = renderHook(() => useToggle('on', 'off'))
      const firstToggle = result.current[1]
      
      rerender()
      const secondToggle = result.current[1]
      
      expect(firstToggle).toBe(secondToggle)
    })
  })
})