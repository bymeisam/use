import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

const mockLocalStorage = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  it('should return default value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    const [value] = result.current

    expect(value).toBe('default')
  })

  it('should return stored value when it exists', () => {
    mockLocalStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    const [value] = result.current

    expect(value).toBe('stored-value')
  })

  it('should update localStorage when value is set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'))
    expect(result.current[0]).toBe('new-value')
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(1))
  })

  it('should work with complex objects', () => {
    const complexObject = { name: 'John', age: 30, hobbies: ['reading', 'coding'] }
    const { result } = renderHook(() => useLocalStorage('user', complexObject))

    act(() => {
      result.current[1]({ ...complexObject, age: 31 })
    })

    expect(result.current[0]).toEqual({ ...complexObject, age: 31 })
  })

  it('should handle JSON parsing errors gracefully', () => {
    mockLocalStorage.setItem('test-key', 'invalid-json')
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    expect(result.current[0]).toBe('default')
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "test-key":',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })

  it('should handle localStorage setItem errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "test-key":',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })

  it('should sync across tabs when storage event is fired', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('updated-from-another-tab'),
        storageArea: localStorage,
      })
      window.dispatchEvent(storageEvent)
    })

    expect(result.current[0]).toBe('updated-from-another-tab')
  })

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    const initialValue = result.current[0]

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'different-key',
        newValue: JSON.stringify('should-be-ignored'),
        storageArea: localStorage,
      })
      window.dispatchEvent(storageEvent)
    })

    expect(result.current[0]).toBe(initialValue)
  })

  it('should maintain stable setter function reference', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('test-key', 'initial'))
    const firstSetter = result.current[1]

    rerender()
    const secondSetter = result.current[1]

    expect(firstSetter).toBe(secondSetter)
  })
})