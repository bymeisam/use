# useDebounce

A React hook that debounces a value, delaying updates until after a specified delay period. Perfect for search inputs, API calls, and performance optimization.

## Usage

### Basic Search Input
```typescript
import { useDebounce } from '@bymeisam/use';

function SearchInput() {
  const [debouncedSearch, setSearch, currentSearch] = useDebounce('', 300);

  // Make API call when debounced value changes
  useEffect(() => {
    if (debouncedSearch) {
      searchAPI(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div>
      <input
        type="text"
        value={currentSearch}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <p>Searching for: {debouncedSearch}</p>
      <p>You typed: {currentSearch}</p>
    </div>
  );
}
```

### Form Validation
```typescript
function FormField() {
  const [debouncedEmail, setEmail, currentEmail] = useDebounce('', 500);
  const [isValid, setIsValid] = useState(true);

  // Validate email after user stops typing
  useEffect(() => {
    if (debouncedEmail) {
      setIsValid(validateEmail(debouncedEmail));
    }
  }, [debouncedEmail]);

  return (
    <div>
      <input
        type="email"
        value={currentEmail}
        onChange={(e) => setEmail(e.target.value)}
        className={!isValid ? 'error' : ''}
      />
      {!isValid && <span>Please enter a valid email</span>}
    </div>
  );
}
```

### Auto-save Feature
```typescript
function AutoSaveEditor() {
  const [debouncedContent, setContent, currentContent] = useDebounce('', 2000);

  // Auto-save when user stops typing
  useEffect(() => {
    if (debouncedContent && debouncedContent !== '') {
      saveToServer(debouncedContent);
    }
  }, [debouncedContent]);

  return (
    <div>
      <textarea
        value={currentContent}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing... (auto-saves after 2s)"
      />
      <p>Last saved: {debouncedContent ? 'Content saved!' : 'Not saved yet'}</p>
    </div>
  );
}
```

## API

```typescript
useDebounce<T>(initialValue: T, delay: number): [T, (value: T) => void, T]
```

**Parameters:**
- `initialValue: T` - The initial value for both current and debounced state
- `delay: number` - The delay in milliseconds before updating the debounced value

**Returns:**
- `[debouncedValue, setValue, currentValue]` - A tuple containing:
  - `debouncedValue: T` - The debounced value that updates after the delay
  - `setValue: (value: T) => void` - Function to update the current value
  - `currentValue: T` - The immediate current value (updates instantly)

## Features

- ✅ **Dual value access** - Get both immediate and debounced values
- ✅ **Generic typing** - Works with any data type (strings, objects, arrays, etc.)
- ✅ **Stable function reference** - setValue function doesn't change between renders
- ✅ **Timer management** - Automatically cleans up timers on unmount
- ✅ **Reset on rapid changes** - Each new value resets the delay timer
- ✅ **Performance optimized** - Prevents excessive API calls and computations

## Common Use Cases

### Performance Optimization
- **Search inputs** - Delay API calls until user stops typing
- **Form validation** - Validate fields after user finishes input
- **Auto-save** - Save content periodically without overwhelming the server
- **Resize/scroll handlers** - Debounce expensive calculations

### User Experience
- **Live search** - Show immediate feedback while debouncing API calls
- **Input feedback** - Display immediate changes while delaying validation
- **Progress indication** - Show what user typed vs what's being processed

## Advanced Examples

### API Search with Loading States
```typescript
function SmartSearch() {
  const [debouncedQuery, setQuery, currentQuery] = useDebounce('', 400);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      searchAPI(debouncedQuery)
        .then(setResults)
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={currentQuery}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />

      {currentQuery !== debouncedQuery && (
        <p>Searching for "{currentQuery}"...</p>
      )}

      {isLoading && <p>Loading...</p>}

      <ul>
        {results.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Complex Object Debouncing
```typescript
interface Filters {
  category: string;
  price: { min: number; max: number };
  tags: string[];
}

function FilteredProductList() {
  const [debouncedFilters, setFilters, currentFilters] = useDebounce<Filters>({
    category: '',
    price: { min: 0, max: 1000 },
    tags: []
  }, 600);

  const updateCategory = (category: string) => {
    setFilters({ ...currentFilters, category });
  };

  const updatePriceRange = (min: number, max: number) => {
    setFilters({
      ...currentFilters,
      price: { min, max }
    });
  };

  useEffect(() => {
    // Apply filters after user stops adjusting them
    applyFilters(debouncedFilters);
  }, [debouncedFilters]);

  return (
    <div>
      <select
        value={currentFilters.category}
        onChange={(e) => updateCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <input
        type="range"
        min="0"
        max="1000"
        value={currentFilters.price.min}
        onChange={(e) => updatePriceRange(+e.target.value, currentFilters.price.max)}
      />

      {JSON.stringify(currentFilters) !== JSON.stringify(debouncedFilters) && (
        <p>Updating filters...</p>
      )}
    </div>
  );
}
```

## Performance Tips

1. **Choose appropriate delays:**
   - Search inputs: 300-500ms
   - Form validation: 500-800ms
   - Auto-save: 1000-3000ms
   - Resize/scroll: 100-250ms

2. **Avoid creating new objects:**
   ```typescript
   // ❌ Bad - creates new object every render
   const [value, setValue] = useDebounce({ count: 0 }, 300);

   // ✅ Good - stable initial value
   const initialState = { count: 0 };
   const [value, setValue] = useDebounce(initialState, 300);
   ```

3. **Cleanup on unmount:**
   The hook automatically cleans up timers, but make sure to handle component unmounting in your effects:
   ```typescript
   useEffect(() => {
     let cancelled = false;

     if (debouncedValue) {
       apiCall(debouncedValue).then(result => {
         if (!cancelled) setResult(result);
       });
     }

     return () => { cancelled = true; };
   }, [debouncedValue]);
   ```