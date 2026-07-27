import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Sheet } from "../ui/Sheet";
import { Chip } from "../ui/Chip";
import { Button } from "../ui/Button";
import {
  FLOW_LABELS,
  MOOD_EMOJI,
  MOOD_LABELS,
  SYMPTOM_LABELS,
  type DayLog,
  type FlowLevel,
  type Mood,
  type Symptom,
} from "../../types";

interface LogSheetProps {
  open: boolean;
  onClose: () => void;
  dateKey: string;
  existingLog?: DayLog;
  onSave: (log: DayLog) => void;
}

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export function LogSheet({ open, onClose, dateKey, existingLog, onSave }: LogSheetProps) {
  const [isPeriodDay, setIsPeriodDay] = useState(false);
  const [flow, setFlow] = useState<FlowLevel | undefined>(undefined);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setIsPeriodDay(existingLog?.isPeriodDay ?? false);
      setFlow(existingLog?.flow);
      setMoods(existingLog?.moods ?? []);
      setSymptoms(existingLog?.symptoms ?? []);
      setNotes(existingLog?.notes ?? "");
    }
  }, [open, dateKey, existingLog]);

  const displayDate = format(parseISO(dateKey), "EEEE, MMMM d");

  const handleSave = () => {
    onSave({ date: dateKey, isPeriodDay, flow: isPeriodDay ? flow : undefined, moods, symptoms, notes });
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={displayDate}>
      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">Period day</h3>
            <button
              type="button"
              onClick={() => setIsPeriodDay((v) => !v)}
              className={`h-7 w-12 rounded-full transition-colors ${isPeriodDay ? "bg-bloom-500" : "bg-neutral-200"}`}
            >
              <span
                className={`block h-6 w-6 translate-x-0.5 rounded-full bg-white shadow transition-transform ${
                  isPeriodDay ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {isPeriodDay && (
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(FLOW_LABELS) as FlowLevel[]).map((level) => (
                <Chip key={level} selected={flow === level} onClick={() => setFlow(level)}>
                  {FLOW_LABELS[level]}
                </Chip>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold text-neutral-700">Mood</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MOOD_LABELS) as Mood[]).map((mood) => (
              <Chip key={mood} selected={moods.includes(mood)} onClick={() => setMoods((m) => toggleItem(m, mood))}>
                {MOOD_EMOJI[mood]} {MOOD_LABELS[mood]}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold text-neutral-700">Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SYMPTOM_LABELS) as Symptom[]).map((symptom) => (
              <Chip
                key={symptom}
                selected={symptoms.includes(symptom)}
                onClick={() => setSymptoms((s) => toggleItem(s, symptom))}
              >
                {SYMPTOM_LABELS[symptom]}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-neutral-700">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else you'd like to remember..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-bloom-100 bg-bloom-50/50 px-4 py-3 text-sm text-neutral-700 focus:border-bloom-400 focus:outline-none"
          />
        </section>

        <Button onClick={handleSave} className="w-full">
          Save
        </Button>
      </div>
    </Sheet>
  );
}
