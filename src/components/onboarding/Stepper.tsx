interface StepperProps {
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}

export function Stepper({ value, min, max, suffix, onChange }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-bloom-100 text-xl font-bold text-bloom-600 disabled:opacity-30"
      >
        −
      </button>
      <div className="min-w-[110px] text-center">
        <div className="text-4xl font-bold text-neutral-800">{value}</div>
        <div className="text-sm text-neutral-500">{suffix}</div>
      </div>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-bloom-100 text-xl font-bold text-bloom-600 disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
