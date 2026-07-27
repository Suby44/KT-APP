import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AppData } from "../types";

interface PartnerViewContextValue {
  data: AppData;
  unlink: () => void;
}

const PartnerViewContext = createContext<PartnerViewContextValue | null>(null);

export function PartnerViewProvider({
  data,
  unlink,
  children,
}: {
  data: AppData;
  unlink: () => void;
  children: ReactNode;
}) {
  return <PartnerViewContext.Provider value={{ data, unlink }}>{children}</PartnerViewContext.Provider>;
}

export function usePartnerView(): PartnerViewContextValue {
  const ctx = useContext(PartnerViewContext);
  if (!ctx) throw new Error("usePartnerView must be used within a PartnerViewProvider");
  return ctx;
}
