import { useState } from 'react';
import { CalendarUI } from './CalendarUI/CalendarUI';
import { CalendarFramework } from './CalendarFramework/CalendarFramework';
import { CalendarDateCell } from './CalendarDateCell/CalendarDateCell';
import { CalendarWeekday } from './CalendarWeekday/CalendarWeekday';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { CalendarSelectCell } from './CalendarSelectCell/CalendarSelectCell';

/* ==========================================================================
   Calendar Demo — Shows all calendar components and their variants.
   ========================================================================== */

export function CalendarDemo() {
  const today = new Date();

  /* --- Single date selection --- */
  const [singleDate, setSingleDate] = useState<Date | null>(null);

  /* --- Ranged date selection --- */
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  /* --- Long-ranged date selection --- */
  const [longRange, setLongRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  return (
    <section style={{ padding: 40, fontFamily: 'var(--font-family)' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
        Calendar Components
      </h1>

      {/* ================ ORGANISM: Calendar UI ================ */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Calendar UI — Organism
      </h2>

      {/* Single */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#666' }}>
          Single Mode
          {singleDate && (
            <span style={{ fontWeight: 400, marginLeft: 12 }}>
              Selected: {singleDate.toLocaleDateString()}
            </span>
          )}
        </h3>
        <CalendarUI
          selectedDate={singleDate}
          onDateClick={setSingleDate}
          today={today}
        />
      </div>

      {/* Ranged */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#666' }}>
          Ranged Mode
          {range.start && (
            <span style={{ fontWeight: 400, marginLeft: 12 }}>
              {range.start.toLocaleDateString()}
              {range.end ? ` – ${range.end.toLocaleDateString()}` : ' – ...'}
            </span>
          )}
        </h3>
        <CalendarUI
          ranged
          selectedRange={range}
          onRangeChange={setRange}
          today={today}
        />
      </div>

      {/* Long Ranged */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#666' }}>
          Long Ranged Mode
          {longRange.start && (
            <span style={{ fontWeight: 400, marginLeft: 12 }}>
              {longRange.start.toLocaleDateString()}
              {longRange.end ? ` – ${longRange.end.toLocaleDateString()}` : ' – ...'}
            </span>
          )}
        </h3>
        <CalendarUI
          longRanged
          selectedRange={longRange}
          onRangeChange={setLongRange}
          today={today}
        />
      </div>

      {/* ================ ORGAN: Calendar Framework ================ */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Calendar Framework — Organ (standalone)
      </h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        <CalendarFramework today={today} />
        <CalendarFramework ranged today={today} />
      </div>

      {/* ================ CELLS: Atomic Components ================ */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Date Cell — States (Single)
      </h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <CalendarDateCell date={14} currentMonth state="default" />
        <CalendarDateCell date={14} currentMonth state="hover" />
        <CalendarDateCell date={14} currentMonth state="pressed" />
        <CalendarDateCell date={14} currentMonth state="focus" />
        <CalendarDateCell date={14} currentMonth state="disabled" />
        <CalendarDateCell date={14} currentMonth isToday state="default" />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#666' }}>
        Non-current month states
      </h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <CalendarDateCell date={29} currentMonth={false} state="default" />
        <CalendarDateCell date={29} currentMonth={false} state="hover" />
        <CalendarDateCell date={29} currentMonth={false} state="pressed" />
        <CalendarDateCell date={29} currentMonth={false} state="disabled" />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#666' }}>
        Ranged — Selected positioning
      </h3>
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
        <CalendarDateCell date={10} currentMonth ranged isSelected positioning="start" state="focus" />
        <CalendarDateCell date={11} currentMonth ranged isSelected positioning="middle" />
        <CalendarDateCell date={12} currentMonth ranged isSelected positioning="middle" />
        <CalendarDateCell date={13} currentMonth ranged isSelected positioning="end" state="focus" />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#666' }}>
        Ranged — Middle states (hover/pressed)
      </h3>
      <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
        <CalendarDateCell date={10} currentMonth ranged isSelected positioning="start" state="focus" />
        <CalendarDateCell date={11} currentMonth ranged isSelected positioning="middle" state="hover" />
        <CalendarDateCell date={12} currentMonth ranged isSelected positioning="middle" state="pressed" />
        <CalendarDateCell date={13} currentMonth ranged isSelected positioning="end" state="focus" />
      </div>

      {/* Weekday */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Weekday Cell
      </h2>
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <CalendarWeekday key={i} label={d} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <CalendarWeekday key={i} label={d} ranged />
        ))}
      </div>

      {/* Header */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Header Cell — Levels
      </h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
        <CalendarHeader level="date" month="February" year={2026} />
        <CalendarHeader level="month" year={2026} />
        <CalendarHeader level="year" yearFrom={2020} yearTo={2029} />
      </div>

      {/* Month & Year Select */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Select Cell — Month & Year
      </h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <CalendarSelectCell label="Jan" />
        <CalendarSelectCell label="Feb" isCurrent />
        <CalendarSelectCell label="Mar" />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
        <CalendarSelectCell label="2024" />
        <CalendarSelectCell label="2026" isCurrent />
        <CalendarSelectCell label="2028" />
      </div>
    </section>
  );
}
