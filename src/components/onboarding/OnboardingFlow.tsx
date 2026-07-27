import { useState } from "react";
import { format } from "date-fns";
import { Button } from "../ui/Button";
import { Stepper } from "./Stepper";
import type { Settings } from "../../types";

interface OnboardingFlowProps {
  onComplete: (settings: Settings) => void;
}

const TOTAL_STEPS = 4;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [lastPeriodStart, setLastPeriodStart] = useState(format(new Date(), "yyyy-MM-dd"));
  const [periodLength, setPeriodLength] = useState(5);
  const [cycleLength, setCycleLength] = useState(28);

  const next = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    onComplete({
      lastPeriodStart,
      averagePeriodLength: periodLength,
      averageCycleLength: cycleLength,
      onboardingComplete: true,
    });
  };

  return (
    <div className="flex min-h-svh flex-col justify-between bg-cream-50 px-6 py-10">
      <div>
        <div className="mb-8 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-bloom-500" : "bg-bloom-100"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="text-center">
            <div className="mb-4 text-6xl">🌸</div>
            <h1 className="text-2xl font-bold text-neutral-800">Welcome to Bloom</h1>
            <p className="mt-3 text-neutral-500">
              Track your cycle, understand your body, and get personalized predictions. Let's set
              things up — it only takes a minute.
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-neutral-800">
              When did your last period start?
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              This helps Bloom predict your next cycle.
            </p>
            <input
              type="date"
              value={lastPeriodStart}
              max={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => setLastPeriodStart(e.target.value)}
              className="mt-6 w-full rounded-2xl border border-bloom-200 bg-white px-4 py-3 text-lg text-neutral-800 focus:border-bloom-500 focus:outline-none"
            />
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-neutral-800">
              How many days does your period usually last?
            </h2>
            <div className="mt-8">
              <Stepper value={periodLength} min={2} max={10} suffix="days" onChange={setPeriodLength} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-neutral-800">
              How long is your average cycle?
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              From the first day of one period to the first day of the next.
            </p>
            <div className="mt-8">
              <Stepper value={cycleLength} min={21} max={40} suffix="days" onChange={setCycleLength} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={back} className="flex-1">
            Back
          </Button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <Button onClick={next} className="flex-1">
            Continue
          </Button>
        ) : (
          <Button onClick={finish} className="flex-1">
            Get started
          </Button>
        )}
      </div>
    </div>
  );
}
