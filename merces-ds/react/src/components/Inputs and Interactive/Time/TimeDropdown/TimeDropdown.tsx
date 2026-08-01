import { useMemo } from 'react';
import TimeCell from '../TimeCell/TimeCell';
import type { TimeCellFormat, TimeCellMeridian } from '../TimeCell/TimeCell';
import './TimeDropdown.module.css';

export interface TimeDropdownProps {
  format?: TimeCellFormat;
  interval?: number;
  currentTime?: string | null;
  onSelect?: (time: string) => void;
  className?: string;
}

interface TimeSlot {
  label: string;
  meridian: TimeCellMeridian;
  key: string;
}

function generate24hrSlots(interval: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += interval) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    slots.push({ label, meridian: 'am', key: label });
  }
  return slots;
}

function generate12hrSlots(interval: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += interval) {
    const h24 = Math.floor(minutes / 60);
    const m = minutes % 60;
    const meridian: TimeCellMeridian = h24 < 12 ? 'am' : 'pm';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    const label = `${h12}:${String(m).padStart(2, '0')}`;
    slots.push({ label, meridian, key: `${label} ${meridian}` });
  }
  return slots;
}

export default function TimeDropdown({
  format = '24hr',
  interval = 30,
  currentTime,
  onSelect,
  className,
}: TimeDropdownProps) {
  const slots = useMemo(
    () => format === '24hr' ? generate24hrSlots(interval) : generate12hrSlots(interval),
    [format, interval],
  );

  const rootClasses = ['mds-time-dropdown', className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      <div className="mds-time-dropdown__content">
        {slots.map((slot) => (
          <TimeCell
            key={slot.key}
            time={slot.label}
            format={format}
            meridian={slot.meridian}
            isCurrent={slot.key === currentTime}
            onClick={() => onSelect?.(slot.key)}
          />
        ))}
      </div>
    </div>
  );
}
