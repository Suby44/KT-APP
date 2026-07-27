import type { CyclePhase } from "../../types";

interface CycleWheelProps {
  cycleDay: number;
  cycleLength: number;
  phase: CyclePhase;
}

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#c9457a",
  follicular: "#f2789f",
  ovulation: "#6544ab",
  luteal: "#9877df",
};

const PHASE_SHORT: Record<CyclePhase, string> = {
  menstrual: "Period",
  follicular: "Follicular",
  ovulation: "Fertile",
  luteal: "Luteal",
};

export function CycleWheel({ cycleDay, cycleLength, phase }: CycleWheelProps) {
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(cycleDay / cycleLength, 1);
  const offset = circumference * (1 - progress);
  const color = PHASE_COLORS[phase];

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#fde7ee" strokeWidth={strokeWidth} fill="none" />
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
        <span className="text-4xl font-bold text-neutral-800">Day {cycleDay}</span>
        <span className="mt-1 text-sm font-medium" style={{ color }}>
          {PHASE_SHORT[phase]}
        </span>
      </div>
    </div>
  );
}
