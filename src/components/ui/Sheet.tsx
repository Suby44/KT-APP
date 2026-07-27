import type { ReactNode } from "react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-bloom-100" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-bloom-700">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-bloom-50 text-bloom-600 hover:bg-bloom-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
