import { renderHook, act } from '@testing-library/react'
import { useGeolocation } from './useGeolocation'

// Mock geolocation
const mockGetCurrentPosition = vi.fn()
const mockWatchPosition = vi.fn()
const mockClearWatch = vi.fn()

const mockGeolocation = {
  getCurrentPosition: mockGetCurrentPosition,
  watchPosition: mockWatchPosition,
  clearWatch: mockClearWatch,
}

// Set up the window mock
Object.defineProperty(window, 'navigator', {
  value: {
    geolocation: mockGeolocation,
  },
  writable: true,
  configurable: true,
})

const mockPosition = {
  coords: {
    latitude: 51.505,
    longitude: -0.09,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
}

const mockError = { message: 'User denied the request for Geolocation.' }

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window.navigator
    Object.defineProperty(window, 'navigator', {
      value: {
        geolocation: mockGeolocation,
      },
      writable: true,
      configurable: true,
    })
  })

  describe('Initial state', () => {
    it('should initialize with null position, no error, and not loading', () => {
      const { result } = renderHook(() => useGeolocation())
      
      expect(result.current.position).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it('should provide getCurrentPosition, startWatch, and endWatch methods', () => {
      const { result } = renderHook(() => useGeolocation())
      
      expect(typeof result.current.getCurrentPosition).toBe('function')
      expect(typeof result.current.startWatch).toBe('function')
      expect(typeof result.current.endWatch).toBe('function')
    })
  })

  describe('getCurrentPosition', () => {
    it('should set loading to true when getting position', async () => {
      const { result } = renderHook(() => useGeolocation())
      
      mockGetCurrentPosition.mockImplementation(() => {
        // Don't call success immediately to test loading state
      })
      
      act(() => {
        result.current.getCurrentPosition()
      })
      
      expect(result.current.loading).toBe(true)
    })

    it('should update position data on success', async () => {
      const { result } = renderHook(() => useGeolocation())
      
      mockGetCurrentPosition.mockImplementation((success) => {
        globalThis.setTimeout(() => success(mockPosition), 0)
      })
      
      act(() => {
        result.current.getCurrentPosition()
      })
      
      // Wait for the mock to execute
      await act(async () => {
        await new Promise(resolve => globalThis.setTimeout(resolve, 1))
      })
      
      expect(result.current.position).toEqual(mockPosition)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle geolocation errors', async () => {
      const { result } = renderHook(() => useGeolocation())
      
      mockGetCurrentPosition.mockImplementation((success, error) => {
        globalThis.setTimeout(() => error(mockError), 0)
      })
      
      act(() => {
        result.current.getCurrentPosition()
      })
      
      await act(async () => {
        await new Promise(resolve => globalThis.setTimeout(resolve, 1))
      })
      
      expect(result.current.error).toBe('User denied the request for Geolocation.')
      expect(result.current.loading).toBe(false)
    })

    it('should handle unsupported geolocation', async () => {
      // Mock unsupported geolocation
      Object.defineProperty(window, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      })
      
      const { result } = renderHook(() => useGeolocation())
      
      act(() => {
        result.current.getCurrentPosition()
      })
      
      expect(result.current.error).toBe('Geolocation is not supported')
    })

    it('should pass options to getCurrentPosition', () => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      }
      
      const { result } = renderHook(() => useGeolocation(options))
      
      act(() => {
        result.current.getCurrentPosition()
      })
      
      expect(mockGetCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        options
      )
    })
  })

  describe('startWatch', () => {
    it('should start watching position', () => {
      const watchId = 123
      mockWatchPosition.mockReturnValue(watchId)
      
      const { result } = renderHook(() => useGeolocation())
      
      act(() => {
        result.current.startWatch()
      })
      
      expect(mockWatchPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        undefined
      )
      expect(result.current.loading).toBe(true)
    })

    it('should clear existing watch before starting new one', () => {
      const watchId1 = 123
      const watchId2 = 456
      mockWatchPosition.mockReturnValueOnce(watchId1).mockReturnValueOnce(watchId2)
      
      const { result } = renderHook(() => useGeolocation())
      
      act(() => {
        result.current.startWatch()
      })
      
      act(() => {
        result.current.startWatch()
      })
      
      expect(mockClearWatch).toHaveBeenCalledWith(watchId1)
      expect(mockWatchPosition).toHaveBeenCalledTimes(2)
    })

    it('should handle watch position success', async () => {
      let successCallback: any
      mockWatchPosition.mockImplementation((success) => {
        successCallback = success
        return 123
      })
      
      const { result } = renderHook(() => useGeolocation())
      
      act(() => {
        result.current.startWatch()
      })
      
      // Manually trigger the success callback
      act(() => {
        if (successCallback) {
          successCallback(mockPosition)
        }
      })
      
      expect(result.current.position).toEqual(mockPosition)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should pass options to watchPosition', () => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      }
      
      const { result } = renderHook(() => useGeolocation(options))
      
      act(() => {
        result.current.startWatch()
      })
      
      expect(mockWatchPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        options
      )
    })
  })

  describe('endWatch', () => {
    it('should clear the watch and set loading to false', () => {
      const watchId = 123
      mockWatchPosition.mockReturnValue(watchId)
      
      const { result } = renderHook(() => useGeolocation())
      
      act(() => {
        result.current.startWatch()
      })
      
      act(() => {
        result.current.endWatch()
      })
      
      expect(mockClearWatch).toHaveBeenCalledWith(watchId)
      expect(result.current.loading).toBe(false)
    })

    it('should handle calling endWatch without active watch', () => {
      const { result } = renderHook(() => useGeolocation())
      
      act(() => {
        result.current.endWatch()
      })
      
      expect(mockClearWatch).not.toHaveBeenCalled()
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Cleanup', () => {
    it('should clear watch on unmount', () => {
      const watchId = 123
      mockWatchPosition.mockReturnValue(watchId)
      
      const { result, unmount } = renderHook(() => useGeolocation())
      
      act(() => {
        result.current.startWatch()
      })
      
      unmount()
      
      expect(mockClearWatch).toHaveBeenCalledWith(watchId)
    })
  })

  describe('Method stability', () => {
    it('should maintain stable function references', () => {
      const { result, rerender } = renderHook(() => useGeolocation())
      
      const firstGetCurrentPosition = result.current.getCurrentPosition
      const firstStartWatch = result.current.startWatch
      const firstEndWatch = result.current.endWatch
      
      rerender()
      
      expect(result.current.getCurrentPosition).toBe(firstGetCurrentPosition)
      expect(result.current.startWatch).toBe(firstStartWatch)
      expect(result.current.endWatch).toBe(firstEndWatch)
    })
  })
})