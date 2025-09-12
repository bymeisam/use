# @bymeisam/use

A collection of reusable React hooks for common functionality.

## Installation

```bash
npm install @bymeisam/use
```

## Hooks

### useToggle
A hook for toggling between boolean values or custom values with reset functionality.

**API:** `useToggle(defaultValue, alternateValue?) => [value, toggle, reset]`

**Boolean mode:**
```tsx
import { useToggle } from '@bymeisam/use';

const [isOn, toggle, reset] = useToggle(true);
// isOn: true, toggle to false, reset back to true

function App() {
  return (
    <div>
      <p>Status: {isOn ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**Custom values mode:**
```tsx
const [theme, toggleTheme, resetTheme] = useToggle('light', 'dark');
// theme: 'light', toggleTheme to 'dark', resetTheme back to 'light'

const [status, toggleStatus, resetStatus] = useToggle('active', 'inactive');
```

**Returns:**
- `value`: Current value (T)
- `toggle`: Function to toggle between values
- `reset`: Function to reset to default value

**Error handling:**
- Throws error if non-boolean value is provided without alternate value

### useGeolocation
A hook for accessing browser geolocation with proper error handling.

**API:** `useGeolocation(options?) => { position, error, loading, getCurrentPosition, startWatch, endWatch }`

```tsx
import { useGeolocation } from '@bymeisam/use';

const { position, error, loading, getCurrentPosition, startWatch, endWatch } = useGeolocation({
  enableHighAccuracy: true,
  timeout: 10000
});

// Get current position once
const handleGetLocation = () => {
  getCurrentPosition();
};

// Start continuous tracking
const handleStartTracking = () => {
  startWatch();
};

// Stop tracking
const handleStopTracking = () => {
  endWatch();
};
```

**Returns:**
- `position`: Current position object with coords and timestamp
- `error`: Error string if geolocation fails
- `loading`: Boolean indicating if request is in progress
- `getCurrentPosition`: Function to get position once
- `startWatch`: Function to start continuous position tracking
- `endWatch`: Function to stop position tracking

### useLocalStorage
A hook for managing localStorage state with React.

```tsx
import { useLocalStorage } from '@bymeisam/use';

const [value, setValue] = useLocalStorage('key', 'defaultValue');
```

## License

MIT