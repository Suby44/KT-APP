import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../ui/Card";
import { SYMPTOM_LABELS, type DayLog, type Symptom } from "../../types";

interface SymptomFrequencyChartProps {
  logs: Record<string, DayLog>;
}

export function SymptomFrequencyChart({ logs }: SymptomFrequencyChartProps) {
  const counts: Record<string, number> = {};
  Object.values(logs).forEach((log) => {
    log.symptoms.forEach((symptom: Symptom) => {
      counts[symptom] = (counts[symptom] ?? 0) + 1;
    });
  });

  const data = Object.entries(counts)
    .map(([symptom, count]) => ({ label: SYMPTOM_LABELS[symptom as Symptom], count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <Card>
      <h3 className="mb-4 font-semibold text-neutral-800">Most common symptoms</h3>
      {data.length === 0 ? (
        <p className="text-sm text-neutral-400">Log symptoms on the Today or Calendar tab to see trends here.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ece7fb" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 12, fill: "#525252" }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #ece7fb", fontSize: 12 }}
              cursor={{ fill: "#f6f4fd" }}
            />
            <Bar dataKey="count" fill="#9877df" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
