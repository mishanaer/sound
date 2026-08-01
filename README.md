# sound

Procedural interface sounds and a skill for adding them to websites.

`sound` uses no audio files or dependencies. Sounds are generated in the
browser with the Web Audio API.

## Presets

- `press` — press
- `click` — click
- `tap` — primary action
- `hover` — hover
- `select` — selection
- `toggle` — state change
- `tick` — discrete step

## Behavior

- Each sound varies slightly because of procedural noise.
- Sound does not play when the system Reduce Motion preference is enabled.
- `AudioContext` is created only on the first user interaction.
- Web Audio errors are silently ignored.
