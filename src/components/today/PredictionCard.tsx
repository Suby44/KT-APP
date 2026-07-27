import { differenceInCalendarDays, format } from "date-fns";
import { Card } from "../ui/Card";

interface PredictionCardProps {
  nextPeriodStart: Date;
  today: Date;
  isFertileWindow: boolean;
  isOvulationDay: boolean;
}

export function PredictionCard({
  nextPeriodStart,
  today,
  isFertileWindow,
  isOvulationDay,
}: PredictionCardProps) {
  const daysUntil = differenceInCalendarDays(nextPeriodStart, today);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="!p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Next period</p>
        <p className="mt-1 text-lg font-bold text-neutral-800">
          {daysUntil <= 0 ? "Any day now" : `In ${daysUntil} day${daysUntil === 1 ? "" : "s"}`}
        </p>
        <p className="text-xs text-neutral-400">{format(nextPeriodStart, "MMM d")}</p>
      </Card>
      <Card className="!p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Fertility</p>
        <p className="mt-1 text-lg font-bold text-lavender-600">
          {isOvulationDay ? "Peak day" : isFertileWindow ? "High chance" : "Low chance"}
        </p>
        <p className="text-xs text-neutral-400">
          {isFertileWindow ? "You're in your fertile window" : "Outside fertile window"}
        </p>
      </Card>
    </div>
  );
}
