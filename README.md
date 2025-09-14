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

### useFocus
A hook for managing focus state and programmatically controlling focus on HTML elements.

**API:** `useFocus<T>(options?) => { ref, focus, blur, isFocused }`

```tsx
import { useFocus } from '@bymeisam/use';

// Basic usage
const { ref, focus, blur, isFocused } = useFocus<HTMLInputElement>();

// With auto focus
const { ref, focus, blur, isFocused } = useFocus<HTMLInputElement>({
  autoFocus: true
});

function App() {
  return (
    <div>
      <input ref={ref} placeholder="Focus me" />
      <button onClick={focus}>Focus Input</button>
      <button onClick={blur}>Blur Input</button>
      <p>Input is {isFocused ? 'focused' : 'not focused'}</p>
    </div>
  );
}
```

**Returns:**
- `ref`: Ref to attach to the element you want to manage
- `focus`: Function to programmatically focus the element
- `blur`: Function to programmatically blur the element
- `isFocused`: Boolean indicating if the element is currently focused

### useClickOutside
A hook that detects clicks outside of a specified element and triggers a callback.

**API:** `useClickOutside<T>(callback) => RefObject<T | null>`

```tsx
import React, { useState } from 'react';
import { useClickOutside } from '@bymeisam/use';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div ref={ref}>
          <p>Click outside to close</p>
        </div>
      )}
    </div>
  );
}
```

**Returns:**
- `RefObject<T | null>`: Ref to attach to the element you want to monitor

### useGeolocation
A hook for accessing browser geolocation with proper error handling.

**API:** `useGeolocation(options?) => { location, error, loading, getCurrentPosition, startWatch, endWatch }`

```tsx
import { useGeolocation } from '@bymeisam/use';

const { location, error, loading, getCurrentPosition, startWatch, endWatch } = useGeolocation({
  enableHighAccuracy: true,
  timeout: 10000
});

// Get current location once
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
- `location`: Current location object with coords and timestamp
- `error`: Error string if geolocation fails
- `loading`: Boolean indicating if request is in progress
- `getCurrentPosition`: Function to get location once
- `startWatch`: Function to start continuous location tracking
- `endWatch`: Function to stop location tracking

### useLocalStorage
A hook for managing localStorage state with React.

```tsx
import { useLocalStorage } from '@bymeisam/use';

const [value, setValue] = useLocalStorage('key', 'defaultValue');
```

### useClickOutside
A hook that detects clicks outside of an element, useful for closing modals and dropdowns.

**API:** `useClickOutside(callback) => RefObject`

```tsx
import { useClickOutside } from '@bymeisam/use';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <p>Dropdown content</p>
        </div>
      )}
    </div>
  );
}
```

**Parameters:**
- `callback`: Function called when click occurs outside the element

**Returns:**
- `RefObject`: Ref to attach to the element you want to detect outside clicks for

### useDebounce
A hook that debounces value changes, perfect for search inputs and performance optimization.

**API:** `useDebounce(initialValue, delay) => [debouncedValue, setValue, currentValue]`

```tsx
import { useDebounce } from '@bymeisam/use';

function SearchInput() {
  const [debouncedSearch, setSearch, currentSearch] = useDebounce('', 300);

  // API call only happens after user stops typing for 300ms
  useEffect(() => {
    if (debouncedSearch) {
      searchAPI(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={currentSearch}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

**Returns:**
- `debouncedValue`: Value updated after delay period
- `setValue`: Function to update the current value immediately
- `currentValue`: Current value (updates immediately)

**Use cases:**
- Search inputs with API calls
- Form validation after user stops typing
- Auto-save functionality
- Performance optimization for expensive operations

## License

MIT