export type CalendarLevel = 'date' | 'month' | 'year';

export interface CalendarCell {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  key: string;
  /** Only populated in ranged calendar grids — omitted in single-date grids. */
  rangePosition?: 'none' | 'start' | 'middle' | 'end';
}

export interface MonthCell {
  label: string;
  monthIndex: number; // 0–11
  isDisplayed: boolean; // true when this month is the currently displayed month — drives highlight
  isToday: boolean;    // true when this month is today's actual month — drives dot
}

export interface YearCell {
  year: number;
  isDisplayed: boolean; // true when this year is the currently displayed year — drives highlight
  isToday: boolean;    // true when this year is today's actual year — drives dot
}

export const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;
