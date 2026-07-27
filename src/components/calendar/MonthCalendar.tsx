import { useMemo } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import type { DayLog, Settings } from "../../types";
import { getFertileWindow, getPhaseForDate, isDateInRange, toDateKey } from "../../utils/cycleCalculations";
import { DayCell, type DayStatus } from "./DayCell";

interface MonthCalendarProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  settings: Settings;
  logs: Record<string, DayLog>;
  onSelectDay: (dateKey: string) => void;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getStatus(date: Date, settings: Settings, logs: Record<string, DayLog>, isPregnancy: boolean): DayStatus {
  const key = toDateKey(date);
  if (logs[key]?.isPeriodDay) return "logged-period";

  // Cycle/fertility predictions aren't meaningful during pregnancy — only real logged data shows.
  if (isPregnancy) return "none";

  const fertile = getFertileWindow(settings, date);
  if (isSameDay(date, fertile.ovulation)) return "ovulation";

  const phase = getPhaseForDate(settings, date);
  if (phase === "menstrual") return "predicted-period";
  if (isDateInRange(date, fertile.start, fertile.end)) return "fertile";

  return "none";
}

export function MonthCalendar({ month, onMonthChange, settings, logs, onSelectDay }: MonthCalendarProps) {
  const isPregnancy = (settings.trackingMode ?? "cycle") === "pregnancy";
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    const result: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      result.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return result;
  }, [month]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(subMonths(month, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-bloom-50 text-bloom-600 hover:bg-bloom-100"
        >
          ‹
        </button>
        <h2 className="text-lg font-semibold text-neutral-800">{format(month, "MMMM yyyy")}</h2>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-bloom-50 text-bloom-600 hover:bg-bloom-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-400">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const key = toDateKey(date);
          return (
            <DayCell
              key={key}
              date={date}
              inCurrentMonth={isSameMonth(date, month)}
              status={getStatus(date, settings, logs, isPregnancy)}
              hasNotes={Boolean(logs[key] && (logs[key].moods.length || logs[key].symptoms.length || logs[key].notes))}
              onClick={() => onSelectDay(key)}
            />
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-500">
        <LegendItem colorClass="bg-bloom-500" label="Period (logged)" />
        {!isPregnancy && (
          <>
            <LegendItem colorClass="bg-bloom-100 border border-dashed border-bloom-300" label="Period (predicted)" />
            <LegendItem colorClass="bg-lavender-500" label="Ovulation" />
            <LegendItem colorClass="bg-lavender-100" label="Fertile window" />
          </>
        )}
      </div>
    </div>
  );
}

function LegendItem({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-full ${colorClass}`} />
      {label}
    </div>
  );
}
