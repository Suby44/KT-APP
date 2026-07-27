import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Stepper } from "../components/onboarding/Stepper";
import { useAppData } from "../context/AppDataContext";
import { getDueDate } from "../utils/pregnancyCalculations";
import type { TrackingMode } from "../types";

export function SettingsPage() {
  const { data, saveSettings, resetAllData } = useAppData();
  const navigate = useNavigate();
  const settings = data.settings!;

  const [trackingMode, setTrackingMode] = useState<TrackingMode>(settings.trackingMode ?? "cycle");
  const [lastPeriodStart, setLastPeriodStart] = useState(settings.lastPeriodStart);
  const [periodLength, setPeriodLength] = useState(settings.averagePeriodLength);
  const [cycleLength, setCycleLength] = useState(settings.averageCycleLength);
  const [saved, setSaved] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const isPregnancy = trackingMode === "pregnancy";

  const handleSave = () => {
    saveSettings({
      lastPeriodStart,
      averagePeriodLength: periodLength,
      averageCycleLength: cycleLength,
      onboardingComplete: true,
      trackingMode,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetAllData();
    navigate("/onboarding", { replace: true });
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your cycle assumptions and data" />
      <div className="space-y-4 px-5">
        <Card>
          <h3 className="mb-3 font-semibold text-neutral-800">Tracking mode</h3>
          <div className="flex gap-2 rounded-2xl bg-bloom-50 p-1">
            {(["cycle", "pregnancy"] as TrackingMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTrackingMode(mode)}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
                  trackingMode === mode ? "bg-bloom-500 text-white" : "text-bloom-600"
                }`}
              >
                {mode === "cycle" ? "Cycle tracking" : "Pregnancy"}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-semibold text-neutral-800">
            {isPregnancy ? "First day of last period" : "Last period start"}
          </h3>
          <input
            type="date"
            value={lastPeriodStart}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setLastPeriodStart(e.target.value)}
            className="w-full rounded-2xl border border-bloom-200 bg-white px-4 py-3 text-neutral-800 focus:border-bloom-500 focus:outline-none"
          />
          {isPregnancy && lastPeriodStart && (
            <p className="mt-3 text-sm text-neutral-500">
              Estimated due date:{" "}
              <span className="font-semibold text-lavender-600">
                {format(getDueDate(parseISO(lastPeriodStart)), "MMMM d, yyyy")}
              </span>
            </p>
          )}
        </Card>

        {!isPregnancy && (
          <>
            <Card className="text-center">
              <h3 className="mb-3 font-semibold text-neutral-800">Average period length</h3>
              <Stepper value={periodLength} min={2} max={10} suffix="days" onChange={setPeriodLength} />
            </Card>

            <Card className="text-center">
              <h3 className="mb-3 font-semibold text-neutral-800">Average cycle length</h3>
              <Stepper value={cycleLength} min={21} max={40} suffix="days" onChange={setCycleLength} />
            </Card>
          </>
        )}

        <Button onClick={handleSave} className="w-full">
          {saved ? "Saved!" : "Save changes"}
        </Button>

        <Card>
          <h3 className="mb-2 font-semibold text-neutral-800">Reset data</h3>
          <p className="mb-3 text-sm text-neutral-500">
            This permanently deletes all logged days and cycle settings from this browser.
          </p>
          {confirmingReset ? (
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmingReset(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 !bg-red-500 hover:!bg-red-600"
                onClick={handleReset}
              >
                Confirm reset
              </Button>
            </div>
          ) : (
            <Button variant="secondary" className="w-full" onClick={() => setConfirmingReset(true)}>
              Reset all data
            </Button>
          )}
        </Card>

        <p className="pb-2 text-center text-xs text-neutral-400">Bloom — Cycle Tracker · your data stays on this device</p>
      </div>
    </div>
  );
}
