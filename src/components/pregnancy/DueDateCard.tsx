import { format } from "date-fns";
import { Card } from "../ui/Card";

interface DueDateCardProps {
  dueDate: Date;
  daysUntilDue: number;
  trimester: 1 | 2 | 3;
}

export function DueDateCard({ dueDate, daysUntilDue, trimester }: DueDateCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="!p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Due date</p>
        <p className="mt-1 text-lg font-bold text-neutral-800">
          {daysUntilDue <= 0 ? "Any day now" : `In ${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`}
        </p>
        <p className="text-xs text-neutral-400">{format(dueDate, "MMM d, yyyy")}</p>
      </Card>
      <Card className="!p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Trimester</p>
        <p className="mt-1 text-lg font-bold text-lavender-600">{trimester === 1 ? "1st" : trimester === 2 ? "2nd" : "3rd"}</p>
        <p className="text-xs text-neutral-400">of 3</p>
      </Card>
    </div>
  );
}
