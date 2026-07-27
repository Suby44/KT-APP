const TOTAL_WEEKS = 40;

interface PregnancyWheelProps {
  week: number;
  trimester: 1 | 2 | 3;
}

const TRIMESTER_COLORS: Record<1 | 2 | 3, string> = {
  1: "#f2789f",
  2: "#9877df",
  3: "#6544ab",
};

const TRIMESTER_LABELS: Record<1 | 2 | 3, string> = {
  1: "First trimester",
  2: "Second trimester",
  3: "Third trimester",
};

export function PregnancyWheel({ week, trimester }: PregnancyWheelProps) {
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(week / TOTAL_WEEKS, 1);
  const offset = circumference * (1 - progress);
  const color = TRIMESTER_COLORS[trimester];

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f6f4fd" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-neutral-800">Week {week}</span>
        <span className="mt-1 text-sm font-medium" style={{ color }}>
          {TRIMESTER_LABELS[trimester]}
        </span>
      </div>
    </div>
  );
}
