import { isToday } from "date-fns";

export type DayStatus = "logged-period" | "predicted-period" | "ovulation" | "fertile" | "none";

interface DayCellProps {
  date: Date;
  inCurrentMonth: boolean;
  status: DayStatus;
  hasNotes: boolean;
  onClick: () => void;
}

const STATUS_CLASSES: Record<DayStatus, string> = {
  "logged-period": "bg-bloom-500 text-white font-semibold",
  "predicted-period": "bg-bloom-100 text-bloom-600 border border-dashed border-bloom-300",
  ovulation: "bg-lavender-500 text-white font-semibold",
  fertile: "bg-lavender-100 text-lavender-600",
  none: "text-neutral-700",
};

export function DayCell({ date, inCurrentMonth, status, hasNotes, onClick }: DayCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex aspect-square w-full flex-col items-center justify-center rounded-full text-sm transition-transform hover:scale-105 ${
        inCurrentMonth ? "" : "opacity-30"
      } ${STATUS_CLASSES[status]} ${isToday(date) ? "ring-2 ring-neutral-800" : ""}`}
    >
      {date.getDate()}
      {hasNotes && (
        <span
          className={`absolute bottom-1 h-1 w-1 rounded-full ${
            status === "logged-period" || status === "ovulation" ? "bg-white" : "bg-neutral-500"
          }`}
        />
      )}
    </button>
  );
}
