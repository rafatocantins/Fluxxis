# Component Testing Guide

## 🎨 Interactive Demo

A live demo app is available to test all components interactively!

### Start the Demo

```bash
# Navigate to demo folder
cd demo

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**The demo will open at:** `http://localhost:5173`

### What You Can Test

1. **SmartCTA Components**
   - All three goal types (convert, inform, engage)
   - Behavior tracking (hover, dwell time)
   - Scroll-based floating
   - Emphasis adaptation

2. **Animated Button Variants**
   - ShimmerButton
   - RainbowButton
   - BlurFadeButton
   - PrimaryAnimatedButton
   - SecondaryAnimatedButton
   - AccentAnimatedButton

3. **Interactive Features**
   - Click tracking
   - Hover effects
   - Loading states
   - Disabled states
   - Size variants (sm, md, lg)

---

## 🧪 Alternative Testing Methods

### 1. Storybook (Recommended for Documentation)

```bash
npm run storybook
```

Opens at: `http://localhost:6006`

**Features:**
- Component documentation
- Props table
- Interactive controls
- Accessibility testing
- Responsive viewports

### 2. Test HTML Page

Create a simple HTML file to test components:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Component Test</title>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import { SmartCTA } from '@ia-design-system/react'
    
    ReactDOM.createRoot(document.getElementById('root')).render(
      <SmartCTA goal="convert" defaultCopy="Test Button" />
    )
  </script>
</body>
</html>
```

### 3. CodeSandbox / StackBlitz

1. Go to https://codesandbox.io
2. Create new React sandbox
3. Add dependency: `@ia-design-system/react`
4. Import and use components

---

## 📝 Testing Checklist

### Visual Testing
- [ ] Button renders correctly
- [ ] Animations work smoothly
- [ ] Hover effects activate
- [ ] Click feedback visible
- [ ] Loading state displays
- [ ] Disabled state clear

### Functional Testing
- [ ] onClick handler fires
- [ ] Goal prop affects styling
- [ ] Variant prop changes appearance
- [ ] Size prop adjusts dimensions
- [ ] Disabled prop prevents clicks

### Accessibility Testing
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus indicators visible
- [ ] Screen reader announces correctly
- [ ] Reduced motion respected

### Responsive Testing
- [ ] Mobile view (< 640px)
- [ ] Tablet view (640-1024px)
- [ ] Desktop view (> 1024px)
- [ ] Touch interactions work

---

## 🐛 Debugging Tips

### Check Console Logs
```javascript
// Add to your component
useEffect(() => {
  console.log('SmartCTA mounted', { goal, nodeId })
}, [])
```

### Inspect Node Registry
```javascript
// In browser console
import { nodeRegistry } from '@ia-design-system/react'
console.log(nodeRegistry.getAllNodes())
```

### Check Event Bus
```javascript
// In browser console
import { eventBus } from '@ia-design-system/react'
console.log(eventBus.getRecentEvents(10))
```

---

## 📸 Screenshot Testing

Capture screenshots of:
1. Default state
2. Hover state
3. Active/clicked state
4. Loading state
5. Disabled state
6. Each size variant
7. Each goal type

---

**Happy Testing!** 🚀
