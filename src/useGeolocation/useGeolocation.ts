import { useState, useEffect, useRef, useCallback } from "react";

// Define interfaces that match the native browser types
export interface GeolocationCoordinates {
  readonly accuracy: number;
  readonly altitude: number | null;
  readonly altitudeAccuracy: number | null;
  readonly heading: number | null;
  readonly latitude: number;
  readonly longitude: number;
  readonly speed: number | null;
}

export interface GeolocationPosition {
  readonly coords: GeolocationCoordinates;
  readonly timestamp: number;
}

export interface PositionOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
}

export interface GeolocationState {
  location: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
}

export interface UseGeolocationReturn extends GeolocationState {
  getCurrentPosition: () => void;
  startWatch: () => void;
  endWatch: () => void;
}

export function useGeolocation(
  options?: PositionOptions,
): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false,
  });
  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      location: position,
      error: null,
      loading: false,
    });
  }, []);

  const handleError = useCallback((err: string | { message: string }) => {
    setState((prev) => ({
      ...prev,
      error: typeof err === "string" ? err : err.message,
      loading: false,
    }));
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (typeof window === "undefined" || !window.navigator?.geolocation) {
      handleError("Geolocation is not supported");
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    window.navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options,
    );
  }, [handleSuccess, handleError, options]);

  const startWatch = useCallback(() => {
    if (typeof window === "undefined" || !window.navigator?.geolocation) {
      handleError("Geolocation is not supported");
      return;
    }

    // Clear existing watch if any
    if (watchIdRef.current !== null) {
      window.navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    watchIdRef.current = window.navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options,
    );
  }, [handleSuccess, handleError, options]);

  const endWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      window.navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      loading: false,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        window.navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...state,
    getCurrentPosition,
    startWatch,
    endWatch,
  };
}
