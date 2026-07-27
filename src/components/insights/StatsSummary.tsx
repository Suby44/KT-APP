import { Card } from "../ui/Card";

interface StatsSummaryProps {
  averageCycleLength: number;
  averagePeriodLength: number;
  periodsLogged: number;
}

export function StatsSummary({ averageCycleLength, averagePeriodLength, periodsLogged }: StatsSummaryProps) {
  const stats = [
    { label: "Avg. cycle", value: `${Math.round(averageCycleLength)}d` },
    { label: "Avg. period", value: `${Math.round(averagePeriodLength)}d` },
    { label: "Periods logged", value: periodsLogged },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="!p-4 text-center">
          <p className="text-xl font-bold text-bloom-600">{stat.value}</p>
          <p className="mt-1 text-xs text-neutral-500">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
