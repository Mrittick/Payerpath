# /build

Generate an Angular standalone component from an approved `/inspect` report.

All shared rules (tokens, HSLA, Angular API, asset format, no SCSS) are defined in `CLAUDE.md` — this skill follows them.

## Prerequisites

- A completed and user-approved `/inspect` report for the target component
- Token stylesheets in place (see CLAUDE.md Stylesheet Reference)
- Angular project scaffolded

## Input

The user says `/build` after approving an inspection. If no inspection data is available in this session, check if the user can provide the component name or Figma URL — offer to run `/inspect` first rather than blocking outright.

## Workflow

### Step 1: Confirm Scope

1. Confirm which component is being built (from the approved inspection)
2. Confirm where it should live in the project structure (Atomic Design level)
3. If the component needs sub-components, list them and confirm the build order

### Step 2: Plan the Component

Present a brief build plan:

- **Selector**: `merces-[component-name]`
- **File location**: `src/app/components/[atomic-level]/[component-name]/` (or `src/assets/[asset-type]/` for asset components like icons)
- **Files to create**:
  - `[component-name].component.ts` — standalone component
  - `[component-name].component.html` — template
  - `[component-name].component.css` — component styles
- **Inputs**: List all `input()` / `input.required()` properties derived from Figma variant axes and component properties
- **Outputs**: List any `output()` events (click, toggle, etc.)
- **Host bindings**: Any CSS classes or attributes bound to the host element
- **Dependencies**: Any sub-components or services needed

Wait for user approval of the plan before writing code.

### Step 3: Build

On approval, generate the component files:

#### TypeScript (.component.ts)

- Standalone component (`standalone: true`)
- Signal-based inputs: `input()` / `input.required()` with union types for variants
- Signal-based outputs: `output()` for events
- `changeDetection: ChangeDetectionStrategy.OnPush`
- Use `host` property for host bindings (CSS classes, attributes)
- Proper TypeScript types — no `any`

#### Template (.component.html)

- Semantic HTML elements (button, nav, input — not div soup)
- Bind variant/state inputs to CSS classes or data attributes
- Include ARIA attributes for accessibility
- Use `@if` / `@for` for conditionals and loops (modern Angular control flow)

#### Styles (.component.css)

- Reference design tokens via `var(--token-name)` — never hardcoded values
- Use the component's `:host` selector for host-level styles
- Map Figma states to CSS pseudo-classes and attribute selectors:
  - hover → `:hover`
  - focus → `:focus-visible`
  - active → `:active`
  - disabled → `:disabled` or `[aria-disabled="true"]`
  - variants → `:host([data-variant="value"])` or attribute selectors
- Disabled state must cancel hover/active styles
- Typography via the utility classes from `typography.css`
- Layout must match the inspection report (direction, gap, padding, alignment)

### Step 4: Review

Walk through each file with the user:

1. **Token check** — Every colour, spacing, radius, stroke, and shadow value traces to a CSS custom property
2. **State check** — All states from the inspection are implemented, with correct token mappings
3. **Layout check** — Auto-layout direction, gap, padding, sizing match the inspection
4. **Accessibility check** — ARIA roles, keyboard interaction, focus management
5. **Type check** — All inputs have proper types, no `any`

### Step 5: Final Verification

Present a checklist:

```
## Build Verification — [Component Name]

- [ ] All variants implemented
- [ ] All states implemented (default, hover, focus, active, disabled, ...)
- [ ] All tokens referenced (no hardcoded values)
- [ ] Typography uses utility classes
- [ ] Layout matches Figma (direction, gap, padding, sizing)
- [ ] ARIA attributes present
- [ ] Keyboard interaction works
- [ ] Disabled state cancels hover/active
- [ ] ChangeDetection.OnPush set
- [ ] Standalone component with signal-based inputs/outputs
```

## Rules

- NEVER hardcode colours, spacing, or any visual value — always use `var(--token-name)`
- NEVER use `any` type in TypeScript
- NEVER create div-heavy markup — use semantic HTML
- NEVER skip disabled state handling — it must cancel interactive states
- One component per `/build` pass — keep scope tight
