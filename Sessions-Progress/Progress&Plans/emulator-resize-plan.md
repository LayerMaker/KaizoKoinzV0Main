# EmulatorJS Resizing Implementation Plan

## Overview

This document outlines the plan for resizing the EmulatorJS component in our application to match the desired dimensions and layout. The goal is to create a more compact, centered emulator display that maintains proper aspect ratio while still allowing for fullscreen functionality.

## Background

Currently, the EmulatorJS component takes up too much screen space in its default state. We want to resize it to match the dimensions seen in the reference implementation (approximately 800px width), which provides a better balance between visibility and screen real estate.

## Reference Implementation

We have identified a similar implementation on another site that has the desired sizing characteristics. The HTML structure and styling from this reference site is available in the `inspected-(Div-HTML).md` file in the project root. This file contains the exact HTML structure, CSS styling, and EmulatorJS configuration that we'll use as a blueprint.

## Implementation Steps

### 1. Review Reference Implementation

First, carefully review the `inspected-(Div-HTML).md` file to understand:
- The container structure (nested divs with specific sizing)
- CSS styling applied to each container
- EmulatorJS configuration parameters

Key elements from the reference implementation:
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

And the EmulatorJS configuration:
```javascript
EJS_player = '#game';
EJS_pathtodata = "https://cloud.mariogames.be/data-core/";
EJS_gameUrl = 'https://classic.mariogames.be/snes/6976/kaizo-mario-world.zip';
EJS_core = 'snes';
```

### 2. Modify the emulator-section.tsx Component

Update the `emulator-section.tsx` file with the following changes:

1. **Add EmulatorJS Width Parameter**:
   - Set `window.EJS_width = 800` in the configuration to explicitly tell EmulatorJS what size to use
   - This directly controls the emulator's rendering size

2. **Create a Fixed-Width Container Structure**:
   - Add a wrapper div with `max-width: 800px` and `margin: 0 auto` to constrain and center the emulator
   - Ensure inner containers use appropriate width/height settings (100%)
   - Maintain the aspect ratio with the `aspect-video` class

3. **Update CSS in globals.css**:
   - Add specific CSS rules targeting EmulatorJS-generated elements
   - Use `!important` flags where necessary to override EmulatorJS default styling
   - Target canvas elements to ensure they respect container dimensions

### 3. Specific Code Changes

#### In emulator-section.tsx:

```tsx
// Add EJS_width parameter
window.EJS_width = 800
console.log("EJS_width set to:", window.EJS_width)

// Update the emulator container structure
<div className="mx-auto" style={{ maxWidth: "800px", width: "100%" }}>
  <div 
    ref={emulatorRef} 
    id="emulator" 
    className="aspect-video bg-black rounded-md mx-auto relative" 
    style={{ 
      width: "100%",
      height: "auto",
      boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)"
    }}
  ></div>
</div>
```

#### In globals.css:

```css
/* EmulatorJS styling */
#emulator canvas {
  max-width: 100% !important;
  height: auto !important;
}

.ejs__container {
  max-width: 800px !important;
  margin: 0 auto !important;
}

.ejs__core {
  max-width: 100% !important;
}
```

### 4. Testing and Verification

After implementing these changes:

1. Start the development server with `npm run dev`
2. Clear browser cache to ensure fresh loading of all assets
3. Verify the emulator displays at the correct size (approximately 800px width)
4. Test the fullscreen functionality to ensure it still works properly
5. Test on different screen sizes to ensure responsive behavior

## Why This Approach Works

This implementation combines multiple techniques to ensure the emulator size is properly constrained:

1. **Direct EmulatorJS Configuration**: Setting `EJS_width` directly tells the emulator what size to render at
2. **Container Constraints**: Using max-width on containers prevents overflow
3. **CSS Overrides**: Targeting EmulatorJS-generated elements ensures our styling takes precedence
4. **Aspect Ratio Preservation**: Using aspect-video class maintains the correct proportions

By implementing all these techniques together, we ensure the emulator will display at the desired size regardless of how EmulatorJS attempts to size itself.

## Expected Outcome

The emulator should display at approximately 800px width (or less on smaller screens), centered in the viewport, with the correct aspect ratio maintained. The fullscreen functionality will remain intact, allowing users to expand to their entire screen when desired.

This implementation provides a better balance between visibility and screen real estate, matching the reference implementation while maintaining all functionality.
