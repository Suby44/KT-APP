import { addDays, differenceInCalendarDays } from "date-fns";

const PREGNANCY_LENGTH_DAYS = 280; // 40 weeks from LMP

export function getDueDate(lmp: Date): Date {
  return addDays(lmp, PREGNANCY_LENGTH_DAYS);
}

export interface PregnancyProgress {
  week: number;
  day: number; // day within the current week, 1-7
}

export function getPregnancyProgress(lmp: Date, today: Date): PregnancyProgress {
  const daysSinceLmp = Math.max(0, differenceInCalendarDays(today, lmp));
  const week = Math.floor(daysSinceLmp / 7) + 1;
  const day = (daysSinceLmp % 7) + 1;
  return { week: Math.min(week, 42), day };
}

export function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

export function getDaysUntilDueDate(dueDate: Date, today: Date): number {
  return differenceInCalendarDays(dueDate, today);
}
