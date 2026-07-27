import { format, parseISO } from "date-fns";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../ui/Card";
import type { CycleHistoryEntry } from "../../utils/cycleCalculations";

interface CycleLengthChartProps {
  history: CycleHistoryEntry[];
}

export function CycleLengthChart({ history }: CycleLengthChartProps) {
  const data = history
    .filter((entry) => entry.cycleLength !== null)
    .map((entry) => ({
      label: format(parseISO(entry.startDate), "MMM d"),
      length: entry.cycleLength as number,
    }));

  return (
    <Card>
      <h3 className="mb-4 font-semibold text-neutral-800">Cycle length history</h3>
      {data.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Log at least two periods to see how your cycle length changes over time.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fde7ee" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #fde7ee", fontSize: 12 }}
              cursor={{ fill: "#fff5f7" }}
            />
            <Bar dataKey="length" name="Cycle length (days)" fill="#f2789f" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
