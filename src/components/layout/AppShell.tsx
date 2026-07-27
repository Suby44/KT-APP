import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-cream-50 shadow-xl">
      <div className="flex-1 pb-6">{children}</div>
      <BottomNav />
    </div>
  );
}
