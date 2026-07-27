import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Stepper } from "../components/onboarding/Stepper";
import { useAppData } from "../context/AppDataContext";
import { getDueDate } from "../utils/pregnancyCalculations";
import { generateShareCode } from "../utils/shareCode";
import { isPartnerSharingConfigured } from "../firebase";
import type { TrackingMode } from "../types";

export function SettingsPage() {
  const { data, saveSettings, resetAllData, stopSharing } = useAppData();
  const navigate = useNavigate();
  const settings = data.settings!;

  const [trackingMode, setTrackingMode] = useState<TrackingMode>(settings.trackingMode ?? "cycle");
  const [lastPeriodStart, setLastPeriodStart] = useState(settings.lastPeriodStart);
  const [periodLength, setPeriodLength] = useState(settings.averagePeriodLength);
  const [cycleLength, setCycleLength] = useState(settings.averageCycleLength);
  const [saved, setSaved] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPregnancy = trackingMode === "pregnancy";
  const sharing = settings.partnerSharing ?? { enabled: false, shareCode: "" };

  const handleToggleSharing = () => {
    if (sharing.enabled) {
      stopSharing(sharing.shareCode);
      saveSettings({ ...settings, partnerSharing: { ...sharing, enabled: false } });
    } else {
      const shareCode = sharing.shareCode || generateShareCode();
      saveSettings({ ...settings, partnerSharing: { enabled: true, shareCode } });
    }
  };

  const handleNewCode = () => {
    if (sharing.shareCode) stopSharing(sharing.shareCode);
    const shareCode = generateShareCode();
    saveSettings({ ...settings, partnerSharing: { enabled: true, shareCode } });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(sharing.shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the code is still visible on screen to copy by hand.
    }
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-800">Share with partner</h3>
              <p className="mt-0.5 text-sm text-neutral-500">
                Let someone see a live, read-only view of your data.
              </p>
            </div>
            <button
              type="button"
              disabled={!isPartnerSharingConfigured}
              onClick={handleToggleSharing}
              className={`h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-30 ${
                sharing.enabled ? "bg-bloom-500" : "bg-neutral-200"
              }`}
            >
              <span
                className={`block h-6 w-6 translate-x-0.5 rounded-full bg-white shadow transition-transform ${
                  sharing.enabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {!isPartnerSharingConfigured && (
            <p className="mt-3 text-sm text-amber-600">Partner sharing isn't configured for this deployment yet.</p>
          )}

          {isPartnerSharingConfigured && sharing.enabled && (
            <div className="mt-4 rounded-2xl bg-bloom-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Your share code</p>
              <p className="mt-1 text-2xl font-bold tracking-[0.2em] text-bloom-700">{sharing.shareCode}</p>
              <p className="mt-2 text-xs text-neutral-500">
                Send this to your partner — they'll enter it in their app to see your data live.
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <Button variant="secondary" className="!px-4 !py-2 !text-xs" onClick={handleCopyCode}>
                  {copied ? "Copied!" : "Copy code"}
                </Button>
                <Button variant="ghost" className="!px-4 !py-2 !text-xs" onClick={handleNewCode}>
                  Generate new code
                </Button>
              </div>
            </div>
          )}
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

        <Link to="/partner" className="block text-center text-sm font-medium text-bloom-600 underline">
          View a partner's shared data
        </Link>

        <p className="pb-2 text-center text-xs text-neutral-400">
          Bloom — Cycle Tracker ·{" "}
          {sharing.enabled ? "sharing is on — your data is visible to anyone with your code" : "your data stays on this device"}
        </p>
      </div>
    </div>
  );
}
