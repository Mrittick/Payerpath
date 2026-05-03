# /audit

Compare a built Angular component against its Figma source to detect drift — mismatched tokens, missing states, layout discrepancies.

All shared rules (tokens, HSLA, asset format) are defined in `CLAUDE.md` — this skill follows them.

## Prerequisites

- Figma Desktop Bridge plugin running (Console MCP connected)
- Figma Context MCP (Framelink) available
- The Angular component must already be built and present in the project

## Input

The user provides one of:
- A component name (e.g., "CTA Button")
- A path to the component directory
- A Figma URL and corresponding Angular component

If the user just says `/audit` with no target, ask which component to audit.

**Scope modifier:** The user can append a focus keyword to narrow the audit:
- `/audit tokens` — only compare token bindings (skip layout, states, variants)
- `/audit states` — only compare interactive states
- `/audit layout` — only compare layout/spacing
- `/audit` (no modifier) — full audit across all categories

## Workflow

### Step 1: Locate Both Sides

1. **Figma side** — Find the component in Figma (search or node ID)
2. **Code side** — Find the Angular component files (`.ts`, `.html`, `.css`)
3. If both are unambiguous, proceed directly. Only confirm with the user if there's ambiguity.

### Step 2: Figma Extraction

Extract from Figma (scope depends on the modifier):

**Full audit or tokens:** All token bindings (colour, spacing, stroke, radius)
**Full audit or states:** All interactive states (default, hover, focus, active, disabled)
**Full audit or layout:** Layout properties (direction, gap, padding, sizing)
**Always:** Variant properties, typography references

Use Console MCP for values/tokens and Context MCP for layout — same approach as `/inspect`.

### Step 3: Read the Code

Read the Angular component files and extract (matching the audit scope):
- CSS custom property references (`var(--token-name)`)
- CSS states (`:hover`, `:focus-visible`, `:active`, `:disabled`, attribute selectors)
- Layout CSS (display, flex-direction, gap, padding, width, height)
- Input properties and their types
- Typography classes used

### Step 4: Compare

Run a systematic comparison across the relevant categories:

#### Tokens (if in scope)
| Token | Figma | Code | Status |
|---|---|---|---|
| --colour-bg-fill-... | bound | referenced | Match |
| --gap-md | bound | hardcoded 8px | DRIFT |
| --radius-lg | bound | missing | MISSING |

#### States (if in scope)
| State | Figma | Code | Status |
|---|---|---|---|
| default | yes | yes | Match |
| hover | yes | yes | Match |
| disabled | yes | missing | MISSING |

#### Layout (if in scope)
| Property | Figma | Code | Status |
|---|---|---|---|
| Direction | horizontal | row | Match |
| Gap | --gap-md | var(--gap-md) | Match |
| Padding | 12 16 12 16 | 12px 16px | Check token ref |

#### Variants
| Variant | Figma | Code | Status |
|---|---|---|---|
| size=sm | yes | yes | Match |
| size=lg | yes | missing | MISSING |

### Step 5: Present Report

```
## Audit Report — [Component Name]

### Scope: [Full / Tokens / States / Layout]
### Score: X/Y checks passed

### Drift Found
1. [Category] — [Description of mismatch]

### Missing
1. [What's in Figma but not in code]

### Hardcoded Values
1. [Values that should reference tokens]

### Recommendations
1. [Specific fix for each issue]
```

### Step 6: Offer Fix

If drift is found, ask the user:
- "Should I fix these issues now?"
- If yes, apply targeted fixes (surgical edits, not full rewrites)
- If no, leave as documented

## Rules

- NEVER modify code without user approval
- NEVER skip the Figma extraction — always compare against the live source of truth
- Report ALL discrepancies, no matter how small
- Hardcoded values in CSS that have corresponding tokens are always flagged as drift
- Collect all hardcoded values in the report — do not stop on each one
