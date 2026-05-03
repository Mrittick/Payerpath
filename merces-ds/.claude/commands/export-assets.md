# /export-assets

Export SVG assets (icons, vectors, graphics) from Figma into the Angular project.

All shared rules (SVG only, no screenshots) are defined in `CLAUDE.md` — this skill follows them.

## Prerequisites

- Figma Context MCP (Framelink) available — uses `download_figma_images`
- Figma Desktop Bridge (Console MCP) — needed when searching by component name

## Input

The user provides one of:
- A Figma URL pointing to a frame/component containing icons
- A component name whose icons need exporting
- A specific asset name to search for
- "all icons" to export the full icon set

## Workflow

### Step 1: Locate Assets

1. If a URL was given, extract the file key and node ID
2. If a component name was given, use `figma_search_components` to find it, then identify child vector/icon nodes
3. If "all icons" was requested, locate the icons page or component set in Figma

### Step 2: Inventory

List all assets to be exported:

```
| # | Node Name | Node ID | Type | Format |
|---|-----------|---------|------|--------|
| 1 | chevron-right | 123:456 | VECTOR | SVG |
| 2 | close | 123:789 | INSTANCE | SVG |
```

If any node appears to be raster (bitmap fill, no vector data), flag it to the user — do not export it as SVG silently.

### Step 3: Confirm Destination

Default export path: `src/assets/icon/svg/`

Icons follow a folder-per-name structure: `src/assets/icon/svg/{name}/{type}.svg` (e.g., `chevron-left/regular.svg`).

If the user hasn't specified a different path, proceed with the default. Only ask if context suggests a different location is needed.

### Step 4: Wait for Approval

**STOP.** Do not export until the user approves the asset list.

### Step 5: Export

Use `download_figma_images` from the Context MCP (Framelink):

- **`download_figma_images` does not support slashes in `fileName`**. Export using flat names with double underscore as separator: `{name}__{type}.svg` (e.g., `chevron-left__regular.svg`)
- Set `localPath` to the confirmed destination directory
- For vector nodes: omit `imageRef` (the tool renders the vector directly)
- For nodes with image fills: include the `imageRef` from the Figma data

### Step 6: Reorganise into Folders

After export, reorganise flat files into the `{name}/{type}.svg` folder structure:
- Split each `{name}__{type}.svg` on `__` → move to `{name}/{type}.svg`
- Use a script to automate (Python or Bash)

### Step 7: Clean SVGs

Every exported SVG must be normalised:
1. **Remove** hardcoded `width` and `height` attributes from the `<svg>` tag (size is controlled via CSS)
2. **Preserve** the `viewBox` attribute (this is what makes vector scaling work)
3. **Replace** hardcoded `fill` and `stroke` colours with `currentColor` (except `fill="none"` and `stroke="none"`)
4. **Remove** Figma-specific metadata, comments, or `xmlns:xlink` attributes

### Step 8: Verify and Report

After export and cleanup:
1. List all files written to the destination
2. Confirm file count matches the approved inventory
3. Spot-check that files are valid SVG (not empty, correct extension, no hardcoded colours, viewBox present)

```
## Export Complete — X assets to `src/assets/icon/svg/`

| File | Source Node | Size |
|------|-----------|------|
| chevron-right/regular.svg | 123:456 | 1.2 KB |
| chevron-right/bold.svg | 123:789 | 0.8 KB |
```

### Step 9: Update Type Map

If new icons were added, update `src/assets/icon/icon.types.ts`:
- Add new entries to the `IconName` union type
- Add entries to `ICON_TYPE_MAP` with available types

## Naming Convention

- Icon folders are **kebab-case**: `icon-name/`
- Type files are **lowercase**: `regular.svg`, `bold.svg`, `filled.svg`
- Strip prefixes like "icon/" or "icons/" from Figma layer names — use just the icon name
- If Figma has a structured naming like `icon/navigation/chevron-right`, flatten to `navigation-chevron-right/` (preserving the group context)

## Rules

- If a raster node is encountered, flag it to the user — do not export it as SVG
- NEVER export without user approval of the asset list
- NEVER overwrite existing files without asking the user
- If an export fails for a specific node, report it and continue with the rest
