# useLocalStorage

A React hook that provides persistent state management using the browser's localStorage, with automatic synchronization across browser tabs.

## Usage

```typescript
import { useLocalStorage } from '@bymeisam/use';

function App() {
  const [name, setName] = useLocalStorage('username', 'John Doe');
  const [settings, setSettings] = useLocalStorage('app-settings', {
    theme: 'light',
    notifications: true
  });

  return (
    <div>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      
      <button onClick={() => setSettings(prev => ({ 
        ...prev, 
        theme: prev.theme === 'light' ? 'dark' : 'light' 
      }))}>
        Toggle Theme
      </button>
      
      <p>Current theme: {settings.theme}</p>
    </div>
  );
}
```

## API

### Parameters

- `key: string` - The localStorage key to store the value under
- `defaultValue: T` - The default value to use (and save to localStorage) when no stored value exists

### Returns

Returns a tuple with:
- `value: T` - The current state value
- `setValue: (value: T | ((prevValue: T) => T)) => void` - Function to update the state and localStorage

## Features

- ✅ **Automatic persistence** - State is automatically saved to localStorage
- ✅ **Cross-tab synchronization** - Changes sync across browser tabs in real-time
- ✅ **Default value persistence** - Saves default values to localStorage when not present
- ✅ **Type-safe** - Full TypeScript support with generic typing
- ✅ **SSR-safe** - Works with server-side rendering (returns default value on server)
- ✅ **Error handling** - Gracefully handles localStorage errors and JSON parsing issues
- ✅ **Function updates** - Supports functional state updates like regular useState
- ✅ **Complex objects** - Automatically handles JSON serialization/deserialization

## Common Use Cases

- User preferences and settings
- Form data persistence
- Shopping cart contents
- UI state (sidebar open/closed, selected tabs)
- Theme preferences
- User authentication tokens (use with caution for security)

## Example Patterns

### User Preferences
```typescript
interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

function UserSettings() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'user-preferences', 
    {
      theme: 'light',
      language: 'en',
      notifications: true
    }
  );

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  return (
    <div className={`app ${preferences.theme}-theme`}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <select 
        value={preferences.language}
        onChange={(e) => setPreferences(prev => ({
          ...prev,
          language: e.target.value
        }))}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
}
```

### Shopping Cart
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function ShoppingCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('shopping-cart', []);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div>
      <h2>Cart ({cart.length} items)</h2>
      {cart.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price} x {item.quantity}
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

The hook automatically handles common localStorage errors:

- **Storage quota exceeded** - Logs warning, state updates but localStorage may not persist
- **JSON parsing errors** - Returns default value and logs warning
- **localStorage access denied** - Falls back to default value (useful for incognito mode)

## Cross-Tab Synchronization

When localStorage is updated in another tab, this hook automatically synchronizes the state:

```typescript
// Tab 1
const [count, setCount] = useLocalStorage('counter', 0);
setCount(5);

// Tab 2 - will automatically update to show 5
const [count] = useLocalStorage('counter', 0);
```

## SSR Compatibility

The hook safely handles server-side rendering by returning the default value when `window` is undefined, preventing hydration mismatches.