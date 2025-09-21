# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the static entry point and ships with the production styles and bootstrap logic for the WebGPU diagnostics UI.
- `public/main.js` manages UI state and renders diagnostics via the shared `boreDOM` helper (`../boreDOM.js`); keep that helper synced locally before serving.
- `public/webgpu.js` contains the pipeline tracker that talks to WebGPU; treat `src/webgpu.js` as the editable source and mirror validated updates into `public/`.
- `public/types.ts` provides TypeScript definitions that power the JSDoc typings in the runtime files.
- Use `tmp/` only for short-lived prototypes; delete artifacts before opening a pull request.

## Build, Serve, and Development Commands
- No build step is required; the project runs directly in the browser once the files are served.
- Serve the root directory over HTTPS when possible (WebGPU requires a secure context): `npx http-server . --port 4173 --ssl` or any equivalent static server.
- For quick smoke checks without Node.js, run `python3 -m http.server 4173` and open `https://localhost:4173/index.html` via a trusted certificate.

## Coding Style & Naming Conventions
- Use two-space indentation, trailing semicolons, and ES modules; follow existing import ordering (standard APIs, local utilities, styles).
- Prefer descriptive camelCase for variables and functions (`renderUI`, `setStatus`) and PascalCase only for types or classes (`WebGPUPipelineTracker`).
- Preserve the mixed JS/TS setup: runtime code stays in `.js` with JSDoc imports, while structural types live in `.ts` inside `public/`.

## Testing Guidelines
- There is no automated test suite yet; validate changes manually in Chromium-based browsers with WebGPU enabled and monitor the console for warnings.
- Recheck the status badges, timing panels, and error cards after each modification to ensure UI bindings still react to state updates.
- When touching WebGPU code, toggle `navigator.gpu` feature availability via browser flags to confirm both success and fallback paths.

## Commit & Pull Request Guidelines
- Follow the existing Git history style: short imperative subjects ("Add diagnostics panel"), preferably under 72 characters, with optional body paragraphs for context.
- Group related changes into single commits; avoid bundling scratch work from `tmp/` or generated assets.
- Pull requests should include a summary of UI or pipeline impacts, reproduction steps, and screenshots or screen recordings when the layout changes.
