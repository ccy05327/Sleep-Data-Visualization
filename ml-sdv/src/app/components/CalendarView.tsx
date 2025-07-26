import React, { useMemo } from "react";
import { SleepRecord } from "../page";

interface CalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  sleepData: SleepRecord[];
  timezone: string;
}

const CalendarView: React.FC<CalendarProps> = ({
  date,
  setDate,
  sleepData,
  timezone,
}) => {
  const monthYear = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: timezone,
  });

  const calendarDays = useMemo(() => {
    const localDate = new Date(
      date.toLocaleString("en-US", { timeZone: timezone })
    );
    const year = localDate.getFullYear();
    const month = localDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const days: {
      type: "blank" | "day";
      number?: number;
      sleeps?: SleepRecord[];
    }[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ type: "blank" });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDateStr = new Date(year, month, i).toLocaleDateString(
        "en-US",
        { timeZone: timezone }
      );

      const daySleeps = sleepData.filter((d) => {
        const sleepStartDate = new Date(d.start_time);
        return (
          sleepStartDate.toLocaleDateString("en-US", { timeZone: timezone }) ===
          currentDateStr
        );
      });

      days.push({ type: "day", number: i, sleeps: daySleeps });
    }
    return days;
  }, [date, sleepData, timezone]);

  const changeMonth = (delta: number) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + delta);
    setDate(newDate);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-full hover:bg-[#415a77] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-xl font-semibold">{monthYear}</h3>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 rounded-full hover:bg-[#415a77] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="font-semibold text-center text-sm text-[#778da9] py-2"
          >
            {day}
          </div>
        ))}
        {calendarDays.map((day, i) => (
          <div
            key={i}
            className={`rounded-lg p-1 min-h-[90px] ${
              day.type === "day" ? "bg-[#0d1b2a]" : ""
            }`}
          >
            {day.type === "day" && (
              <>
                <div className="text-xs text-center text-[#778da9] font-medium">
                  {day.number}
                </div>
                <div className="space-y-1 mt-1">
                  {day.sleeps?.map((sleep) => (
                    <div
                      key={sleep.id}
                      className="bg-[#415a77] text-white rounded text-[10px] p-1 text-center leading-tight"
                      title={`${new Date(sleep.start_time).toLocaleTimeString(
                        "en-US",
                        { timeZone: timezone }
                      )} - ${new Date(sleep.end_time).toLocaleTimeString(
                        "en-US",
                        { timeZone: timezone }
                      )}`}
                    >
                      {new Date(sleep.start_time).toLocaleTimeString("en-US", {
                        timeZone: timezone,
                      })}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
