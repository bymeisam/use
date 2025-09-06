# @bymeisam/use

A simple React hooks library.

## Installation

```bash
npm install @bymeisam/use
```

## Usage

```jsx
import { useToggle } from '@bymeisam/use';

function App() {
  const [isVisible, toggle] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <p>Content is visible!</p>}
    </div>
  );
}
```

## API

### useToggle(initialValue?)

Returns a boolean state and a toggle function.

- `initialValue` (boolean, optional): Initial state value. Default: `false`
- Returns: `[value, toggle]` tuple

## License

MIT