# Merces Design System — Angular

> This is the constitution of the Merces Design System. Every instruction here is mandatory and overrides default behaviour. No exceptions.

---

## Project Identity

- **Framework**: Angular (NOT AngularJS) — standalone components, modern Angular 19+
- **Architecture**: Atomic Design — tokens, elements, molecules, organs, organ systems, screens
- **Design Source of Truth**: Figma (file key: `Fu2tcEQrSrhZZvhGw1aGZ5`)
- **Styling**: Pure CSS only — CSS custom properties for design tokens, utility classes for typography. No SCSS, no Sass, no preprocessors. No inline values, no hardcoded colours/spacing.

---

## The Sanity Model

These rules govern every interaction. They are non-negotiable.

### General Guidelines

- Avoid hardcoded values — use design tokens defined in the stylesheet.
- When conflicts arise between design system tokens and Figma specs, prefer design system tokens. If a Figma spec references a value that has no corresponding token yet, STOP and ask the user whether to create a new token or map to an existing one.

### Figma-First Discipline

- **Inspect before you code.** Extract all variants, states, and tokens from Figma BEFORE writing a single line. No assumptions, no approximations. For large components, batch inspections logically (by size, theme, etc.) — but all batches must complete before code begins.
- **Use Figma MCP tools only.** Dive deep into actual node data, properties, and tokens. NEVER use `get_screenshot`, `figma_take_screenshot`, `figma_capture_screenshot`, or any vision/screenshot function for Figma inspection.
- **Check state transitions.** Inspect all states (default, hover, focus, disabled, active, and any others present) explicitly. Verify which states exclude others (e.g., disabled must never respond to hover).
- **Check alignments and internal structure.** Verify auto-layout direction, gap, padding, alignment (HUG/FILL/FIXED) per variant. Do not assume consistency across sizes or themes.

### Zero Tolerance for Guesswork

- **No hallucinations or made-up values.** Only use values explicitly defined in the token system. If a value cannot be confirmed — STOP and ask the user for instructions.
- **Use tokens and defined variables.** Reference CSS custom properties from the project's token stylesheet — never raw hex codes, pixel values, or magic numbers inline.
- **Hardcoded values in Figma:** During inspection (`/inspect`, `/audit`), collect and **flag** all hardcoded values in the report — do not stop on each one. During token extraction (`/extract-tokens`), **STOP** — a token cannot be generated from a hardcoded value.

### Communication Protocol

- **Pause on access issues.** If you cannot access a Figma node, token, or any required information — STOP immediately. Tell the user what is blocked and what they need to do. Do not attempt workarounds silently.
- **Never go at it alone.** If something looks off, ambiguous, or unexpected — raise it with options, get clear instructions from the user, then proceed.
- **Be transparent about limitations.** If context is running low, a tool fails, or data seems incomplete — raise the problem, explain the impact, and ask the user how to proceed.

### Build Discipline

- **Build slow, fix never.** One thorough pass beats five patching rounds.
- **Scope carefully.** One component per pass. Manage context strategically.
- **Be surgical with inspections.** Request what you need, not everything at once. Avoid flooding context with redundant data.
- **All variants confirmed, then code.** Never start coding with partial variant data. Complete inspection, present findings, get approval, then build.

#### Design System Integration

- Always use components from the project's design system when possible.
- Map Figma design tokens to project design tokens.
- When a matching component exists, extend it rather than creating a new one.
- Keep components composable and reusable.

#### Validation Checklist

- Layout matches (spacing, alignment, sizing)
- Typography matches (font, size, weight, line height)
- Colours match exactly
- Interactive states work as designed (hover, active, disabled, etc.)
- Responsive behaviour follows Figma constraints
- Assets render correctly
- Accessibility standards met

---

## Workflow

Every component follows this sequence:

1. **Inspect** — Extract all variants, states, tokens, and layout properties from Figma
2. **Present** — Show findings in a structured, readable format
3. **Confirm** — Wait for explicit user approval before writing code
4. **Build** — Implement using only verified values and tokens
5. **Review** — Walk through the implementation with the user

If a gap is discovered during Build, return to Inspect for that specific gap only — re-confirm with the user before continuing.

---

## Figma MCP Strategy

Three Figma MCPs are available. One is the primary build tool. One is a fallback/secondary. One is retired.

**Current versions (as of 2026-05-02):** Console MCP v1.22.4

### Primary Build Tool — Console MCP (Desktop Bridge)

Operates via the **Plugin API**, not the REST API. This is the critical distinction: it returns `boundVariables` — the actual Figma variable reference (`colour/brand/purple-1100`) — not resolved hex values. This is the only way to map tokens accurately to CSS custom properties.

**Core inspection tools:**

| Tool | When to use |
|---|---|
| `figma_execute` | Arbitrary Plugin API queries — walk node trees, extract `boundVariables`, padding, gap, radius, alignment. Primary inspection method. |
| `figma_get_variables` | Extract the full variable/token set from a file. Use for token audits and cross-checking. |
| `figma_analyze_component_set` | **First call on every new component.** Returns all variants, states, and maps them to CSS pseudo-classes (`:hover`, `:focus-visible`, `:disabled`). Replaces manual variant enumeration. |
| `figma_get_text_styles` | Returns all text styles with IDs, families, weights, sizes, line heights. Use during inspection instead of querying text nodes individually. |
| `figma_get_selection` | Reads whatever node the user currently has selected in Figma. Use when user says "look at this" without providing a node ID. |

**Quality and audit tools (use after every build):**

| Tool | When to use |
|---|---|
| `figma_check_design_parity` | Post-build parity check — compares implementation against Figma spec across 8 dimensions (focus indicator, disabled state, error state, keyboard interaction, spacing, colour, typography, sizing). Part of every build's review step. |
| `figma_audit_component_accessibility` | WCAG AA scorecard — state coverage, colour contrast, focus quality, touch target size, colorblind simulation. Run on every interactive component before marking it done. Non-negotiable for a healthcare application. |
| `figma_lint_design` | Detects hardcoded values in the Figma file itself (inline colours, magic numbers, semantic token misuse). Run during `/inspect` to flag design-side issues before they become code-side problems. |

Console is the only tool used during component builds. All queries are by node ID and are completely independent of the user's current Figma selection.

### Secondary — Official Figma Remote MCP

Operates via the **REST API** — read-only, returns resolved values (no `boundVariables`). Already connected via claude.ai. Use only as a fallback for quick component lookups by URL, or to confirm metadata when Console MCP is unavailable.

**Never use for token extraction or component builds.** It strips all variable bindings and returns flat resolved values.

### Retired

| MCP | Why Retired |
|---|---|
| **Context (Framelink)** | Selection-dependent — silently pulls data for whatever node is selected in Figma at call time. Console's `figma_get_selection` covers the same use case without the reliability risk. |
| **Official Figma Desktop MCP** | Selection-based, REST API under the hood — same resolved-value limitation. Console covers everything it does and more. |

### Build Workflow — Tool Sequence

Every component follows this sequence:

1. **`figma_analyze_component_set`** — enumerate all variants and states first
2. **`figma_get_text_styles`** — capture typography bindings
3. **`figma_execute`** — deep-inspect each variant for `boundVariables` (fills, strokes, padding, gap, radius)
4. **`figma_lint_design`** — check for hardcoded values in the Figma source
5. Present findings → confirm → build
6. **`figma_check_design_parity`** — post-build parity check
7. **`figma_audit_component_accessibility`** — WCAG AA scorecard

### Rules

- All Figma inspection must use explicit node IDs. Never rely on selection state (except `figma_get_selection` when the user explicitly points to a node).
- `download_figma_images` exports SVG asset files (icons, vectors). For raster photography only, PNG may be used with user confirmation.
- NEVER use `figma_capture_screenshot`, `figma_take_screenshot`, or any screenshot/vision tool for inspecting design values.
- NEVER use the Official Figma Remote MCP for token or variable data — it resolves all values to hex and strips variable bindings.

---

## Project Scaffold

The Angular project is scaffolded at the root (`merces-ds/angular/`):

| File | Purpose |
|---|---|
| `package.json` | Angular 19+ dependencies |
| `angular.json` | Workspace config — Vite-based `application` builder, assets from `src/assets/`, all token stylesheets in `styles` array |
| `tsconfig.json` / `tsconfig.app.json` | Strict TypeScript config |
| `src/main.ts` | Bootstrap entry point |
| `src/app/app.config.ts` | Application config — `provideHttpClient()`, `provideZoneChangeDetection()` |
| `src/app/app.component.ts` | Root component |
| `src/index.html` | Shell HTML |

- **Dev server**: `ng serve` (Vite + esbuild under the hood, port 4200)
- **Polyfills**: `zone.js` (configured in `angular.json`)
- **Assets**: Everything under `src/assets/` is served at `/assets/` at runtime

---

## Built Components

### Icon (`src/assets/icon/`)

Asset component — a reusable icon set consumed by other components. Lives in `src/assets/icon/`, not `src/app/components/`.

**Selector**: `merces-icon`

| Input | Type | Default | Description |
|---|---|---|---|
| `name` | `IconName` (82-value string union) | *required* | Which icon (e.g., `'chevron-left'`) |
| `type` | `'regular' \| 'bold' \| 'filled'` | `'regular'` | Style variant |
| `size` | `'huge' \| 'large' \| 'base' \| 'mini' \| 'tiny' \| number` | `'base'` | Preset (32/24/20/16/12 px) or any custom px value |
| `label` | `string` | `undefined` | Accessible label. If omitted, icon is decorative (`aria-hidden="true"`) |

**Key behaviours**:
- Icons inherit colour via `currentColor` — no hardcoded colour. Parent sets the colour.
- `transition: color 0.2s ease` for smooth state transitions (e.g., button hover)
- 1:1 aspect ratio locked to prevent distortion
- SVGs lazy-loaded and cached by `IconRegistryService` (uses `HttpClient`)

**Files**:
- `icon.component.ts` / `.html` / `.css` — the component
- `icon.types.ts` — `IconName`, `IconType`, `IconSize` types + `ICON_TYPE_MAP`
- `icon-registry.service.ts` — SVG loader/cache service
- `svg/{name}/{type}.svg` — 208 cleaned SVGs across 82 icon names

**Usage**: `import { IconComponent } from '../assets/icon/icon.component';`

### Sub Controls (`src/components/inputs-and-interactive/sub-controls/`)

All 8 sub-controls are built. Each is a standalone Angular component with `ChangeDetectionStrategy.OnPush`.

| Component | Selector | Inputs | Key Features |
|---|---|---|---|
| **Clear** | `merces-clear` | `size`, `level`, `state`, `label` | 2 sizes, 3 levels, 3 states |
| **Search** | `merces-search` | `size`, `value` (two-way), `disabled` | 2 sizes, auto mode, keyboard focus |
| **Done** | `merces-done` | `size`, `level`, `state`, `label` | 2 sizes, 3 levels, optional label, 3 states |
| **Chevron Badge** | `merces-chevron-badge` | `size`, `direction`, `state` | 3 sizes, 4 directions, 4 states |
| **Active Indicator** | `merces-active-indicator` | `state` | 3 states, parent-driven passive dot |
| **Filter** | `merces-filter` | `mode`, `isActive` | 4 modes, hover/pressed, active indicator sync, keyboard focus |
| **More Info** | `merces-more-info` | `label` | Inline text+icon link, 3 states |
| **Copier** | `merces-copier` | `behaviour`, `variant`, `value` | 2 behaviours (contextual/minimal), 3 variants, clipboard API, animated text slide-up + width expansion |

**Usage**: `import { ClearComponent } from '../components/inputs-and-interactive/sub-controls/clear/clear.component';`

**Shared patterns across sub-controls**:
- Host bindings for CSS state classes (e.g., `[class.filter--default]`)
- Keyboard focus tracking via `_keyboardFocused` flag + `:focus-visible` ring
- `HostListener` for `click`, `keydown.enter`, `keydown.space`
- Transitions use `cubic-bezier(0, 0, 0, 1)` matching Figma prototype curves

### Data Table (`src/components/display/data-table/`)

Self-contained data table with selection, sorting, deletion, and empty state. All state lives inside the component — the parent only provides data and reacts to events.

**Files**:
- `data-table/data-table.component.ts/.html/.css` — the container component (`merces-data-table`)
- `data-table/data-table.types.ts` — `DataTableColumn`, `DataTableRow` types
- `table-header/` — sticky header cell (checker + string types, single/dual variant)
- `table-row/` — a data row (alternating stripe, keyboard-activatable)
- `table-entry/` — a cell (selection checkbox or string value)
- `table-no-data/` — empty state shown when all rows are deleted

**Selector**: `merces-data-table`

| Input | Type | Default | Description |
|---|---|---|---|
| `columns` | `DataTableColumn[]` | `[]` | Column definitions (key, label, optional extraLabel, width, minWidth) |
| `rows` | `DataTableRow[]` | `[]` | Source data — `Record<string, string>` keyed by column key |
| `rowHeight` | `number` | `56` | Row height in px (also applies to table-entry height) |
| `size` | `'base' \| 'mini'` | `'mini'` | Passed through to all child sub-components |

| Output | Type | Description |
|---|---|---|
| `selectionChange` | `DataTableRow[]` | Emits the current selection whenever it changes |

**Public API** (via template reference `#tableRef`):

| Member | Type | Description |
|---|---|---|
| `anySelected` | `Signal<boolean>` | True if ≥1 row is selected |
| `isEmpty` | `Signal<boolean>` | True if no active rows (or all are animating out) |
| `sortedRows` | `Signal<DataTableRow[]>` | Current rows in display order |
| `deleteSelected()` | method | Animates selected rows out (220ms), then removes them |
| `reset()` | method | Restores all deleted rows, clears selection and sort |

**Key behaviours**:
- Non-destructive deletion — source `rows` input is never mutated; deleted row references are tracked in `_deletedRows: Set<DataTableRow>`. `reset()` clears the set.
- `isEmpty` switches to no-data state BEFORE rows finish animating out (prevents height collapse to zero and back up).
- The `:host` has `flex: 1; min-height: 0` — it is designed to fill a flex-column parent. Place it inside a sized flex container.
- Dropdowns inside the parent card must NOT have `overflow: hidden` — this clips the dropdown panel regardless of z-index.

**Usage**:
```typescript
import { DataTableComponent } from '../components/display/data-table/data-table/data-table.component';
import { DataTableColumn, DataTableRow } from '../components/display/data-table/data-table/data-table.types';
```
```html
<merces-data-table
  #myTable
  [columns]="myColumns"
  [rows]="myRows"
  [rowHeight]="rowHeight()"
  (selectionChange)="onSelection($event)"
/>
<merces-cta-button [disabled]="!myTable.anySelected()" (pressed)="myTable.deleteSelected()" />
```

---

## Stylesheet Reference

All design tokens live in `src/stylesheet/tokens/`. One Figma collection = one CSS file.

| File | Figma Collection | Tokens | Notes |
|---|---|---|---|
| `primitives.css` | Primitives | 94 | Raw palette values — colours, strokes |
| `semantic-tokens.css` | Semantic Tokens | 311 | 2 modes: Payerpath (default), eChart Coder. Colours, gap, radius, stroke |
| `typography.css` | Typography | 31 | Utility classes (not custom properties). Satoshi Variable font |
| `shadows.css` | Shadows | 3 | Box-shadow tokens |

Base styles:
- `src/stylesheet/reset.css` — CSS reset
- `src/stylesheet/global.css` — Global defaults referencing tokens

### Token Naming Convention

Figma variable path → CSS custom property:
- `colour/bg-fill/button/brand/primary-default` → `--colour-bg-fill-button-brand-primary-default`
- `gap/sm` → `--gap-sm`
- Slashes become hyphens, spaces become hyphens, everything lowercase

### Mode Overrides

Default mode (Payerpath) values in `:root`. eChart Coder overrides in `[data-theme="echart-coder"]` — only tokens that differ.

### Typography

**Always use typography utility classes.** Never write raw `font-size`, `font-weight`, `font-style`, or `line-height` in component CSS. Every text element must use the corresponding utility class from `typography.css` (e.g., `paragraph-ui`, `paragraph-ui-thin-stylised`, `heading-h5`). Apply the class in HTML, then only override colour/decoration/transitions in CSS. Figma text style names map directly: `paragraph/ui-thin` → `.paragraph-ui-thin`.

### Colour Format

**HSLA only.** All colours use `hsla(h, s%, l%, a)`. No hex codes, no rgba. No exceptions.

### Zero Inline Values

**Every value must come from a token — no exceptions.** All colours, spacing, radii, strokes, and shadows in component CSS must reference a CSS custom property (`var(--token-name)`). The token may be semantic (e.g., `--colour-bg-fill-button-tab-default`) or primitive (e.g., `--colour-brand-purple-100`) — both are valid. What is never valid is a raw inline value (`hsla(...)`, `8px`, `#1A1A1A`). If a Figma spec maps to a primitive token rather than a semantic one, use the primitive. If a value has no corresponding token at all, STOP and ask the user.

### Asset Format

**SVG only for icons and vector graphics.** PNG is never acceptable for icons. PNG may only be used for raster photography or complex bitmap illustrations, and only with explicit user confirmation.

### Angular Component API

- Use signal-based `input()` / `input.required()` functions (Angular 19+). Do not use the `@Input()` decorator.
- Use `output()` function for events. Do not use the `@Output()` decorator.
- All components must be standalone with `ChangeDetectionStrategy.OnPush`.
- **NEVER use `style` as an input name.** It collides with the native HTML `style` attribute — Angular interprets `style="value"` as inline CSS, not a component input. Use `variant` instead.
- **Strokes on interactive components — use `box-shadow: inset`, not `border`.** Any stroke that appears, disappears, changes colour, or changes width on a state transition must be implemented as `box-shadow: inset 0 0 0 Xpx var(--token)`. Zero box-model impact at any thickness. Fully animatable — both colour and width — without layout reflow. No transparent-border workarounds needed. `border` is only appropriate for: (a) static strokes that exist identically in every state and never transition, or (b) dashed/dotted strokes.
- **Always write a zero-spread transparent shadow in the strokeless default state — never `box-shadow: none`.** Without a matching shadow in both states, the browser has nothing to interpolate from and the transition snaps instead of animating smoothly:
  ```css
  /* ✅ smooth */   box-shadow: inset 0 0 0 0px hsla(0, 0%, 0%, 0);
  /* ❌ abrupt snap */ box-shadow: none;
  ```
  When combining with an elevation shadow token, keep the shadow count consistent across all states:
  ```css
  /* default */ box-shadow: var(--shadow-card), inset 0 0 0 0px hsla(0, 0%, 0%, 0);
  /* hover */   box-shadow: var(--shadow-card), inset 0 0 0 2px var(--colour-stroke-hover);
  ```
- **Focus rings use `outline`, not `box-shadow: inset`.** `outline` lives outside the box model entirely — it never causes layout shifts regardless of whether it appears or disappears. The `box-shadow: inset` rule covers design-state strokes (hover, selected, error, etc.). These are separate concerns and must never be conflated.
- **Verify token names exist before using them.** A CSS custom property that doesn't resolve (e.g., `var(--colour-stroke-divider-default)`) silently evaluates to nothing — borders vanish, colours disappear, no error. Always check `semantic-tokens.css` or `primitives.css` for the exact token name.
- **Focus states are keyboard-only — always.** This is a signature behaviour of the Merces Design System. Focus rings must use `:focus-visible` (or a JS-based keyboard-focus class), never `:focus`. Mouse clicks must never show a focus ring. This applies universally to every interactive component — buttons, inputs, dropdowns, modal fields, chips, tabs, and any future component. No exceptions.

---

## Commitment

**Simple solutions to complex problems.** Avoid complex solutions to simple or complex problems alike. The measure of proficiency is not cleverness but clarity — fewer moving parts, fewer failure modes, fewer surprises.

Discipline over speed. Empirical values over assumptions. When in doubt, stop and ask.
