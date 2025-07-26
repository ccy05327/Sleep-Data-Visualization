import React from "react";
import CalendarView from "../components/CalendarView";
import { SleepRecord } from "../page";

interface HistoricalSleepDataProps {
  isLoading: boolean;
  currentDisplayDate: Date;
  setCurrentDisplayDate: (date: Date) => void;
  sleepRecords: SleepRecord[];
  userTimezone: string;
}

const HistoricalSleepData: React.FC<HistoricalSleepDataProps> = ({
  isLoading,
  currentDisplayDate,
  setCurrentDisplayDate,
  sleepRecords,
  userTimezone,
}) => {
  return (
    <section className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd]">
      <h2 className="text-2xl font-semibold mb-4 text-[#e0e1dd]">
        Historical Sleep Data
      </h2>
      {isLoading ? (
        <div className="text-center text-[#e0e1dd] py-10">
          Loading sleep data...
        </div>
      ) : (
        <CalendarView
          date={currentDisplayDate}
          setDate={setCurrentDisplayDate}
          sleepData={sleepRecords}
          timezone={userTimezone}
        />
      )}
    </section>
  );
};

export default HistoricalSleepData;
