import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { AppDataProvider, useAppData } from "./context/AppDataContext";
import { AppShell } from "./components/layout/AppShell";
import { OnboardingPage } from "./pages/OnboardingPage";
import { TodayPage } from "./pages/TodayPage";
import { CalendarPage } from "./pages/CalendarPage";
import { InsightsPage } from "./pages/InsightsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ReportPage } from "./pages/ReportPage";
import { PartnerRoot } from "./pages/partner/PartnerRoot";

function AppRoutes() {
  const { data } = useAppData();
  const isOnboarded = Boolean(data.settings?.onboardingComplete);

  if (!isOnboarded) {
    return (
      <Routes>
        <Route path="/partner/*" element={<PartnerRoot />} />
        <Route path="*" element={<OnboardingPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/partner/*" element={<PartnerRoot />} />
      <Route path="/report" element={<ReportPage />} />
      <Route
        path="/*"
        element={
          <AppShell>
            <Routes>
              <Route index element={<TodayPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="onboarding" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        }
      />
    </Routes>
  );
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
    </AppDataProvider>
  );
}

export default App;
