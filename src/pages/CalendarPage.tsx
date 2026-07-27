import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import { LogSheet } from "../components/logging/LogSheet";
import { useAppData } from "../context/AppDataContext";

export function CalendarPage() {
  const { data, upsertLog } = useAppData();
  const [month, setMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const settings = data.settings!;

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Tap any day to log or review" />
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
        <LogSheet
          open={Boolean(selectedDateKey)}
          onClose={() => setSelectedDateKey(null)}
          dateKey={selectedDateKey}
          existingLog={data.logs[selectedDateKey]}
          onSave={upsertLog}
        />
      )}
    </div>
  );
}
