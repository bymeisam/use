import { renderHook, act } from '@testing-library/react'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  describe('Boolean mode', () => {
    it('should initialize with the default value', () => {
      const { result } = renderHook(() => useToggle(true))
      const [value] = result.current
      
      expect(value).toBe(true)
    })

    it('should initialize with false when defaultValue is false', () => {
      const { result } = renderHook(() => useToggle(false))
      const [value] = result.current
      
      expect(value).toBe(false)
    })

    it('should toggle between true and false', () => {
      const { result } = renderHook(() => useToggle(true))
      
      // Initial value should be true
      expect(result.current[0]).toBe(true)
      
      // Toggle to false
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(false)
      
      // Toggle back to true
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(true)
    })

    it('should reset to default value', () => {
      const { result } = renderHook(() => useToggle(true))
      
      // Toggle to false
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(false)
      
      // Reset to default (true)
      act(() => {
        result.current[2]()
      })
      expect(result.current[0]).toBe(true)
    })

    it('should maintain stable function references', () => {
      const { result, rerender } = renderHook(() => useToggle(false))
      const firstToggle = result.current[1]
      const firstReset = result.current[2]
      
      rerender()
      
      expect(result.current[1]).toBe(firstToggle)
      expect(result.current[2]).toBe(firstReset)
    })
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
      
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(0)
    })

    it('should reset to default value with custom values', () => {
      const { result } = renderHook(() => useToggle('on', 'off'))
      
      // Toggle to alternate value
      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe('off')
      
      // Reset to default
      act(() => {
        result.current[2]()
      })
      expect(result.current[0]).toBe('on')
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

    it('should maintain stable function references with custom values', () => {
      const { result, rerender } = renderHook(() => useToggle('on', 'off'))
      const firstToggle = result.current[1]
      const firstReset = result.current[2]
      
      rerender()
      
      expect(result.current[1]).toBe(firstToggle)
      expect(result.current[2]).toBe(firstReset)
    })
  })

  describe('Error handling', () => {
    it('should throw error when non-boolean value is provided without alternate value', () => {
      // This should throw an error during hook execution
      expect(() => {
        renderHook(() => useToggle('test' as any))
      }).toThrow('useToggle requires two arguments for non-boolean values')
    })
  })
})