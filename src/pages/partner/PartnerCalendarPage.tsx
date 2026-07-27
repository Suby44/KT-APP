import { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { MonthCalendar } from "../../components/calendar/MonthCalendar";
import { PartnerBanner } from "../../components/partner/PartnerBanner";
import { PartnerDayDetailSheet } from "../../components/partner/PartnerDayDetailSheet";
import { usePartnerView } from "../../context/PartnerViewContext";

export function PartnerCalendarPage() {
  const { data } = usePartnerView();
  const [month, setMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const settings = data.settings!;

  return (
    <div>
      <PartnerBanner />
      <PageHeader title="Calendar" subtitle="Tap any day to review" />
      <div className="px-5">
        <Card>
          <MonthCalendar
            month={month}
            onMonthChange={setMonth}
            settings={settings}
            logs={data.logs}
            onSelectDay={setSelectedDateKey}
          />
        </Card>
      </div>

      {selectedDateKey && (
        <PartnerDayDetailSheet
          open={Boolean(selectedDateKey)}
          onClose={() => setSelectedDateKey(null)}
          dateKey={selectedDateKey}
          log={data.logs[selectedDateKey]}
        />
      )}
    </div>
  );
}
