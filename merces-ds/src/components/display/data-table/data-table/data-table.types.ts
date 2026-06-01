export interface DataTableColumn {
  /** Unique identifier — matches the property key in row data objects */
  key: string;
  /** Main (lower) header text */
  label: string;
  /** Upper text for dual-line headers — omit for single-line */
  extraLabel?: string;
  /** Flex weight controlling column width */
  width: number;
  /** Minimum column width in px — defaults to 100 */
  minWidth?: number;
  /** Maximum column width in px — unconstrained if omitted */
  maxWidth?: number;
  /** Frozen columns are pinned and cannot be resized */
  frozen?: boolean;
}

/** A single row of data — string values keyed by column key */
export type DataTableRow = Record<string, string>;
