# /extract-tokens

Extract design tokens from Figma and generate/update the pure CSS token stylesheets.

All shared rules (HSLA, naming convention, mode overrides, file structure) are defined in `CLAUDE.md` — this skill follows them.

## Prerequisites

- Figma Desktop Bridge plugin must be running (Console MCP connected)

## Workflow

### Step 1: Connect and Verify

1. Check Console MCP status via `figma_get_status`
2. If not connected — STOP. Tell the user: "Open Figma Desktop → Right-click canvas → Plugins → Development → Figma Desktop Bridge"
3. Verify the connected file is "Merces | Design System"

### Step 2: Discover Collections

1. Use `figma_execute` with `figma.variables.getLocalVariableCollectionsAsync()` to list all collections
2. Present the collection names and variable counts
3. Extract ALL collections by default. Only ask the user to filter if there are new/unexpected collections.

### Step 3: Extract Variables

For each collection:

1. Use `figma_execute` to get all variables with resolved values
2. Resolve all aliases to final values (follow alias chains)
3. Convert all colour values to HSLA (see conversion below)
4. Record the exact Figma group path for each variable
5. For multi-mode collections, extract ALL modes — note which tokens differ between modes

#### HSLA Conversion

Figma stores colours as `{r, g, b, a}` floats (0–1). Convert directly:
- Calculate H (0–360), S (0–100%), L (0–100%) from RGB
- Round alpha to 2 decimal places
- Output: `hsla(h, s%, l%, a)`

### Step 4: Present Findings

Show a structured summary per collection:
- Collection name and mode names
- Total variable count
- Groups with counts (matching Figma's structure)
- Tokens that differ between modes

### Step 5: Wait for Approval

**STOP.** Do not write any files until the user explicitly approves.

### Step 6: Generate Files

On approval, generate CSS following the conventions in CLAUDE.md (Stylesheet Reference section):

- `:root { }` block with default mode values
- `[data-theme="<mode-name>"]` override block containing ONLY tokens that differ
- Group comments: `/* ── group/path (count) ── */`
- FLOAT values: `0` for zero, `px` for all others

### Step 7: Verify

- Count CSS custom properties — must match Figma variable count exactly
- All modes present (default in `:root`, overrides in `[data-theme]`)
- Group comments match Figma's group paths and counts
- All colours are HSLA

## Error Handling

- Variable alias cannot be resolved → STOP, report the broken alias path
- Console MCP disconnects mid-extraction → STOP, ask user to reconnect
- Hardcoded value found (not a variable) → STOP, report it. A token cannot be generated from a hardcoded value.
- Value cannot be converted to HSLA → STOP, report the raw value for user decision
