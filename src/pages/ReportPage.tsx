import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Button } from "../components/ui/Button";
import { useAppData } from "../context/AppDataContext";
import { average, getCycleHistory } from "../utils/cycleCalculations";
import { getDaysUntilDueDate, getDueDate, getPregnancyProgress, getTrimester } from "../utils/pregnancyCalculations";
import { SYMPTOM_LABELS, type Symptom } from "../types";

export function ReportPage() {
  const { data } = useAppData();
  const navigate = useNavigate();
  const settings = data.settings!;
  const isPregnancy = (settings.trackingMode ?? "cycle") === "pregnancy";
  const today = new Date();

  const history = useMemo(() => getCycleHistory(data.logs), [data.logs]);
  const observedCycleLengths = history.map((e) => e.cycleLength).filter((n): n is number => n !== null);
  const observedPeriodLengths = history.map((e) => e.periodLength);
  const avgCycle = observedCycleLengths.length > 0 ? average(observedCycleLengths) : settings.averageCycleLength;
  const avgPeriod = observedPeriodLengths.length > 0 ? average(observedPeriodLengths) : settings.averagePeriodLength;

  const symptomCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(data.logs).forEach((log) => {
      log.symptoms.forEach((s: Symptom) => {
        counts[s] = (counts[s] ?? 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([symptom, count]) => ({ label: SYMPTOM_LABELS[symptom as Symptom], count }))
      .sort((a, b) => b.count - a.count);
  }, [data.logs]);

  const notesLog = useMemo(
    () =>
      Object.values(data.logs)
        .filter((log) => log.notes && log.notes.trim().length > 0)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [data.logs]
  );

  const lmp = parseISO(settings.lastPeriodStart);
  const dueDate = getDueDate(lmp);
  const { week } = getPregnancyProgress(lmp, today);
  const trimester = getTrimester(week);
  const daysUntilDue = getDaysUntilDueDate(dueDate, today);

  return (
    <div className="mx-auto max-w-2xl bg-white px-6 py-8 text-neutral-800 print:px-0">
      <div className="no-print mb-6 flex items-center justify-between">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-medium text-bloom-600">
          ← Back
        </button>
        <Button onClick={() => window.print()}>Print / Save as PDF</Button>
      </div>

      <header className="mb-6 border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-bold">Bloom Cycle Report</h1>
        <p className="mt-1 text-sm text-neutral-500">Generated {format(today, "MMMM d, yyyy")}</p>
        <p className="text-sm text-neutral-500">
          Tracking mode: {isPregnancy ? "Pregnancy" : "Cycle tracking"}
        </p>
      </header>

      {isPregnancy ? (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Pregnancy summary</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <ReportStat label="Current week" value={`${week}`} />
            <ReportStat label="Trimester" value={`${trimester}`} />
            <ReportStat
              label="Due date"
              value={format(dueDate, "MMM d, yyyy")}
              sub={daysUntilDue > 0 ? `in ${daysUntilDue} days` : "any day now"}
            />
          </div>
        </section>
      ) : (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Cycle summary</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <ReportStat label="Avg. cycle length" value={`${Math.round(avgCycle)} days`} />
            <ReportStat label="Avg. period length" value={`${Math.round(avgPeriod)} days`} />
            <ReportStat label="Periods logged" value={`${history.length}`} />
          </div>
        </section>
      )}

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Period history</h2>
        {history.length === 0 ? (
          <p className="text-sm text-neutral-500">No periods logged yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="py-1 pr-2 font-medium">Start date</th>
                <th className="py-1 pr-2 font-medium">Period length</th>
                <th className="py-1 font-medium">Cycle length</th>
              </tr>
            </thead>
            <tbody>
              {history
                .slice()
                .reverse()
                .map((entry) => (
                  <tr key={entry.startDate} className="border-b border-neutral-100">
                    <td className="py-1 pr-2">{format(parseISO(entry.startDate), "MMM d, yyyy")}</td>
                    <td className="py-1 pr-2">{entry.periodLength} days</td>
                    <td className="py-1">{entry.cycleLength !== null ? `${entry.cycleLength} days` : "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Symptom frequency</h2>
        {symptomCounts.length === 0 ? (
          <p className="text-sm text-neutral-500">No symptoms logged yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <tbody>
              {symptomCounts.map((row) => (
                <tr key={row.label} className="border-b border-neutral-100">
                  <td className="py-1 pr-2">{row.label}</td>
                  <td className="py-1 text-right text-neutral-500">{row.count}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Notes</h2>
        {notesLog.length === 0 ? (
          <p className="text-sm text-neutral-500">No notes logged yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {notesLog.map((log) => (
              <li key={log.date}>
                <span className="font-medium text-neutral-700">{format(parseISO(log.date), "MMM d, yyyy")}:</span>{" "}
                <span className="text-neutral-600">{log.notes}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ReportStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-3">
      <p className="text-lg font-bold text-bloom-600">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
      {sub && <p className="text-xs text-neutral-400">{sub}</p>}
    </div>
  );
}
