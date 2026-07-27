import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function Chip({ children, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        selected
          ? "border-bloom-500 bg-bloom-500 text-white"
          : "border-bloom-100 bg-bloom-50 text-bloom-700 hover:border-bloom-300"
      }`}
    >
      {children}
    </button>
  );
}
