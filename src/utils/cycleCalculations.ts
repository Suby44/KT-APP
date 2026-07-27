import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import type { CyclePhase, DayLog, Settings } from "../types";

export const DATE_FORMAT = "yyyy-MM-dd";

export function toDateKey(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function fromDateKey(key: string): Date {
  return parseISO(key);
}

/**
 * Finds the start of the cycle that contains `referenceDate`, by projecting
 * the settings anchor date forward in whole-cycle increments. This keeps
 * predictions correct indefinitely without requiring the anchor to be
 * manually updated every cycle.
 */
export function getCycleStartFor(
  anchorDate: Date,
  averageCycleLength: number,
  referenceDate: Date
): Date {
  const diffDays = differenceInCalendarDays(referenceDate, anchorDate);
  const cyclesElapsed = Math.floor(diffDays / averageCycleLength);
  return addDays(anchorDate, cyclesElapsed * averageCycleLength);
}

export function getCurrentCycleDay(settings: Settings, referenceDate: Date): number {
  const anchor = fromDateKey(settings.lastPeriodStart);
  const cycleStart = getCycleStartFor(anchor, settings.averageCycleLength, referenceDate);
  return differenceInCalendarDays(referenceDate, cycleStart) + 1;
}

export function predictNextPeriodStart(settings: Settings, referenceDate: Date): Date {
  const anchor = fromDateKey(settings.lastPeriodStart);
  const cycleStart = getCycleStartFor(anchor, settings.averageCycleLength, referenceDate);
  return addDays(cycleStart, settings.averageCycleLength);
}

export function getOvulationDate(nextPeriodStart: Date): Date {
  return addDays(nextPeriodStart, -14);
}

export interface FertileWindow {
  start: Date;
  end: Date;
  ovulation: Date;
}

export function getFertileWindow(settings: Settings, referenceDate: Date): FertileWindow {
  const nextPeriod = predictNextPeriodStart(settings, referenceDate);
  const ovulation = getOvulationDate(nextPeriod);
  return {
    start: addDays(ovulation, -5),
    end: addDays(ovulation, 1),
    ovulation,
  };
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = differenceInCalendarDays(date, start);
  const total = differenceInCalendarDays(end, start);
  return d >= 0 && d <= total;
}

export function getPhaseForDate(settings: Settings, date: Date): CyclePhase {
  const anchor = fromDateKey(settings.lastPeriodStart);
  const cycleStart = getCycleStartFor(anchor, settings.averageCycleLength, date);
  const cycleDay = differenceInCalendarDays(date, cycleStart) + 1;
  const ovulationDayNumber = settings.averageCycleLength - 14;

  if (cycleDay <= settings.averagePeriodLength) return "menstrual";
  if (cycleDay < ovulationDayNumber - 1) return "follicular";
  if (cycleDay <= ovulationDayNumber + 1) return "ovulation";
  return "luteal";
}

export const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: "Menstrual phase",
  follicular: "Follicular phase",
  ovulation: "Ovulation phase",
  luteal: "Luteal phase",
};

export const PHASE_DESCRIPTIONS: Record<CyclePhase, string> = {
  menstrual: "Your period is here. Rest and be gentle with yourself.",
  follicular: "Energy is building as hormones rise.",
  ovulation: "Your fertile window — chances of conception peak now.",
  luteal: "Hormones shift again; PMS symptoms may appear.",
};

export interface PastPeriod {
  startDate: string;
  length: number;
}

export interface CycleHistoryEntry {
  startDate: string;
  cycleLength: number | null; // null for the first known period (no prior cycle to measure)
  periodLength: number;
}

/** Groups consecutive isPeriodDay logs into discrete past periods, sorted oldest first. */
export function getPastPeriods(logs: Record<string, DayLog>): PastPeriod[] {
  const periodDates = Object.values(logs)
    .filter((log) => log.isPeriodDay)
    .map((log) => log.date)
    .sort();

  const periods: PastPeriod[] = [];
  let currentStart: string | null = null;
  let currentLength = 0;
  let prevDate: Date | null = null;

  for (const dateStr of periodDates) {
    const date = fromDateKey(dateStr);
    if (prevDate && differenceInCalendarDays(date, prevDate) === 1) {
      currentLength += 1;
    } else {
      if (currentStart) periods.push({ startDate: currentStart, length: currentLength });
      currentStart = dateStr;
      currentLength = 1;
    }
    prevDate = date;
  }
  if (currentStart) periods.push({ startDate: currentStart, length: currentLength });

  return periods;
}

/** Builds cycle-length history from logged periods for the Insights charts. */
export function getCycleHistory(logs: Record<string, DayLog>): CycleHistoryEntry[] {
  const periods = getPastPeriods(logs);
  return periods.map((period, index) => {
    if (index === 0) {
      return { startDate: period.startDate, cycleLength: null, periodLength: period.length };
    }
    const prevStart = fromDateKey(periods[index - 1].startDate);
    const thisStart = fromDateKey(period.startDate);
    return {
      startDate: period.startDate,
      cycleLength: differenceInCalendarDays(thisStart, prevStart),
      periodLength: period.length,
    };
  });
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}
