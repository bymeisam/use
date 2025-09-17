# useFocus

A React hook for managing focus state and programmatically controlling focus on HTML elements.

## Features

- 🎯 **Programmatic Focus Control**: Focus and blur elements programmatically
- 📊 **Real-time Focus State**: Track whether an element is currently focused
- 🚀 **Auto Focus**: Optionally auto-focus elements when mounted
- 🎨 **Type Safe**: Full TypeScript support with generic element types
- 🧹 **Automatic Cleanup**: Event listeners are automatically cleaned up
- ⚡ **Performance Optimized**: Separate effects for event listeners and auto-focus

## Installation

```bash
npm install @bymeisam/use
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { useFocus } from '@bymeisam/use';

function MyComponent() {
  const { ref, focus, blur, isFocused } = useFocus<HTMLInputElement>();

  return (
    <div>
      <input ref={ref} placeholder="Click me or use buttons" />
      <button onClick={focus}>Focus Input</button>
      <button onClick={blur}>Blur Input</button>
      <p>Input is {isFocused ? 'focused' : 'not focused'}</p>
    </div>
  );
}
```

### Auto Focus

```tsx
import React from 'react';
import { useFocus } from '@bymeisam/use';

function AutoFocusInput() {
  const { ref, isFocused } = useFocus<HTMLInputElement>({
    autoFocus: true
  });

  return (
    <div>
      <input
        ref={ref}
        placeholder="This input will auto-focus when mounted"
      />
      <p>Status: {isFocused ? 'Focused' : 'Not focused'}</p>
    </div>
  );
}
```

### Different Element Types

```tsx
import React from 'react';
import { useFocus } from '@bymeisam/use';

function MultipleElements() {
  const inputFocus = useFocus<HTMLInputElement>();
  const buttonFocus = useFocus<HTMLButtonElement>();
  const divFocus = useFocus<HTMLDivElement>();

  return (
    <div>
      <input ref={inputFocus.ref} placeholder="Input" />
      <button ref={buttonFocus.ref}>Button</button>
      <div ref={divFocus.ref} tabIndex={0}>
        Focusable div
      </div>

      <div>
        <button onClick={inputFocus.focus}>Focus Input</button>
        <button onClick={buttonFocus.focus}>Focus Button</button>
        <button onClick={divFocus.focus}>Focus Div</button>
      </div>
    </div>
  );
}
```

## API Reference

### `useFocus<T>(options?)`

#### Parameters

- `options` (optional): Configuration object
  - `autoFocus`: `boolean` - Whether to automatically focus the element when mounted (default: `false`)

#### Returns

An object containing:

- `ref`: `RefObject<T | null>` - Ref to attach to the element you want to manage
- `focus`: `() => void` - Function to programmatically focus the element
- `blur`: `() => void` - Function to programmatically blur the element
- `isFocused`: `boolean` - Whether the element is currently focused

#### Types

```tsx
interface UseFocusOptions {
  autoFocus?: boolean;
}

interface UseFocusReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T | null>;
  focus: () => void;
  blur: () => void;
  isFocused: boolean;
}
```

## Examples

### Focus Management in Forms

```tsx
import React, { useState } from 'react';
import { useFocus } from '@bymeisam/use';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const usernameFocus = useFocus<HTMLInputElement>();
  const passwordFocus = useFocus<HTMLInputElement>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      usernameFocus.focus();
      return;
    }

    if (!password) {
      passwordFocus.focus();
      return;
    }

    // Submit form
    console.log('Submitting:', { username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          ref={usernameFocus.ref}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{
            outline: usernameFocus.isFocused ? '2px solid blue' : 'none'
          }}
        />
      </div>

      <div>
        <input
          ref={passwordFocus.ref}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            outline: passwordFocus.isFocused ? '2px solid blue' : 'none'
          }}
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

### Keyboard Navigation

```tsx
import React from 'react';
import { useFocus } from '@bymeisam/use';

function KeyboardNav() {
  const items = [
    useFocus<HTMLDivElement>(),
    useFocus<HTMLDivElement>(),
    useFocus<HTMLDivElement>(),
  ];

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && index < items.length - 1) {
      items[index + 1].focus();
    } else if (e.key === 'ArrowUp' && index > 0) {
      items[index - 1].focus();
    }
  };

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          ref={item.ref}
          tabIndex={0}
          onKeyDown={handleKeyDown(index)}
          style={{
            padding: '10px',
            border: '1px solid gray',
            margin: '5px',
            backgroundColor: item.isFocused ? 'lightblue' : 'white',
            outline: 'none'
          }}
        >
          Item {index + 1} {item.isFocused && '(focused)'}
        </div>
      ))}
    </div>
  );
}
```

## Notes

- The hook automatically sets up and cleans up focus/blur event listeners
- The `isFocused` state is updated in real-time when focus changes
- Works with any focusable HTML element (input, button, div with tabIndex, etc.)
- The `focus()` and `blur()` functions are safe to call even when the ref is null
- Event listeners and auto-focus logic are optimized in separate effects for better performance