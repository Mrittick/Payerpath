# /inspect

Deep-inspect a Figma component and present all findings for approval before any code is written.

All shared rules (tokens, HSLA, no screenshots, asset format) are defined in `CLAUDE.md` — this skill follows them.

## Prerequisites

- Figma Desktop Bridge plugin running (Console MCP connected)
- Figma Context MCP (Framelink) available

## Input

The user provides one of:
- A Figma URL with a node selected
- A component name to search for
- A node ID directly

If no input is given, ask the user which component to inspect.

## Workflow

### Step 1: Connect and Verify

1. Check Console MCP status via `figma_get_status`
2. If not connected — STOP. Tell the user to start the Desktop Bridge plugin.
3. Verify the connected file is "Merces | Design System"

### Step 2: Locate the Component

1. If a URL was given, extract the node ID
2. If a name was given, use `figma_search_components` to find it
3. If the search returns multiple matches, present them and ask the user to pick one. If it returns a single clear match, proceed directly.

### Step 3: Extract Component Structure

Use **Console MCP** (`figma_execute`) to extract:

1. **Component type** — Component or Component Set (with variants)
2. **Variant properties** — All variant axes and their values (e.g., Size: sm/md/lg, State: default/hover/pressed/disabled)
3. **Component properties** — TEXT, BOOLEAN, INSTANCE_SWAP properties and their defaults
4. **States** — All interactive states present (default, hover, focus, active, pressed, disabled, etc.)
5. **Tokens used** — All bound variables (colour, spacing, stroke, radius tokens). Report token names, not raw values.
6. **Text content** — All text nodes, their content, and which typography class they map to
7. **Icons/assets** — Any instance swaps or vector nodes that represent icons

### Step 4: Extract Layout Structure

Use **Context MCP** (`get_design_context`) to extract:

1. **Auto-layout** — Direction, gap, padding (top, right, bottom, left), alignment
2. **Sizing** — Width/height constraints (HUG, FILL, FIXED) and min/max values
3. **Nesting** — Frame hierarchy and how children are arranged
4. **Responsive behaviour** — How the component adapts (fill vs fixed widths)

### Step 5: Cross-check Per Variant

For Component Sets with variants:

1. Inspect each variant combination that represents a distinct visual state
2. Note which tokens change between variants (e.g., primary-default vs primary-hover)
3. Note which layout properties change between size variants
4. Collect all hardcoded/inline values — do NOT stop on each one, just flag them all in the report

### Step 6: Present Findings

Present a structured report:

```
## [Component Name]

### Identity
- Type: Component / Component Set
- Variants: [list axes and values]
- Properties: [list component properties]

### Tokens Used
| Token | Category | Used For |
|---|---|---|
| --colour-bg-fill-button-brand-primary-default | colour | Background fill |
| --gap-md | gap | Internal spacing |

### Layout
| Property | Value |
|---|---|
| Direction | Horizontal / Vertical |
| Gap | --gap-md (8px) |
| Padding | 12px 16px / token reference |
| Width | HUG / FILL / 200px |
| Height | HUG / FILL / 40px |

### State Map
| State | Background | Text | Border | Cursor |
|---|---|---|---|---|
| default | --token-x | --token-y | --token-z | pointer |
| hover | --token-a | ... | ... | pointer |
| disabled | --token-b | ... | ... | not-allowed |

### Typography
| Element | Class | Content |
|---|---|---|
| Label | .text-ui-02 | "Button Text" |

### Icons / Assets
| Slot | Node | Format |
|---|---|---|
| Leading icon | [node name] | SVG |

### Flags
- [Hardcoded values, missing tokens, ambiguities — all collected here]
```

### Step 7: Wait for Approval

**STOP.** Do not proceed to building until the user explicitly approves the inspection report. If the user flags corrections, re-inspect those specific items and update the report.

## Rules

- NEVER skip variants — inspect all of them.
- NEVER assume state transitions — verify each state explicitly.
- NEVER proceed to code without user approval of the inspection report.
- If a token binding cannot be resolved, flag it in the report — do not guess.
- Hardcoded values in Figma: collect them all and flag in the Flags section. Do not stop on each one.
