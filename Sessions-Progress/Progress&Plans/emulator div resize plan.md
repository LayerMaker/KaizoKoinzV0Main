# Emulator Div Resize Plan

## Current Issues
- The emulator display is not properly contained within the 800px width
- The emulator controls are positioned at the bottom of the browser window instead of relative to the emulator
- Fullscreen functionality is broken - the emulator doesn't expand properly
- Wallet connection requirement was accidentally bypassed

## Key Differences Between Current Implementation and Reference

### Reference Implementation (inspected-Div-HTML.md)
```html
<div class="box_gplay" style="max-width:800px;">
  <div class="game-content">
    <div style="height:100%;width:100%;">
      <div id="game" style="--ejs-primary-color: 26,175,255;" class="ejs_parent ejs_big_screen" tabindex="-1">
        <!-- EmulatorJS content -->
      </div>
    </div>
  </div>
</div>
```

### Our Current Implementation
```jsx
<div className="emulator-wrapper mx-auto" style={{ maxWidth: "800px", margin: "0 auto", position: "relative", overflow: "hidden" }}>
  <div 
    ref={emulatorRef} 
    id="emulator" 
    className="aspect-video bg-black rounded-md relative" 
    style={{...}}
  ></div>
</div>
```

## Implementation Plan

### Step 1: Simplify the Container Structure
- Modify the HTML structure to more closely match the reference implementation
- Use a simpler nesting pattern with fewer inline styles
- Keep the container width constraint at 800px

### Step 2: Fix EmulatorJS Configuration
- Update the EmulatorJS target element ID to match our structure
- Ensure all EmulatorJS configuration parameters are properly set
- Remove any unnecessary configuration parameters

### Step 3: Remove Complex JavaScript DOM Manipulation
- Remove the mutation observer code that tries to move elements
- Remove the resize observer code
- Remove the interval-based resizing code
- Let EmulatorJS position its elements naturally

### Step 4: Update CSS Approach
- Simplify the CSS in globals.css
- Focus on constraining the outermost container only
- Remove !important flags where possible
- Add specific styles for fullscreen mode that don't interfere with EmulatorJS

### Step 5: Restore Wallet Connection Requirement
- Remove the testing bypass that was added
- Ensure the wallet connection check works properly

## Detailed Implementation Instructions

1. **Update emulator-section.tsx**:
   - Simplify the container structure to match reference
   - Remove the complex JavaScript DOM manipulation
   - Fix the wallet connection requirement
   - Update the EmulatorJS configuration

2. **Update app/globals.css**:
   - Simplify the CSS rules for the emulator
   - Focus on constraining the outermost container
   - Add proper fullscreen mode handling

3. **Test the Implementation**:
   - Verify the emulator is properly contained at 800px width
   - Verify the controls are positioned relative to the emulator
   - Test fullscreen functionality
   - Verify wallet connection requirement works

## Code Changes

### emulator-section.tsx Changes:
1. Update the container structure:
```jsx
<div className="box_gplay" style={{ maxWidth: "800px" }}>
  <div className="game-content">
    <div style={{ height: "100%", width: "100%" }}>
      <div 
        ref={emulatorRef} 
        id="emulator" 
        className="ejs_parent" 
        tabIndex={-1}
      ></div>
    </div>
  </div>
</div>
```

2. Remove the complex JavaScript DOM manipulation:
   - Remove the `ensureEmulatorContainment` function
   - Remove the mutation observer and resize observer
   - Remove the interval-based resizing

3. Fix the wallet connection requirement:
```jsx
// Remove this line
const [bypassWalletForTesting] = useState(true)
// And use the direct wallet connection status
const isConnected = walletConnected
```

### app/globals.css Changes:
```css
/* Simplified EmulatorJS styling */
.box_gplay {
  max-width: 800px;
  margin: 0 auto;
}

.game-content {
  width: 100%;
}

/* Ensure proper aspect ratio is maintained */
.aspect-video {
  aspect-ratio: 16 / 9;
}

/* Fullscreen handling */
.ejs__fullscreen .box_gplay,
.ejs__fullscreen #emulator,
.fullscreen .box_gplay,
.fullscreen #emulator {
  max-width: none !important;
  width: 100% !important;
  height: 100% !important;
}
```

By following this plan, the emulator should be properly contained within the 800px width container, with controls positioned correctly relative to the emulator, and fullscreen functionality working as expected.
