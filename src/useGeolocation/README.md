# useGeolocation

A React hook for accessing the browser's Geolocation API with support for both one-time position requests and continuous position watching.

## Features

- 🌍 **Location Access**: Get current position or watch position changes
- 📍 **Real-time Tracking**: Continuously monitor position changes
- 🛡️ **Error Handling**: Comprehensive error handling for various scenarios
- ⚡ **Loading States**: Built-in loading states for better UX
- 🎛️ **Configurable**: Support for all Geolocation API options
- 🧹 **Automatic Cleanup**: Properly cleans up watchers on unmount
- 🎨 **Type Safe**: Full TypeScript support with proper interfaces

## Installation

```bash
npm install @bymeisam/use
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { useGeolocation } from '@bymeisam/use';

function MyComponent() {
  const { location, error, loading, getCurrentPosition } = useGeolocation();

  const handleGetLocation = () => {
    getCurrentPosition();
  };

  if (loading) {
    return <div>Getting your location...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <button onClick={handleGetLocation}>Get My Location</button>

      {location && (
        <div>
          <h3>Your Location:</h3>
          <p>Latitude: {location.coords.latitude}</p>
          <p>Longitude: {location.coords.longitude}</p>
          <p>Accuracy: {location.coords.accuracy} meters</p>
          {location.coords.altitude && (
            <p>Altitude: {location.coords.altitude} meters</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### Position Watching

```tsx
import React, { useState } from 'react';
import { useGeolocation } from '@bymeisam/use';

function LocationTracker() {
  const [isWatching, setIsWatching] = useState(false);
  const { location, error, loading, startWatch, endWatch } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  });

  const toggleWatch = () => {
    if (isWatching) {
      endWatch();
      setIsWatching(false);
    } else {
      startWatch();
      setIsWatching(true);
    }
  };

  return (
    <div>
      <button onClick={toggleWatch}>
        {isWatching ? 'Stop Watching' : 'Start Watching'} Location
      </button>

      {loading && <div>📍 Getting location...</div>}
      {error && <div>❌ Error: {error}</div>}

      {location && (
        <div style={{
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>📍 Current Location</h3>
          <div><strong>Lat:</strong> {location.coords.latitude.toFixed(6)}</div>
          <div><strong>Lng:</strong> {location.coords.longitude.toFixed(6)}</div>
          <div><strong>Accuracy:</strong> ±{location.coords.accuracy.toFixed(0)}m</div>

          {location.coords.altitude && (
            <div><strong>Altitude:</strong> {location.coords.altitude.toFixed(0)}m</div>
          )}

          {location.coords.speed && (
            <div><strong>Speed:</strong> {location.coords.speed.toFixed(2)} m/s</div>
          )}

          {location.coords.heading && (
            <div><strong>Heading:</strong> {location.coords.heading.toFixed(0)}°</div>
          )}

          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Last updated: {new Date(location.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Map Integration

```tsx
import React, { useEffect, useState } from 'react';
import { useGeolocation } from '@bymeisam/use';

function MapView() {
  const [mapUrl, setMapUrl] = useState<string>('');
  const { location, error, loading, getCurrentPosition } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000
  });

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      // Generate map URL (example using OpenStreetMap)
      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
      setMapUrl(url);
    }
  }, [location]);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={getCurrentPosition}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Getting Location...' : 'Show My Location on Map'}
        </button>
      </div>

      {error && (
        <div style={{
          color: 'red',
          padding: '10px',
          backgroundColor: '#fee',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {location && mapUrl && (
        <div>
          <h3>📍 Your Location</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Coordinates:</strong> {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </div>
          <iframe
            src={mapUrl}
            width="100%"
            height="400"
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
            title="Your Location Map"
          />
        </div>
      )}
    </div>
  );
}
```

### Distance Tracking

```tsx
import React, { useState, useEffect } from 'react';
import { useGeolocation } from '@bymeisam/use';

function DistanceTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [startLocation, setStartLocation] = useState<GeolocationPosition | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [lastLocation, setLastLocation] = useState<GeolocationPosition | null>(null);

  const { location, error, startWatch, endWatch } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 1000
  });

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  useEffect(() => {
    if (location && isTracking) {
      if (!startLocation) {
        setStartLocation(location);
        setLastLocation(location);
      } else if (lastLocation) {
        const distance = calculateDistance(
          lastLocation.coords.latitude,
          lastLocation.coords.longitude,
          location.coords.latitude,
          location.coords.longitude
        );

        if (distance > 5) { // Only count movements > 5 meters
          setTotalDistance(prev => prev + distance);
          setLastLocation(location);
        }
      }
    }
  }, [location, isTracking, startLocation, lastLocation]);

  const handleToggleTracking = () => {
    if (isTracking) {
      endWatch();
      setIsTracking(false);
    } else {
      startWatch();
      setIsTracking(true);
      setStartLocation(null);
      setTotalDistance(0);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🏃‍♂️ Distance Tracker</h2>

      <button
        onClick={handleToggleTracking}
        style={{
          padding: '15px 25px',
          fontSize: '16px',
          backgroundColor: isTracking ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {isTracking ? '⏹️ Stop Tracking' : '▶️ Start Tracking'}
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {totalDistance.toFixed(0)}m
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Distance</div>
        </div>

        {location && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
              ±{location.coords.accuracy.toFixed(0)}m
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Accuracy</div>
          </div>
        )}

        {location && location.coords.speed && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffc107' }}>
              {(location.coords.speed * 3.6).toFixed(1)} km/h
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Speed</div>
          </div>
        )}
      </div>

      {location && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          <div><strong>Current Position:</strong></div>
          <div>Lat: {location.coords.latitude.toFixed(6)}</div>
          <div>Lng: {location.coords.longitude.toFixed(6)}</div>
          <div>Time: {new Date(location.timestamp).toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### `useGeolocation(options?)`

#### Parameters

- `options` (optional): Geolocation options object
  - `enableHighAccuracy`: `boolean` - Request high accuracy (default: `false`)
  - `timeout`: `number` - Maximum time to wait for position (ms, default: `Infinity`)
  - `maximumAge`: `number` - Maximum age of cached position (ms, default: `0`)

#### Returns

An object containing:

- `location`: `GeolocationPosition | null` - Current position data
- `error`: `string | null` - Error message if geolocation fails
- `loading`: `boolean` - Whether a geolocation request is in progress
- `getCurrentPosition`: `() => void` - Get current position once
- `startWatch`: `() => void` - Start watching position changes
- `endWatch`: `() => void` - Stop watching position changes

#### Types

```tsx
interface GeolocationCoordinates {
  readonly accuracy: number;
  readonly altitude: number | null;
  readonly altitudeAccuracy: number | null;
  readonly heading: number | null;
  readonly latitude: number;
  readonly longitude: number;
  readonly speed: number | null;
}

interface GeolocationPosition {
  readonly coords: GeolocationCoordinates;
  readonly timestamp: number;
}

interface PositionOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
}

interface GeolocationState {
  location: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  getCurrentPosition: () => void;
  startWatch: () => void;
  endWatch: () => void;
}
```

## Error Handling

The hook handles various error scenarios:

- **Permission Denied**: User denied geolocation access
- **Position Unavailable**: GPS/network unavailable
- **Timeout**: Request took too long
- **Not Supported**: Browser doesn't support geolocation

```tsx
import React from 'react';
import { useGeolocation } from '@bymeisam/use';

function GeolocationWithErrorHandling() {
  const { location, error, loading, getCurrentPosition } = useGeolocation({
    timeout: 10000,
    enableHighAccuracy: true
  });

  const getErrorMessage = (error: string) => {
    if (error.includes('denied')) {
      return '🚫 Please allow location access in your browser settings.';
    }
    if (error.includes('unavailable')) {
      return '📡 Location services are currently unavailable.';
    }
    if (error.includes('timeout')) {
      return '⏰ Location request timed out. Please try again.';
    }
    if (error.includes('not supported')) {
      return '❌ Your browser doesn\'t support geolocation.';
    }
    return `❌ ${error}`;
  };

  return (
    <div>
      <button onClick={getCurrentPosition} disabled={loading}>
        {loading ? 'Getting Location...' : 'Get My Location'}
      </button>

      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#fee',
          padding: '10px',
          borderRadius: '4px',
          margin: '10px 0'
        }}>
          {getErrorMessage(error)}
        </div>
      )}

      {location && (
        <div>
          <h3>✅ Location Found!</h3>
          <p>Latitude: {location.coords.latitude}</p>
          <p>Longitude: {location.coords.longitude}</p>
        </div>
      )}
    </div>
  );
}
```

## Notes

- Requires HTTPS in production (browser requirement)
- User must grant location permission
- High accuracy mode may drain battery faster
- Position watching continues until explicitly stopped or component unmounts
- Coordinates are in WGS84 format (decimal degrees)
- Accuracy is given in meters (lower is better)
- Speed is in meters per second (if available)
- Heading is in degrees (0-359, if available)