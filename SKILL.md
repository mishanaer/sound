---
name: sound
description: Add the bundled procedural UI sounds to browser interfaces. Use when asked to add, place, wire, or review UI sound effects, audio feedback, clicks, taps, hovers, selections, toggles, or ticks on an existing website or web app.
---

# sound

Copy `assets/ui-sounds.js` into the target app and connect its existing presets to meaningful user interactions. Preserve the module unchanged: it intentionally has no sound files, dependencies, preload, configuration, mute control, or persistent state beyond its lazy `AudioContext`.

## Workflow

1. Inspect the frontend structure and its existing interaction handlers.
2. Copy `assets/ui-sounds.js` to the app's conventional shared browser utility location. Do not rewrite, translate, wrap, or refactor it.
3. Import `playUISound` into components or modules that already own the relevant user interaction.
4. Add one sound call to each meaningful interaction. Keep the original handler and its ordering intact except for the inserted call.
5. Run the app's relevant typecheck, test, and build commands.

## Presets

Use only these existing names:

| Interaction | Preset |
| --- | --- |
| Pressing a control | `press` |
| Completing an ordinary click | `click` |
| A primary, noticeable action | `tap` |
| Deliberate pointer hover over an interactive item | `hover` |
| Selecting an item or option | `select` |
| Changing a switch-like state | `toggle` |
| A discrete incremental step | `tick` |

Call sounds from a real user gesture:

```js
import { playUISound } from "./lib/ui-sounds.js";

function handleSave() {
  playUISound("tap");
  saveDocument();
}
```

Use the existing optional intensity argument only when the surrounding interaction already has a clear strength distinction:

```js
playUISound("hover", 0.5);
```

## Constraints

- Do not add a sound to disabled controls, initial render, passive content, or server-side code.
- Do not attach multiple sounds to one interaction or duplicate a parent control's sound in a child control.
- Do not add global hover listeners or sound every pointer movement.
- Do not add new presets, audio files, dependencies, providers, hooks, settings, volume controls, or mute controls.
- Do not bypass `prefers-reduced-motion`; the bundled module already respects it.
- Do not surface Web Audio failures to users; the bundled module intentionally treats them as no-ops.
