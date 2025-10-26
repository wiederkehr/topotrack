# Export Functionality Specification

## Overview

TopoTrack's export system allows users to download their activity visualizations as PNG images (static templates) or MP4 videos (animated templates). The system handles static template exports via DOM-to-image conversion and animated template exports via frame-by-frame video recording with animation control.

**Status**: This spec defines the target implementation. The current implementation supports additional formats (SVG, WebM) that will be deprecated in favor of a simpler, more reliable two-format system.

## Use Cases

### Primary Use Case

A user selects a Strava activity, customizes the visualization with a template and presets, then exports the result to share on social media or save for personal records.

### User Journey

1. User selects activity and template in Composer
2. User selects output dimensions (Square, Portrait, Landscape, Story)
3. User selects asset type (PNG or MP4)
   - PNG: Static image, works with all templates
   - MP4: Animated video, best with animated templates
4. User clicks "Download" button
5. System generates file and triggers browser download
6. User shares exported file on social media

## Target Implementation

### Architecture

#### Core Components

**Unified Export API** ([exportNode.ts](../src/functions/export/exportNode.ts))

- Single entry point for all export operations
- Simplified to support two formats: PNG and MP4
- Progress tracking via `onProgress` callback
- Comprehensive error handling and user feedback

**Static Image Export (PNG Only)**

- Uses `html-to-image` library for DOM-to-image conversion
- `htmlToPng()` with configurable pixel ratio (default 2x for quality)
- Fast, near-instantaneous operation
- Suitable for static templates only

**Video Export (MP4 Only)**

- Uses `html2canvas-pro` for frame capture
- Native `MediaRecorder` API with MP4 codec
- Template-driven duration (derived from animation timing)
- Configurable FPS (default 30fps)
- Requires Chrome 126+ (June 2024), Safari 14.1+, or equivalent
- Triggers animation replay via Zustand store
- Frame-by-frame capture with progress tracking
- Graceful degradation with browser support detection

#### State Management

**Export Store** ([useExportStore.ts](../src/stores/useExportStore.ts))

- Format selection (Square, Portrait, Landscape, Story)
- Asset type selection (PNG, MP4) - kept for future extensibility
- Export progress tracking (0-100%)
- Export state management (isExporting flag)
- Reference to figure DOM node for export
- Browser compatibility status

**Template Store** ([useTemplateStore.ts](../src/stores/useTemplateStore.ts))

- Animation replay trigger (`replayTrigger` counter)
- Animation pause state (`isAnimationPaused`)
- Template and preset selection
- Variable overrides

#### UI Components

**Export Component** ([export.tsx](../src/features/composer/input/export/export.tsx))

- Format dimension selector (Square, Portrait, Landscape, Story)
- Asset type selector (PNG, MP4) - kept for future extensibility
- Download button with loading state
- Progress bar during export
- Disabled state during export operation
- Browser compatibility warning (if MP4 unsupported)

### Export Flow

#### Static Export (PNG)

```
User selects PNG asset type
User clicks Download
  � useExportStore.handleExport()
  � Get selected asset type � "png"
  � exportNode() with type "png"
  � htmlToPng() with configured pixel ratio
  � downloadjs triggers browser download
  � Success feedback to user
```

#### Animated Export (MP4)

```
User selects MP4 asset type
User clicks Download
  � useExportStore.handleExport()
  � Get selected asset type � "mp4"
  � Check browser MP4 support
  � setAnimationPaused(true) to freeze current state
  � exportNode() with type "mp4"
  � recordNodeAsMp4()
    � Calculate animation duration from activity and animation parameters
    � triggerReplay() to reset animation
    � Wait for animation initialization
    � Start MediaRecorder with MP4 codec
    � Capture frame with html2canvas
    � Draw to recording canvas
    � Update progress callback
    � Schedule next frame (1000/fps ms)
    � Repeat for totalFrames (duration * fps)
    � Stop recorder
    � Return Blob
  � downloadjs triggers download
  � setAnimationPaused(false) to resume
  � Success feedback to user
```

### Animation Controls

The export system integrates with template animations through standardized controls:

- **`replayTrigger`**: Incremented to restart animation from beginning
- **`isAnimationPaused`**: Prevents animation start during export preparation
- **Frame Capture**: Mapbox GL requires `preserveDrawingBuffer: true` to enable frame capture

**Duration Calculation**:

- Animation duration is calculated dynamically based on:
  - Selected activity (route length, complexity)
  - Animation parameters (speed multiplier, phase durations)
  - Template-specific animation logic
- Examples:
  - Short 5km route: 8 second animation
  - Long 50km route: 15 second animation
  - With 2x speed: durations halved
  - With 0.5x speed: durations doubled

**Note**: Different templates and activities will have different animation durations. The export system must be flexible enough to handle variable animation lengths without hard-coding template or activity-specific timing.

### Output Formats

#### Dimensions

```typescript
formats: [
  { name: "Square", width: 1080, height: 1080 }, // Instagram post
  { name: "Portrait", width: 1080, height: 1350 }, // Instagram portrait
  { name: "Landscape", width: 1920, height: 1080 }, // YouTube/Twitter
  { name: "Story", width: 1080, height: 1920 }, // Instagram story
];
```

#### Export Types

Export type is automatically determined based on template:

```typescript
// Static templates → PNG export
// Animated templates → MP4 export

// No user selection needed - format is implicit based on template type
```

### File Naming

**Pattern**: `YYYY-MM-DD_Activity-Name_Format.ext`

**Examples**:

- `2024-03-15_Morning-Run_Square.png` (static template)
- `2024-03-15_Morning-Run_Square.mp4` (animated template)

Note: File extension automatically reflects template type

Implemented in [formatFilename.ts](../src/functions/format/formatFilename.ts)

## Design Decisions

### Why PNG Only for Static Templates?

**Decision**: Remove SVG export support

**Rationale**:

- PNG provides excellent quality with 2x pixel ratio
- SVG export has inconsistent rendering of complex CSS and effects
- Social media platforms prefer raster formats (PNG/JPG)
- Simplifies codebase and reduces maintenance burden
- Users rarely requested SVG format

### Why MP4 Only for Animated Templates?

**Decision**: Remove WebM export support

**Rationale**:

- WebM has known parsing/rendering issues (see FIXME in code)
- MP4 is universally supported across social media platforms
- Modern browsers (Chrome 126+, Safari 14.1+) support MP4 MediaRecorder
- Single video format simplifies implementation and testing
- Better codec options (H.264) for quality and compatibility

**Browser Support Strategy**:

- Detect MP4 MediaRecorder support on load
- Show clear warning if browser doesn't support MP4
- Provide browser upgrade guidance
- No fallback format (encourages modern browser usage)

### User-Selected Asset Type

**Decision**: Keep asset type selector for user choice

**Rationale**:

- Provides flexibility for users to choose output format
- PNG works for both static and animated templates (single frame)
- MP4 captures full animation for animated templates
- Architecture supports adding new formats in the future (e.g., GIF, higher quality MP4)
- Users may want static PNG from animated template (poster frame)
- Clear labeling helps users understand format differences

## Known Limitations

### Current Implementation Issues (To Be Addressed)

1. **Animation Synchronization** (Addressed in Phase 3)

   - Current: Export captures frames at fixed intervals (1000/fps ms)
   - Current: Animation timing not controlled by export system
   - Current: Potential for drift between animation and capture
   - Solution: Frame-by-frame controlled rendering with `renderAtTime()` API
   - Solution: Off-screen canvas for isolated export rendering
   - Result: Zero drift, perfect frame sync

2. **Video Quality Constraints**

   - html2canvas-pro may not perfectly render all CSS features
   - MediaRecorder quality depends on browser implementation
   - Limited control over video bitrate (browser-dependent)
   - Mapbox GL rendering may have minor artifacts

3. **Hard-Coded Duration** (To Be Fixed)

   - MP4 export currently hardcoded to 10 seconds
   - Should derive duration from template's animation timing
   - Different templates may need different durations

4. **Browser Compatibility**

   - MP4 export requires modern browser (Chrome 126+, Safari 14.1+)
   - Firefox does not support MP4 MediaRecorder (not planned)
   - Users with older browsers must upgrade
   - No degraded experience or fallback

5. **Progress Tracking**

   - PNG exports complete instantly (no progress needed)
   - MP4 exports show frame capture progress only
   - Encoding time not reflected in progress bar

### Technical Constraints

1. **Frame Capture Performance**

   - html2canvas takes ~30-100ms per frame
   - Cannot capture in real-time
   - Must use setTimeout-based frame scheduling
   - Total export time: ~10-30 seconds for 10-second video

2. **Memory Usage**

   - Full-resolution canvas frames in memory
   - MediaRecorder buffers chunks
   - 300 frames × 1080×1080 = significant memory
   - Risk of issues on low-memory mobile devices

3. **No Export Validation** (Future Enhancement)

   - No verification of Blob creation success
   - No playback testing
   - No file size warnings

## Dependencies

### Required Libraries

**html-to-image** (v1.11.11)

- Purpose: PNG export for static templates
- Function: `htmlToPng()` for DOM-to-image conversion
- Pros: Fast, simple API, excellent quality with pixel ratio control
- License: MIT
- Status: Keep (required for PNG export)

**html2canvas-pro** (v1.5.12)

- Purpose: Frame capture for MP4 video export
- Pros: Modern CSS support (CSS colors), actively maintained
- Cons: May have minor rendering artifacts
- License: MIT
- Note: Replaced `html2canvas` for better CSS color support (commit ea4c675)
- Status: Keep (required for MP4 export)

**downloadjs** (v1.4.7)

- Purpose: Trigger browser downloads
- Pros: Simple API, small bundle size
- License: MIT
- Status: Keep (required for file downloads)

**Native APIs**

- `MediaRecorder`: MP4 video encoding
- `HTMLCanvasElement.captureStream()`: Canvas streaming for video
- Browser Blob API: File creation

### Libraries to Remove

**html-to-image** - `htmlToSvg()` function

- Currently used for SVG export
- Can remove SVG export code path
- Keep library for PNG export only

### Previously Removed

**canvas-record**

- Removed due to bundle bloat
- See commits: 49a1e87 (dynamic import), bcc4baf (full removal)
- Native MediaRecorder now provides MP4 support

## Technical Constraints

### Browser Requirements

**For PNG Export (Static Templates)**

- Modern browser with ES2020 support
- Canvas API support
- Blob and download API support
- **Supported**: All modern browsers (Chrome, Firefox, Safari, Edge)

**For MP4 Export (Animated Templates)**

- MediaRecorder API with MP4 codec support
- **Minimum versions**:
  - Chrome 126+ (June 2024)
  - Safari 14.1+ (April 2021)
  - Edge 126+ (June 2024)
- **Not supported**: Firefox (no MP4 MediaRecorder support)
- **Browser detection**: App detects support and shows warnings

### Performance Constraints

**Frame Capture Time**

- html2canvas takes ~30-100ms per frame
- At 30fps, ideal interval is 33ms
- Cannot capture in real-time
- Must use setTimeout-based frame scheduling

**Memory Usage**

- Full-resolution canvas for each frame
- MediaRecorder buffers chunks in memory
- 300 frames � 1080�1080 = significant memory
- Risk of out-of-memory on mobile devices

**Animation Synchronization**

- Mapbox GL animations use RAF (requestAnimationFrame)
- Export uses setTimeout-based intervals
- Different timing mechanisms � potential drift
- No frame-perfect synchronization guarantee

## Data Flow

### Export Data Pipeline

```
Activity Data (Strava API)
  �
Template Component (React)
  �
Rendered DOM (figureRef)
  �
html2canvas / html-to-image
  �
Canvas / Data URL
  �
MediaRecorder (video) or Direct Download (image)
  �
Blob
  �
downloadjs
  �
Browser Download
```

### State Dependencies

```
useActivityStore
  � selected activity
useTemplateStore
  � template, preset, variables
Composer Output Component
  � figureRef
useExportStore
  � format, asset type
exportNode()
```

## Success Criteria

### Functional Requirements

 **Currently Met**

- Export static templates as PNG
- Export static templates as SVG
- Export animated templates as MP4 video
- Show progress during export
- Generate descriptive filenames
- Support multiple output dimensions
- Pause animations during export

� **Partially Met**

- Export animated templates as WebM (has issues)
- Synchronize animation with video export (drift possible)

L **Not Met**

- Reliable WebM export
- Perfect frame synchronization
- Browser compatibility detection
- Quality settings control
- Export validation

### Quality Requirements

**Performance**

- Export completes in reasonable time (<30s for MP4)
- UI remains responsive during export
- Progress indicator updates smoothly

**Reliability**

- Export succeeds 95%+ of the time
- Exported files play correctly
- Animation timing is accurate within 100ms

**Usability**

- User understands export progress
- User can cancel export (not implemented)
- User gets feedback on errors (limited)

## Implementation Plan

### Phase 1: Core Refactoring

1. **Simplify Export API**

   - Remove SVG export code path from `exportNode.ts`
   - Remove WebM export code path
   - Delete `recordNodeAsBlob.ts` (WebM-specific)
   - Keep only PNG and MP4 export logic

2. **Update Asset Type Selection**

   - Keep asset type selector in UI for future extensibility
   - Update available assets to PNG and MP4 only
   - Remove "Animated WebM" from assets list in `composer.settings.ts`
   - Keep the asset selection architecture for potential future formats

3. **Activity and Animation-Driven Duration**

   - Duration should be calculated based on selected activity AND animation parameters
   - Consider animation speed settings (e.g., faster/slower playback)
   - Duration may vary per activity based on route length, complexity, etc.
   - Remove hard-coded duration values (6000ms, 10000ms)
   - Add animation speed/duration calculation logic
   - Calculate total frames as `duration * fps / 1000`
   - Examples:
     - Short route: 8 second animation
     - Long route: 15 second animation
     - Speed multiplier: 0.5x = double duration, 2x = half duration

4. **Update File Naming**
   - Remove type parameter from filename generation
   - Derive extension from asset type (png or mp4)
   - Update `formatFilename` function

### Phase 2: Browser Compatibility

1. **MP4 Support Detection**

   - Check `MediaRecorder.isTypeSupported('video/mp4')`
   - Store support status in export store
   - Show warning banner for unsupported browsers

2. **User Feedback**
   - Clear error messages for unsupported browsers
   - Link to browser requirements documentation
   - Disable export button with explanation if unsupported

### Phase 3: Animation Synchronization

**Goal**: Eliminate timing drift and ensure frame-perfect animation capture

1. **Approach Assessment**

   **Option A: Two-Stage Conversion (WebM → MP4)**

   - Generate video in most efficient format first (WebM)
   - Convert to MP4 using server-side or client-side transcoding
   - **Feasibility**: ⚠️ Medium complexity
     - Requires transcoding library (e.g., FFmpeg.wasm for client-side)
     - Adds ~20MB to bundle size for FFmpeg.wasm
     - Slower total export time (capture + transcode)
     - Server-side requires backend infrastructure
   - **Impact**: ❌ Low - Adds complexity without solving sync issues
   - **Recommendation**: Skip - WebM has known issues, doesn't improve sync

   **Option B: Off-Screen Canvas Rendering**

   - Render full-size canvas off-screen (not visible to user)
   - Dedicated canvas for export prevents UI interference
   - **Feasibility**: ✅ High - Well-supported browser feature
     - Use OffscreenCanvas API or hidden canvas element
     - Clone DOM structure or render directly to off-screen canvas
     - Isolate export rendering from user-visible viewport
   - **Impact**: ✅ High - Eliminates visual glitches and UI conflicts
   - **Recommendation**: Implement - Solves multiple issues cleanly

   **Option C: Frame-by-Frame Controlled Rendering**

   - Control animation timing explicitly during export
   - Render each frame synchronously at precise timestamps
   - Slow down or pause animation between captures
   - **Feasibility**: ✅ High - Full control over animation
     - Export system drives animation state (not RAF timing)
     - Template exposes frame-by-frame render method
     - Use `setAnimationProgress(timestamp)` instead of `triggerReplay()`
   - **Impact**: 🚀 Very High - Perfect frame sync, no drift
   - **Recommendation**: Implement - Best solution for sync

2. **Implementation Plan: Frame-by-Frame Export**

   a. **Template Animation API Changes**

   - Add `renderAtTime(timestamp: number)` method to animated templates
   - Template renders exact animation state at given timestamp
   - Replaces real-time animation during export
   - Example: `map.renderAtTime(2500)` → shows animation at 2.5 seconds

   b. **Export Flow Modifications**

   ```
   For each frame (0 to totalFrames):
     → Calculate timestamp: (frame / fps) * 1000
     → Call template.renderAtTime(timestamp)
     → Wait for render complete (Promise-based)
     → Capture frame with html2canvas
     → Draw to recording canvas
     → Continue to next frame
   Result: Perfect 1:1 mapping of animation time to video frames
   ```

   c. **Render Synchronization**

   - Use `requestAnimationFrame()` for smooth rendering
   - Use `Promise` to wait for Mapbox GL render completion
   - Check `map.isMoving()` to ensure camera settled
   - Configurable render delay (default: 50ms) for complex scenes

   d. **Benefits**

   - Zero timing drift (deterministic rendering)
   - Consistent frame capture (not dependent on browser speed)
   - Preview matches export exactly
   - Works regardless of animation complexity
   - Can export at any FPS (15, 30, 60) reliably

3. **Off-Screen Canvas Integration**

   - Create hidden div for export rendering
   - Clone figure content to off-screen element
   - Initialize separate Mapbox GL instance for export
   - Render to off-screen canvas, capture frames
   - Dispose after export completes
   - **Benefit**: User can continue working during export

4. **Progress Tracking Improvements**
   - Show "Preparing export..." during setup
   - Update progress during frame capture (per frame)
   - Show "Finalizing video..." during encoding
   - Estimated time remaining based on frames captured

### Phase 4: Quality Improvements

1. **Export Validation**

   - Verify Blob is not null after generation
   - Check Blob size is reasonable
   - Show error message if validation fails

2. **Error Handling**
   - Catch and handle export errors gracefully
   - Show user-friendly error messages
   - Log technical details to console

### Phase 5: Code Cleanup

1. **Remove Dead Code**

   - Remove unused WebM/SVG related code
   - Keep asset type selection components (UI dropdown remains)
   - Clean up imports

2. **Update Tests**

   - Test PNG export
   - Test MP4 export with frame-by-frame rendering
   - Test off-screen canvas rendering
   - Test browser detection
   - Test error handling
   - Test animation synchronization accuracy

3. **Update Documentation**
   - Update README with new export behavior
   - Document browser requirements
   - Document frame-by-frame rendering approach
   - Add troubleshooting guide

## Future Enhancements

### Potential Features (Not in Current Scope)

1. **Quality Settings**

   - User-configurable FPS (15, 30, 60)
   - PNG pixel ratio setting (1x, 2x, 3x)
   - Video quality presets

2. **Export Presets**

   - "Quick" (lower quality, faster)
   - "Standard" (current default)
   - "High Quality" (higher resolution)

3. **Batch Export**

   - Export multiple activities at once
   - Export all dimensions simultaneously
   - Bulk download as ZIP

4. **Advanced Features**

   - Export with audio/soundtrack
   - Custom video duration controls
   - GIF export option for animations
   - Export specific animation phases (e.g., just the follow-path phase)

## References

### Related Code Files

**Core Export System:**

- [src/functions/export/exportNode.ts](../src/functions/export/exportNode.ts) - Unified export API
- [src/functions/export/recordNodeAsMp4.ts](../src/functions/export/recordNodeAsMp4.ts) - MP4 export (keep)
- [src/functions/export/recordNodeAsBlob.ts](../src/functions/export/recordNodeAsBlob.ts) - WebM export (remove)
- [src/functions/format/formatFilename.ts](../src/functions/format/formatFilename.ts) - File naming

**State Management:**

- [src/stores/useExportStore.ts](../src/stores/useExportStore.ts) - Export state management
- [src/stores/useTemplateStore.ts](../src/stores/useTemplateStore.ts) - Template/animation state

**UI Components:**

- [src/features/composer/input/export/export.tsx](../src/features/composer/input/export/export.tsx) - Export UI
- [src/features/composer/composer.settings.ts](../src/features/composer/composer.settings.ts) - Format/asset config

**Templates:**

- [src/features/templates/](../src/features/templates/) - Template definitions with duration config

### Related Issues

- #37 - [Refactoring]: Consolidate Export Functions (CLOSED)
- #50 - [Enhancement]: Move Format Settings from Design to Export tab (CLOSED)
- #62 - [Feature]: Add Replay Button for Animations (CLOSED)
- #63 - [Enhancement]: Refine Final State of FlyTo Animation (CLOSED)

### Related Commits

- `ea4c675` - fix: replace html2canvas with html2canvas-pro for modern CSS color support
- `bcc4baf` - refactor: use native MediaRecorder for MP4 export instead of canvas-record
- `49a1e87` - fix: use dynamic import for canvas-record to prevent bundle bloat
- `56709ce` - feat: add MP4 video export for animated templates

### External Documentation

- [MediaRecorder API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [html2canvas documentation](https://html2canvas.hertzen.com/)
- [html-to-image repository](https://github.com/bubkoo/html-to-image)
- [Mapbox GL JS preserveDrawingBuffer](https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters)

## Critical Review: Current Implementation (2025-10-21)

### Executive Summary

The current animation and export implementation demonstrates **excellent architectural design** with strong separation of concerns and a unified approach to animation control. The system successfully implements frame-by-frame export synchronization using pure phase calculators and store-based coordination.

However, **critical production issues** exist that must be addressed:

1. Race condition in export initialization (HIGH)
2. Missing error boundaries and cleanup logic (HIGH)
3. Hard-coded duration estimates vs. actual values (MEDIUM)
4. Potential memory leaks on export failure (MEDIUM)

### Implementation Review

#### Architectural Strengths

**1. Unified Animation Controller** ([AnimationController.tsx](../src/features/visuals/animation/AnimationController.tsx))

The single-component approach elegantly handles both preview and export modes:

```typescript
// Preview mode: RAF-based real-time playback
useEffect(() => {
  const animate = (currentTime: number) => {
    const state = calculateStateAtTimestamp(elapsed);
    applyCameraState(state);
    requestAnimationFrame(animate);
  };
}, [replayTrigger]);

// Export mode: Frame-by-frame rendering at precise timestamps
useEffect(() => {
  const unsubscribe = useExportStore.subscribe((state, prevState) => {
    if (
      state.exportMode &&
      state.exportTimestamp !== prevState.exportTimestamp
    ) {
      const frameState = calculateStateAtTimestamp(state.exportTimestamp);
      applyCameraState(frameState);
      // Wait for render, then notify export system
    }
  });
}, [map]);
```

**Benefits:**

- No code duplication between preview and export
- Single source of truth for animation logic
- Easy to test and maintain

**2. Pure Phase Calculators** ([phaseCalculators.ts](../src/features/visuals/animation/phaseCalculators.ts))

Stateless functions calculate camera state at any timestamp:

```typescript
export function calculateFlyToState(
  timestamp: number,
  duration: number,
  params: FlyToParams,
): CameraState {
  const progress = Math.min(timestamp / duration, 1);
  const easedProgress = easeCubicOut(progress);

  return {
    altitude: lerp(params.startAltitude, params.stopAltitude, easedProgress),
    bearing: lerpAngle(params.startBearing, params.stopBearing, easedProgress),
    pitch: lerp(params.startPitch, params.stopPitch, easedProgress),
    lng: params.targetLng,
    lat: params.targetLat,
  };
}
```

**Benefits:**

- Deterministic rendering (same timestamp = same state)
- Testable without DOM or Mapbox dependencies
- Enables perfect frame-by-frame export
- No drift between preview and export

**3. Dynamic Duration Calculation** ([durationCalculators.ts](../src/features/visuals/animation/durationCalculators.ts))

Intelligent duration based on route characteristics:

```typescript
export function calculateFollowPathDuration(
  routeData: [number, number][],
): number {
  const routeLength = length(lineString(routeData)); // kilometers
  const complexity = calculateRouteComplexity(routeData); // 0-1 score

  const baseDuration = routeLength * 1000; // 1 second per km
  const complexityMultiplier = 1 + complexity * 0.3; // +20-50% for complex routes

  return Math.min(Math.max(baseDuration * complexityMultiplier, 4000), 15000);
}
```

**Benefits:**

- No hard-coded animation durations
- Adapts to route length and complexity
- Consistent pacing across different activities

**4. Store-Based Coordination** ([useExportStore.ts](../src/stores/useExportStore.ts))

Clean separation of concerns via Zustand:

```typescript
interface ExportState {
  // Export control
  exportMode: boolean; // Preview vs. export mode
  exportTimestamp: number; // Current frame timestamp
  exportProgress: number; // Progress percentage
  isExporting: boolean; // UI state

  // Export coordination
  frameReadyCallback: (() => void) | null; // Called when frame rendered
  animationDuration: number | null; // Total animation duration

  // Export configuration
  format: FormatType;
  asset: AssetType;
  figureRef: RefObject<HTMLDivElement> | null;
}
```

**Benefits:**

- Reactive updates across components
- No prop drilling
- Clear state ownership

#### Critical Issues

**Issue #1: Race Condition in Export Initialization (HIGH PRIORITY)**

**Location:** [recordNodeAsMp4.ts:174-178](../src/functions/export/recordNodeAsMp4.ts#L174-L178)

**Problem:**

```typescript
// Enable export mode in store
useExportStore.getState().setExportMode(true);
useExportStore.getState().setExportTimestamp(0);
void renderFrameControlled();
```

The export system immediately sets `exportTimestamp` to 0 after enabling export mode. However, the `AnimationController`'s subscription to the export store (line 164) may not be active yet, especially if:

- Component just mounted
- React is batching updates
- Subscription callback hasn't fired

**Impact:**

- First frame (timestamp 0) may be skipped
- Export starts from frame 1 instead of frame 0
- Video missing initial state

**Reproduction:**

1. Navigate to composer page
2. Load animated template
3. Immediately click "Download" before animation plays
4. First frame may be wrong or skipped

**Fix:**
Add initialization delay to ensure subscription is ready:

```typescript
if (useFrameByFrame) {
  useExportStore.getState().setExportMode(true);

  // Wait for next tick to ensure AnimationController subscription is active
  await new Promise((resolve) => setTimeout(resolve, 0));

  useExportStore.getState().setExportTimestamp(0);
  void renderFrameControlled();
}
```

**Issue #2: Missing Error Boundaries and Cleanup (HIGH PRIORITY)**

**Location:** [recordNodeAsMp4.ts:49-183](../src/functions/export/recordNodeAsMp4.ts#L49-L183), [exportNode.ts:61-87](../src/functions/export/exportNode.ts#L61-L87)

**Problem:**
No try-catch blocks in critical export paths. If any error occurs:

- `html2canvas` fails to capture frame
- MediaRecorder encoding fails
- Out of memory
- Mapbox GL rendering error

The export store is left in a dirty state:

```typescript
// Store state after failed export:
{
  exportMode: true,        // Still in export mode!
  isExporting: true,       // UI shows "Exporting..."
  exportTimestamp: 1234,   // Stuck at failed frame
  frameReadyCallback: fn   // Callback never cleared
}
```

**Impact:**

- User sees "Exporting..." spinner forever
- Cannot retry export (already "exporting")
- Preview animation broken (stuck in export mode)
- Memory leak from uncleaned callbacks

**Fix:**
Wrap export logic in comprehensive error handling:

```typescript
export async function recordNodeAsMp4({
  node,
  format,
  fps = 30,
  useFrameByFrame = false,
  onProgress,
}: RecordNodeAsMp4Props): Promise<Blob | null> {
  try {
    // ... existing setup code ...

    return new Promise<Blob | null>((resolve, reject) => {
      recorder.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: "video/mp4" });
          resolve(blob);
        } catch (error) {
          reject(error);
        } finally {
          // Always cleanup export state
          if (useFrameByFrame) {
            cleanupExportState();
          }
        }
      };

      recorder.onerror = (event) => {
        cleanupExportState();
        reject(new Error(`MediaRecorder error: ${event.error?.message}`));
      };

      // ... rendering code ...
    });
  } catch (error) {
    cleanupExportState();
    throw error;
  }
}

function cleanupExportState() {
  const store = useExportStore.getState();
  store.setExportMode(false);
  store.setExportTimestamp(-1);
  store.setFrameReadyCallback(null);
  store.setExportProgress(0);
}
```

In `exportNode.ts`:

```typescript
export async function exportNode({
  node,
  name,
  format,
  type,
}: ExportOptions): Promise<void> {
  const config = exportConfigs[type];
  if (!config) {
    console.error(`Unsupported export type: ${type}`);
    return;
  }

  try {
    const canvasWidth = format?.width ?? node.offsetWidth;
    const canvasHeight = format?.height ?? node.offsetHeight;

    const data = await config.generate(node, { canvasWidth, canvasHeight });

    if (data) {
      download(data, name, config.mimeType);
    } else {
      throw new Error(`Failed to generate ${type.toUpperCase()} data.`);
    }
  } catch (error) {
    // Log error with context
    console.error(`Error exporting ${type.toUpperCase()}:`, {
      error,
      format,
      type,
      nodeSize: { width: node.offsetWidth, height: node.offsetHeight },
    });

    // Show user-friendly error message (could use toast notification)
    alert(
      `Export failed: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
    );

    throw error; // Re-throw for caller to handle
  }
}
```

**Issue #3: Stale Duration Estimate (MEDIUM PRIORITY)**

**Location:** [export.tsx:35-38](../src/features/composer/input/export/export.tsx#L35-L38)

**Problem:**

```typescript
const estimatedTimeRemaining =
  showProgress && exportProgress < 100
    ? Math.ceil(((100 - exportProgress) / 100) * 10) // Hard-coded 10s!
    : 0;
```

The actual animation duration is available in the export store (`animationDuration`) but is not used. This causes:

- Inaccurate time estimates for user
- Shows "~5s remaining" when export actually finishes in 2s
- Shows "~2s remaining" when export takes 8s more

**Impact:**

- Poor user experience (confusing progress indicator)
- Undermines trust in the application

**Fix:**
Use actual animation duration from store:

```typescript
const animationDuration = useExportStore((state) => state.animationDuration);

const estimatedTimeRemaining =
  showProgress && exportProgress < 100 && animationDuration
    ? Math.ceil(((100 - exportProgress) / 100) * (animationDuration / 1000))
    : 0;
```

**Issue #4: Incomplete Cleanup on Export Completion (MEDIUM PRIORITY)**

**Location:** [recordNodeAsMp4.ts:124-130](../src/functions/export/recordNodeAsMp4.ts#L124-L130)

**Problem:**
Cleanup only happens in success path of frame-by-frame rendering:

```typescript
if (frame >= totalFrames) {
  // Animation complete - cleanup and stop recording
  useExportStore.getState().setExportMode(false);
  useExportStore.getState().setExportTimestamp(-1);
  useExportStore.getState().setFrameReadyCallback(null);
  recorder.stop();
}
```

If export fails mid-frame (e.g., html2canvas throws error), cleanup never runs. State remains dirty.

**Fix:**
Use finally blocks and centralized cleanup:

```typescript
function renderFrameControlled() {
  try {
    const timestamp = (frame / fps) * 1000;
    const progress = Math.round((frame / totalFrames) * 100);

    if (onProgress) onProgress(progress);
    useExportStore.getState().setExportProgress(progress);

    if (frame < totalFrames) {
      useExportStore.getState().setFrameReadyCallback(() => {
        void captureNodeToCanvas()
          .then(() => {
            frame++;
            void renderFrameControlled();
          })
          .catch((error) => {
            console.error("Frame capture failed:", error);
            cleanupExportState();
            recorder.stop();
          });
      });

      useExportStore.getState().setExportTimestamp(timestamp);
    } else {
      cleanupExportState();
      recorder.stop();
    }
  } catch (error) {
    console.error("Export rendering error:", error);
    cleanupExportState();
    recorder.stop();
  }
}
```

**Issue #5: No Export Cancellation (LOW PRIORITY)**

**Problem:**
Once export starts, user cannot cancel. Long exports (15+ seconds) lock the UI with no escape.

**Impact:**

- Poor UX for accidental exports
- User must wait or reload page
- Wastes computational resources

**Fix:**
Add cancellation support:

```typescript
interface ExportState {
  // ... existing fields ...
  cancelExport: () => void;
}

// In recordNodeAsMp4.ts:
let isCancelled = false;

const cancel = () => {
  isCancelled = true;
  recorder.stop();
  cleanupExportState();
};

useExportStore.getState().setCancelExport(cancel);

function renderFrameControlled() {
  if (isCancelled) return;
  // ... rest of rendering logic ...
}
```

UI component:

```tsx
{
  showProgress && (
    <>
      <Progress value={exportProgress} size="1" />
      <Button
        onClick={() => useExportStore.getState().cancelExport()}
        variant="soft"
      >
        Cancel
      </Button>
    </>
  );
}
```

#### Architecture Recommendations

**Recommendation #1: Extract Export Orchestration Service**

Currently, export logic is split across:

- `exportNode.ts` - Entry point
- `recordNodeAsMp4.ts` - MP4 recording
- `useExportStore.ts` - State management
- `AnimationController.tsx` - Frame rendering

**Proposal:** Create dedicated export service:

```typescript
// src/services/ExportService.ts
export class ExportService {
  private recorder: MediaRecorder | null = null;
  private isCancelled = false;

  async exportAsMp4(options: ExportMp4Options): Promise<Blob | null> {
    try {
      this.prepare();
      const blob = await this.record(options);
      this.validate(blob);
      return blob;
    } catch (error) {
      this.handleError(error);
      throw error;
    } finally {
      this.cleanup();
    }
  }

  private prepare() {
    // Initialize export state
    // Setup event listeners
    // Validate prerequisites
  }

  private async record(options: ExportMp4Options): Promise<Blob> {
    // Frame-by-frame recording logic
    // Progress tracking
    // Cancellation checks
  }

  private validate(blob: Blob | null) {
    // Check blob size
    // Verify codec
    // Test playback
  }

  private handleError(error: unknown) {
    // Log with context
    // User notification
    // Telemetry
  }

  private cleanup() {
    // Reset store state
    // Clear callbacks
    // Free resources
  }

  cancel() {
    this.isCancelled = true;
    this.recorder?.stop();
    this.cleanup();
  }
}
```

**Benefits:**

- Single responsibility for export operations
- Easier to test (mock service)
- Clear lifecycle management
- Better error handling

**Recommendation #2: Implement Export State Machine**

Current boolean flags (`isExporting`, `exportMode`) don't capture full export lifecycle.

**Proposal:** Use explicit state machine:

```typescript
type ExportState =
  | { status: "idle" }
  | { status: "initializing" }
  | { status: "recording"; progress: number; estimatedTimeRemaining: number }
  | { status: "finalizing" }
  | { status: "completed"; blob: Blob }
  | { status: "failed"; error: Error }
  | { status: "cancelled" };

interface ExportStore {
  state: ExportState;

  startExport: () => void;
  recordFrame: (progress: number) => void;
  completeExport: (blob: Blob) => void;
  failExport: (error: Error) => void;
  cancelExport: () => void;
  resetExport: () => void;
}
```

**Benefits:**

- Impossible to have inconsistent state (e.g., `isExporting=true` but `exportMode=false`)
- Clear transitions between states
- Easier to debug (log state changes)
- Type-safe state handling

**Recommendation #3: Add Export Validation and Retry**

Currently, no validation of generated MP4 files.

**Proposal:** Add validation step:

```typescript
async function validateExportedMp4(blob: Blob): Promise<boolean> {
  // Check blob size (not 0, not suspiciously small)
  if (blob.size < 10000) {
    // Less than 10KB is suspicious
    console.error("Export validation failed: blob too small", blob.size);
    return false;
  }

  // Check MIME type
  if (!blob.type.includes("video")) {
    console.error("Export validation failed: invalid MIME type", blob.type);
    return false;
  }

  // Test playback (create video element, load blob, check if playable)
  try {
    const video = document.createElement("video");
    const url = URL.createObjectURL(blob);

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(video.duration > 0);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      video.src = url;
    });
  } catch (error) {
    console.error("Export validation failed:", error);
    return false;
  }
}
```

Add retry logic:

```typescript
async function exportWithRetry(
  options: ExportOptions,
  maxRetries = 2,
): Promise<Blob | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const blob = await recordNodeAsMp4(options);

      if (blob && (await validateExportedMp4(blob))) {
        return blob;
      }

      console.warn(`Export validation failed on attempt ${attempt + 1}`);

      if (attempt < maxRetries) {
        // Wait before retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt)),
        );
      }
    } catch (error) {
      console.error(`Export attempt ${attempt + 1} failed:`, error);

      if (attempt === maxRetries) {
        throw error;
      }
    }
  }

  return null;
}
```

**Recommendation #4: Add Telemetry and Monitoring**

Track export success/failure rates to identify issues in production.

**Proposal:** Add export telemetry:

```typescript
interface ExportTelemetry {
  exportId: string;
  templateName: string;
  format: string;
  assetType: string;
  animationDuration: number;
  startTime: number;
  endTime?: number;
  status: "success" | "failed" | "cancelled";
  error?: string;
  framesRendered?: number;
  totalFrames?: number;
  blobSize?: number;
}

function trackExport(telemetry: ExportTelemetry) {
  // Log to console in development
  console.log("[Export Telemetry]", telemetry);

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // analytics.track('export_completed', telemetry);
  }

  // Could also store in IndexedDB for debugging
  // await db.exportLogs.add(telemetry);
}
```

Usage:

```typescript
const exportId = crypto.randomUUID();
const startTime = Date.now();

try {
  const blob = await recordNodeAsMp4(options);

  trackExport({
    exportId,
    templateName: template.name,
    format: format.name,
    assetType: "mp4",
    animationDuration: duration,
    startTime,
    endTime: Date.now(),
    status: "success",
    framesRendered: totalFrames,
    totalFrames,
    blobSize: blob?.size,
  });
} catch (error) {
  trackExport({
    exportId,
    templateName: template.name,
    format: format.name,
    assetType: "mp4",
    animationDuration: duration,
    startTime,
    endTime: Date.now(),
    status: "failed",
    error: error instanceof Error ? error.message : "Unknown error",
  });
}
```

### Testing Strategy

**Current State:**

- ✅ Unit tests exist for phase calculators ([durationCalculators.test.ts](../src/features/visuals/animation/durationCalculators.test.ts))
- ❌ No integration tests for export flow
- ❌ No E2E tests for animation export

**Recommended Test Coverage:**

**1. Unit Tests** (Existing ✅)

```typescript
// Test phase calculators
describe("calculateFlyToState", () => {
  it("returns start state at timestamp 0", () => {
    const state = calculateFlyToState(0, 2000, params);
    expect(state.altitude).toBe(params.startAltitude);
  });

  it("returns end state at duration", () => {
    const state = calculateFlyToState(2000, 2000, params);
    expect(state.altitude).toBe(params.stopAltitude);
  });

  it("interpolates state at midpoint", () => {
    const state = calculateFlyToState(1000, 2000, params);
    expect(state.altitude).toBeCloseTo(
      (params.startAltitude + params.stopAltitude) / 2,
      1,
    );
  });
});
```

**2. Integration Tests** (Need to Add ❌)

```typescript
// Test export flow coordination
describe('MP4 Export', () => {
  it('completes export successfully', async () => {
    const mockNode = createMockNode();
    const format = { name: 'Square', width: 1080, height: 1080 };

    const blob = await recordNodeAsMp4({
      node: mockNode,
      format,
      fps: 30,
      useFrameByFrame: true,
    });

    expect(blob).toBeTruthy();
    expect(blob?.type).toBe('video/mp4');
    expect(blob?.size).toBeGreaterThan(0);
  });

  it('cleans up state on export failure', async () => {
    const mockNode = createMockNodeThatFails();

    await expect(recordNodeAsMp4({ node: mockNode })).rejects.toThrow();

    // Verify cleanup
    const state = useExportStore.getState();
    expect(state.exportMode).toBe(false);
    expect(state.frameReadyCallback).toBe(null);
    expect(state.isExporting).toBe(false);
  });

  it('handles cancellation correctly', async () => {
    const exportPromise = recordNodeAsMp4({ ... });

    // Cancel mid-export
    setTimeout(() => {
      useExportStore.getState().cancelExport();
    }, 500);

    const result = await exportPromise;
    expect(result).toBe(null);

    // Verify cleanup
    const state = useExportStore.getState();
    expect(state.exportMode).toBe(false);
  });
});
```

**3. E2E Tests** (Need to Add ❌)

```typescript
// Test full animation export flow
describe("Animation Export E2E", () => {
  it("exports animated template as MP4", async () => {
    await page.goto("/composer");

    // Select animated template
    await page.click('[data-testid="template-select"]');
    await page.click('[data-testid="template-animation"]');

    // Wait for animation to load
    await page.waitForSelector('[data-testid="map-loaded"]');

    // Start export
    const downloadPromise = page.waitForEvent("download");
    await page.click('[data-testid="export-download"]');

    // Verify progress shown
    await expect(page.locator('[data-testid="export-progress"]')).toBeVisible();

    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.mp4$/);

    // Verify file
    const path = await download.path();
    const stats = fs.statSync(path);
    expect(stats.size).toBeGreaterThan(10000); // At least 10KB
  });

  it("shows error message on export failure", async () => {
    // Mock MediaRecorder to fail
    await page.addInitScript(() => {
      window.MediaRecorder = class {
        start() {
          throw new Error("MediaRecorder failed");
        }
      };
    });

    await page.goto("/composer");
    await page.click('[data-testid="export-download"]');

    // Verify error shown
    await expect(page.locator('[role="alert"]')).toContainText("Export failed");
  });
});
```

### Implementation Priority

**Phase 1: Critical Bugs (Week 1)**

1. ✅ Fix race condition with initialization delay
2. ✅ Add comprehensive error handling and cleanup
3. ✅ Use actual duration for progress estimates

**Phase 2: Robustness (Week 2)** 4. ✅ Implement export validation 5. ✅ Add retry logic 6. ✅ Implement cancellation

**Phase 3: Architecture (Week 3)** 7. Extract ExportService 8. Implement state machine 9. Add telemetry

**Phase 4: Testing (Week 4)** 10. Write integration tests 11. Write E2E tests 12. Add visual regression tests for exports

### Success Metrics

**Reliability:**

- Export success rate > 95%
- Zero dirty state after failed exports
- Zero race conditions in initialization

**Performance:**

- Export time < 3x animation duration
- Progress indicator accuracy ±5%
- No memory leaks during export

**User Experience:**

- Clear error messages for all failure modes
- Accurate time remaining estimates
- Ability to cancel long-running exports

---

**Document Version**: 2.1 (Current Implementation Review)
**Last Updated**: 2025-10-21
**Author**: System Documentation
**Status**: Production review with critical findings and recommendations
