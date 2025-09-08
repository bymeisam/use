# useToggle

A flexible React hook for toggling between any two values. Supports boolean mode by default and custom value pairs for more advanced use cases.

## Usage

### Boolean Mode (Default)
```typescript
import { useToggle } from '@bymeisam/use';

function App() {
  const [isVisible, toggleVisible] = useToggle(); // false ↔ true
  const [isEnabled, toggleEnabled] = useToggle(true); // true ↔ false

  return (
    <div>
      <button onClick={toggleVisible}>
        {isVisible ? 'Hide' : 'Show'} Content
      </button>
      
      {isVisible && <p>This content is toggled</p>}
      
      <label>
        <input 
          type="checkbox" 
          checked={isEnabled} 
          onChange={toggleEnabled} 
        />
        Enable feature
      </label>
    </div>
  );
}
```

### Custom Values Mode
```typescript
function ThemeToggle() {
  const [theme, toggleTheme] = useToggle('light', 'dark');
  
  return (
    <div className={`app ${theme}-theme`}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <p>Current theme: {theme}</p>
    </div>
  );
}

function StatusToggle() {
  const [status, toggleStatus] = useToggle('active', 'inactive');
  const [visibility, toggleVisibility] = useToggle('', 'highlighted');
  
  return (
    <div className={visibility}>
      <span className={`status-${status}`}>Status: {status}</span>
      <button onClick={toggleStatus}>Toggle Status</button>
      <button onClick={toggleVisibility}>Toggle Highlight</button>
    </div>
  );
}
```

## API

### Boolean Mode
```typescript
useToggle(): [boolean, () => void]
useToggle(initialValue: boolean): [boolean, () => void]
```

**Parameters:**
- `initialValue?: boolean` - The initial boolean value (defaults to `false`)

**Returns:**
- `[value, toggle]` where `value` is the current boolean state and `toggle` switches between true/false

### Custom Values Mode
```typescript
useToggle<T>(defaultValue: T, alternateValue: T): [T, () => void]
```

**Parameters:**
- `defaultValue: T` - The initial value and default state
- `alternateValue: T` - The value to toggle to

**Returns:**
- `[value, toggle]` where `value` is the current state and `toggle` switches between the two values

## Features

- ✅ **Dual mode support** - Boolean mode for simple true/false, custom values mode for any two values
- ✅ **Type-safe** - Full TypeScript support with proper generic typing
- ✅ **Stable function reference** - Won't cause unnecessary re-renders
- ✅ **Flexible values** - Toggle between strings, numbers, objects, or any type
- ✅ **Backward compatible** - Existing boolean usage unchanged
- ✅ **Lightweight and performant**

## Common Use Cases

### Boolean Mode
- Toggle visibility of components
- Manage checkbox states  
- Control modal/dialog open/close states
- Feature flags and toggles

### Custom Values Mode
- Theme switching (`'light' ↔ 'dark'`)
- Status management (`'loading' ↔ 'idle'`)
- CSS class toggling (`'' ↔ 'active'`)
- UI state switching (`'collapsed' ↔ 'expanded'`)
- Language toggling (`'en' ↔ 'es'`)

## Example Patterns

### Modal Control
```typescript
function ModalExample() {
  const [isOpen, toggleModal] = useToggle(false);
  
  return (
    <>
      <button onClick={toggleModal}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={toggleModal}>
        Modal content
      </Modal>
    </>
  );
}
```

### Advanced Custom Values Examples
```typescript
// CSS class toggling
function HighlightBox() {
  const [highlight, toggleHighlight] = useToggle('', 'highlighted');
  
  return (
    <div className={`box ${highlight}`}>
      <button onClick={toggleHighlight}>Toggle Highlight</button>
    </div>
  );
}

// Status management  
function LoadingButton() {
  const [state, toggleState] = useToggle('idle', 'loading');
  
  const handleClick = () => {
    toggleState();
    // Simulate async operation
    setTimeout(toggleState, 2000);
  };
  
  return (
    <button onClick={handleClick} disabled={state === 'loading'}>
      {state === 'loading' ? 'Loading...' : 'Click Me'}
    </button>
  );
}

// Mode switching
function CounterMode() {
  const [mode, toggleMode] = useToggle('1x', '10x');
  
  return (
    <div>
      <p>Current mode: {mode}</p>
      <button onClick={toggleMode}>Toggle Mode</button>
    </div>
  );
}
```