import type { ReactNode } from "react";
import { BottomNav, type NavTab } from "./BottomNav";

export function AppShell({ children, tabs }: { children: ReactNode; tabs?: NavTab[] }) {
  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-cream-50 shadow-xl">
      <div className="flex-1 pb-6">{children}</div>
      <BottomNav tabs={tabs} />
    </div>
  );
}
