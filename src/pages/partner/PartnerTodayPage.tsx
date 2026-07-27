import { useMemo } from "react";
import { isSameDay } from "date-fns";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { CycleWheel } from "../../components/today/CycleWheel";
import { PredictionCard } from "../../components/today/PredictionCard";
import { PregnancyWheel } from "../../components/pregnancy/PregnancyWheel";
import { DueDateCard } from "../../components/pregnancy/DueDateCard";
import { PartnerBanner } from "../../components/partner/PartnerBanner";
import { usePartnerView } from "../../context/PartnerViewContext";
import {
  fromDateKey,
  getCurrentCycleDay,
  getFertileWindow,
  getPhaseForDate,
  isDateInRange,
  predictNextPeriodStart,
  PHASE_DESCRIPTIONS,
  PHASE_LABELS,
  toDateKey,
} from "../../utils/cycleCalculations";
import { getDaysUntilDueDate, getDueDate, getPregnancyProgress, getTrimester } from "../../utils/pregnancyCalculations";
import { MOOD_EMOJI, SYMPTOM_LABELS, type Mood, type Symptom } from "../../types";

const TRIMESTER_DESCRIPTIONS: Record<1 | 2 | 3, string> = {
  1: "Early days — her body is laying the groundwork for the months ahead.",
  2: "Often the most comfortable stretch — energy tends to pick back up.",
  3: "The home stretch — getting ready to meet the baby.",
};

export function PartnerTodayPage() {
  const { data } = usePartnerView();
  const settings = data.settings!;
  const trackingMode = settings.trackingMode ?? "cycle";
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const todayLog = data.logs[todayKey];

  const isPregnancy = trackingMode === "pregnancy";

  const cycleDay = getCurrentCycleDay(settings, today);
  const phase = getPhaseForDate(settings, today);
  const nextPeriodStart = predictNextPeriodStart(settings, today);
  const fertileWindow = getFertileWindow(settings, today);
  const isFertileWindow = isDateInRange(today, fertileWindow.start, fertileWindow.end);
  const isOvulationDay = isSameDay(today, fertileWindow.ovulation);

  const lmp = fromDateKey(settings.lastPeriodStart);
  const dueDate = getDueDate(lmp);
  const { week } = getPregnancyProgress(lmp, today);
  const trimester = getTrimester(week);
  const daysUntilDue = getDaysUntilDueDate(dueDate, today);

  return (
    <div>
      <PartnerBanner />
      <PageHeader title="Today" subtitle={isPregnancy ? "Their pregnancy at a glance" : "Their cycle at a glance"} />

      <div className="space-y-4 px-5">
        {isPregnancy ? (
          <>
            <Card>
              <PregnancyWheel week={week} trimester={trimester} />
              <p className="mt-4 text-center text-sm text-neutral-500">{TRIMESTER_DESCRIPTIONS[trimester]}</p>
            </Card>
            <DueDateCard dueDate={dueDate} daysUntilDue={daysUntilDue} trimester={trimester} />
          </>
        ) : (
          <>
            <Card>
              <CycleWheel cycleDay={cycleDay} cycleLength={settings.averageCycleLength} phase={phase} />
              <p className="mt-4 text-center text-sm text-neutral-500">{PHASE_DESCRIPTIONS[phase]}</p>
            </Card>
            <PredictionCard
              nextPeriodStart={nextPeriodStart}
              today={today}
              isFertileWindow={isFertileWindow}
              isOvulationDay={isOvulationDay}
            />
          </>
        )}

        <Card>
          <h3 className="font-semibold text-neutral-800">
            {isPregnancy ? `Week ${week} check-in` : PHASE_LABELS[phase]}
          </h3>

          {todayLog && (todayLog.moods.length > 0 || todayLog.symptoms.length > 0 || todayLog.isPeriodDay) ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {todayLog.isPeriodDay && (
                <span className="rounded-full bg-bloom-100 px-3 py-1 text-xs font-medium text-bloom-700">
                  🩸 Period
                </span>
              )}
              {todayLog.moods.map((m: Mood) => (
                <span key={m} className="rounded-full bg-lavender-100 px-3 py-1 text-xs font-medium text-lavender-600">
                  {MOOD_EMOJI[m]} {m}
                </span>
              ))}
              {todayLog.symptoms.map((s: Symptom) => (
                <span key={s} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {SYMPTOM_LABELS[s]}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-neutral-400">Nothing logged yet today.</p>
          )}
          {todayLog?.notes && <p className="mt-3 text-sm italic text-neutral-500">"{todayLog.notes}"</p>}
        </Card>
      </div>
    </div>
  );
}
