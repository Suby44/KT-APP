import { format, parseISO } from "date-fns";
import { Sheet } from "../ui/Sheet";
import { FLOW_LABELS, MOOD_EMOJI, MOOD_LABELS, SYMPTOM_LABELS, type DayLog } from "../../types";

interface PartnerDayDetailSheetProps {
  open: boolean;
  onClose: () => void;
  dateKey: string;
  log?: DayLog;
}

export function PartnerDayDetailSheet({ open, onClose, dateKey, log }: PartnerDayDetailSheetProps) {
  const displayDate = format(parseISO(dateKey), "EEEE, MMMM d");

  return (
    <Sheet open={open} onClose={onClose} title={displayDate}>
      {!log || (!log.isPeriodDay && log.moods.length === 0 && log.symptoms.length === 0 && !log.notes) ? (
        <p className="text-sm text-neutral-400">Nothing logged for this day.</p>
      ) : (
        <div className="space-y-5">
          {log.isPeriodDay && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">Period</h3>
              <p className="text-sm text-neutral-600">🩸 {log.flow ? FLOW_LABELS[log.flow] : "Logged"}</p>
            </section>
          )}
          {log.moods.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">Mood</h3>
              <div className="flex flex-wrap gap-2">
                {log.moods.map((m) => (
                  <span key={m} className="rounded-full bg-lavender-100 px-3 py-1 text-xs font-medium text-lavender-600">
                    {MOOD_EMOJI[m]} {MOOD_LABELS[m]}
                  </span>
                ))}
              </div>
            </section>
          )}
          {log.symptoms.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {log.symptoms.map((s) => (
                  <span key={s} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-neutral-600">
                    {SYMPTOM_LABELS[s]}
                  </span>
                ))}
              </div>
            </section>
          )}
          {log.notes && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-neutral-700">Notes</h3>
              <p className="text-sm text-neutral-600">{log.notes}</p>
            </section>
          )}
        </div>
      )}
    </Sheet>
  );
}
