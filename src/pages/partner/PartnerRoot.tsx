import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import type { NavTab } from "../../components/layout/BottomNav";
import { PartnerViewProvider } from "../../context/PartnerViewContext";
import { usePartnerData } from "../../hooks/usePartnerData";
import { clearPartnerCode, getSavedPartnerCode, savePartnerCode } from "../../utils/partnerLink";
import { PartnerLinkPage } from "./PartnerLinkPage";
import { PartnerStatusScreen } from "./PartnerStatusScreen";
import { PartnerTodayPage } from "./PartnerTodayPage";
import { PartnerCalendarPage } from "./PartnerCalendarPage";
import { PartnerInsightsPage } from "./PartnerInsightsPage";

const partnerTabs: NavTab[] = [
  { to: "/partner", label: "Today", icon: "🌸", end: true },
  { to: "/partner/calendar", label: "Calendar", icon: "📅", end: false },
  { to: "/partner/insights", label: "Insights", icon: "📊", end: false },
];

export function PartnerRoot() {
  const [code, setCode] = useState<string | null>(() => getSavedPartnerCode());
  const { data, loading, error } = usePartnerData(code);

  const unlink = () => {
    clearPartnerCode();
    setCode(null);
  };

  if (!code) {
    return (
      <PartnerLinkPage
        onLink={(enteredCode) => {
          savePartnerCode(enteredCode);
          setCode(enteredCode);
        }}
      />
    );
  }

  if (loading || error || !data?.settings) {
    return <PartnerStatusScreen message={loading ? "Connecting…" : (error ?? "No data yet.")} onUnlink={unlink} />;
  }

  return (
    <PartnerViewProvider data={data} unlink={unlink}>
      <AppShell tabs={partnerTabs}>
        <Routes>
          <Route index element={<PartnerTodayPage />} />
          <Route path="calendar" element={<PartnerCalendarPage />} />
          <Route path="insights" element={<PartnerInsightsPage />} />
          <Route path="*" element={<Navigate to="/partner" replace />} />
        </Routes>
      </AppShell>
    </PartnerViewProvider>
  );
}
