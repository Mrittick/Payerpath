export type TimeFormat = '12hr' | '24hr';

export interface TimeEntry {
  /** Internal value: always "HH:MM" 24-hour format, e.g. "14:30". */
  value: string;
  /** Display label for the time portion, e.g. "1:30" (12hr) or "14:30" (24hr). */
  label: string;
  /** "am" | "pm" for 12hr format, null for 24hr. */
  meridian: 'am' | 'pm' | null;
  disabled: boolean;
}
