import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { StatsSummary } from "../components/insights/StatsSummary";
import { CycleLengthChart } from "../components/insights/CycleLengthChart";
import { SymptomFrequencyChart } from "../components/insights/SymptomFrequencyChart";
import { Button } from "../components/ui/Button";
import { useAppData } from "../context/AppDataContext";
import { average, getCycleHistory } from "../utils/cycleCalculations";

export function InsightsPage() {
  const { data } = useAppData();
  const navigate = useNavigate();
  const settings = data.settings!;

  const history = useMemo(() => getCycleHistory(data.logs), [data.logs]);

  const observedCycleLengths = history
    .map((entry) => entry.cycleLength)
    .filter((n): n is number => n !== null);
  const observedPeriodLengths = history.map((entry) => entry.periodLength);

  const avgCycle = observedCycleLengths.length > 0 ? average(observedCycleLengths) : settings.averageCycleLength;
  const avgPeriod = observedPeriodLengths.length > 0 ? average(observedPeriodLengths) : settings.averagePeriodLength;

  return (
    <div>
      <PageHeader title="Insights" subtitle="Patterns from your logged cycles" />
      <div className="space-y-4 px-5">
        <StatsSummary
          averageCycleLength={avgCycle}
          averagePeriodLength={avgPeriod}
          periodsLogged={history.length}
        />
        <CycleLengthChart history={history} />
        <SymptomFrequencyChart logs={data.logs} />
        <Button variant="secondary" className="w-full" onClick={() => navigate("/report")}>
          Export report for your doctor
        </Button>
      </div>
    </div>
  );
}
