# useClickOutside

A React hook that detects clicks outside of a specified element and triggers a callback function.

## Features

- 🎯 **Click Outside Detection**: Automatically detects when clicks occur outside an element
- 🧹 **Automatic Cleanup**: Event listeners are automatically cleaned up on unmount
- 🎨 **Type Safe**: Full TypeScript support with generic element types
- ⚡ **Performance Optimized**: Uses efficient event delegation with mousedown events
- 🔄 **Callback Updates**: Properly handles callback function changes without re-adding listeners
- 🛡️ **Safe**: Handles null refs gracefully without errors

## Installation

```bash
npm install @bymeisam/use
```

## Usage

### Basic Usage

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
        <div ref={ref} style={{
          position: 'absolute',
          background: 'white',
          border: '1px solid gray',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p>Click outside to close</p>
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Modal Dialog

```tsx
import React, { useState } from 'react';
import { useClickOutside } from '@bymeisam/use';

function Modal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useClickOutside<HTMLDivElement>(() => {
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div
        ref={ref}
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Modal Title</h2>
        <p>Click outside this modal to close it.</p>
        <button onClick={() => setIsModalOpen(false)}>
          Close
        </button>
      </Modal>
    </div>
  );
}
```

### Tooltip

```tsx
import React, { useState, useRef } from 'react';
import { useClickOutside } from '@bymeisam/use';

function Tooltip({ children, content }: {
  children: React.ReactNode;
  content: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useClickOutside<HTMLDivElement>(() => {
    setIsVisible(false);
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={() => setIsVisible(!isVisible)}>
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'black',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            marginBottom: '5px',
            zIndex: 1000
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <Tooltip content="This is a tooltip that closes when you click outside">
        <button>Hover me</button>
      </Tooltip>
    </div>
  );
}
```

### Context Menu

```tsx
import React, { useState } from 'react';
import { useClickOutside } from '@bymeisam/use';

function ContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({ visible: false, x: 0, y: 0 });

  const ref = useClickOutside<HTMLDivElement>(() => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  });

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY
    });
  };

  const handleMenuClick = (action: string) => {
    console.log('Action:', action);
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  return (
    <div>
      <div
        onContextMenu={handleRightClick}
        style={{
          width: '300px',
          height: '200px',
          border: '1px solid gray',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        Right-click me for context menu
      </div>

      {contextMenu.visible && (
        <div
          ref={ref}
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'white',
            border: '1px solid gray',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <div
            onClick={() => handleMenuClick('copy')}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee'
            }}
          >
            Copy
          </div>
          <div
            onClick={() => handleMenuClick('paste')}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee'
            }}
          >
            Paste
          </div>
          <div
            onClick={() => handleMenuClick('delete')}
            style={{
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Delete
          </div>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### `useClickOutside<T>(callback)`

#### Parameters

- `callback`: `() => void` - Function called when a click outside the element is detected

#### Returns

- `RefObject<T | null>` - Ref to attach to the element you want to monitor

#### Types

```tsx
function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
): RefObject<T | null>
```

## Examples

### Multiple Elements

```tsx
import React, { useState } from 'react';
import { useClickOutside } from '@bymeisam/use';

function MultipleDropdowns() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const dropdown1Ref = useClickOutside<HTMLDivElement>(() => {
    if (openDropdown === 'dropdown1') setOpenDropdown(null);
  });

  const dropdown2Ref = useClickOutside<HTMLDivElement>(() => {
    if (openDropdown === 'dropdown2') setOpenDropdown(null);
  });

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <button onClick={() => setOpenDropdown('dropdown1')}>
          Dropdown 1
        </button>
        {openDropdown === 'dropdown1' && (
          <div ref={dropdown1Ref} style={{ /* dropdown styles */ }}>
            Dropdown 1 Content
          </div>
        )}
      </div>

      <div>
        <button onClick={() => setOpenDropdown('dropdown2')}>
          Dropdown 2
        </button>
        {openDropdown === 'dropdown2' && (
          <div ref={dropdown2Ref} style={{ /* dropdown styles */ }}>
            Dropdown 2 Content
          </div>
        )}
      </div>
    </div>
  );
}
```

### Conditional Callback

```tsx
import React, { useState } from 'react';
import { useClickOutside } from '@bymeisam/use';

function ConditionalClose() {
  const [isOpen, setIsOpen] = useState(false);
  const [preventClose, setPreventClose] = useState(false);

  const ref = useClickOutside<HTMLDivElement>(() => {
    if (!preventClose) {
      setIsOpen(false);
    }
  });

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Panel</button>

      {isOpen && (
        <div ref={ref} style={{ /* panel styles */ }}>
          <h3>Panel Content</h3>
          <label>
            <input
              type="checkbox"
              checked={preventClose}
              onChange={(e) => setPreventClose(e.target.checked)}
            />
            Prevent close on outside click
          </label>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
```

## Notes

- Uses `mousedown` events for better user experience (more responsive than `click`)
- Automatically handles callback changes without re-adding event listeners
- Safe to call with null refs - no errors will be thrown
- The ref can be attached to any HTML element
- Event listener is attached to `document` for efficient event delegation
- Properly cleans up event listeners when the component unmounts