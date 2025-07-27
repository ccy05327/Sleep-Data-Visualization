// In /src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Controls from "./components/Controls";
import PredictionSection from "./components/PredictionSection";
import AccuracyScore from "./components/AccuracyScore";
import HistoricalSleepData from "./components/HistoricalSleepData";
import AddSleepModal from "./components/AddSleepModal";
import MLTraining from "./components/MLTraining";
import DataDebugger from "./components/DataDebugger";

// --- Type Definitions ---
export type SleepRecord = {
  id: number;
  start_time: string;
  end_time: string;
  sleep_duration: number | null;
};

export type Prediction = {
  id: number;
  predicted_for_date: string;
  predicted_start_time: string;
  predicted_end_time: string;
  timezone: string;
  feedback: "accurate" | "inaccurate" | null;
};

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or anonymous key is not set in environment variables."
  );
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Helper Functions ---
const formatTime = (dateStr: string, timeZone: string) => {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: timeZone,
  });
};

const formatDuration = (startStr: string, endStr: string) => {
  const durationMs = new Date(endStr).getTime() - new Date(startStr).getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

// --- Main Page Component ---
export default function HomePage() {
  // --- State Management ---
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  const [userTimezone, setUserTimezone] = useState("UTC");
  const [predictionDate, setPredictionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // --- NEW --- State for accuracy score
  const [accuracy, setAccuracy] = useState({ score: 0, total: 0 });

  // --- NEW --- State for manual entry form
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- NEW --- State for AddSleepModal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(detectedTimezone);

    const fetchData = async () => {
      setIsLoading(true);
      const { data: sleepData } = await supabase
        .from("sleep_records")
        .select("*")
        .order("start_time", { ascending: true });
      setSleepRecords(sleepData || []);

      const { data: predictionData } = await supabase
        .from("predictions")
        .select("*");
      setPredictions(predictionData || []);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // --- NEW --- Effect to calculate accuracy whenever predictions change
  useEffect(() => {
    const feedbackPredictions = predictions.filter((p) => p.feedback !== null);
    if (feedbackPredictions.length > 0) {
      const accurateCount = feedbackPredictions.filter(
        (p) => p.feedback === "accurate"
      ).length;
      const score = Math.round(
        (accurateCount / feedbackPredictions.length) * 100
      );
      setAccuracy({ score: score, total: feedbackPredictions.length });
    } else {
      setAccuracy({ score: 0, total: 0 });
    }
  }, [predictions]);

  // --- Handlers ---
  const handlePrediction = async () => {
    setIsPredicting(true);
    // Do not clear all predictions, just the one for the target date if it exists
    setPredictions((preds) =>
      preds.filter((p) => p.predicted_for_date !== predictionDate)
    );

    try {
      const response = await fetch("/api/predict-enhanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: predictionDate,
          timezone: userTimezone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch prediction.");
      }

      const data = await response.json();

      const { data: newPrediction, error } = await supabase
        .from("predictions")
        .select("*")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (error)
        throw new Error("Could not retrieve new prediction from database.");

      if (newPrediction) {
        // Add new prediction to the existing list
        setPredictions((preds) => [...preds, newPrediction]);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      alert((error as Error).message);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleFeedback = async (
    predictionId: number,
    feedback: "accurate" | "inaccurate"
  ) => {
    setPredictions((currentPredictions) =>
      currentPredictions.map((p) =>
        p.id === predictionId ? { ...p, feedback: feedback } : p
      )
    );

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        predictionId: predictionId,
        feedback: feedback,
      }),
    });
  };

  // --- NEW --- Handler to fetch data
  const fetchData = async () => {
    setIsLoading(true);
    const { data: sleepData } = await supabase
      .from("sleep_records")
      .select("*")
      .order("start_time", { ascending: true });
    setSleepRecords(sleepData || []);

    const { data: predictionData } = await supabase
      .from("predictions")
      .select("*");
    setPredictions(predictionData || []);

    setIsLoading(false);
  };

  return (
    <div className="bg-[#1b263b] text-[#e0e1dd] min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#e0e1dd]">
            Sleep Pattern Predictor
          </h1>
          <p className="text-[#e0e1dd] mt-2">
            Visualize your sleep patterns and predict your future sleep.
          </p>
        </header>

        <main className="max-w-4xl mx-auto space-y-8">
          <Controls
            predictionDate={predictionDate}
            setPredictionDate={setPredictionDate}
            handlePrediction={handlePrediction}
            isPredicting={isPredicting}
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#415a77] text-[#e0e1dd] font-bold py-3 px-4 rounded-lg hover:bg-[#778da9] transition duration-300"
          >
            Add Sleep Record
          </button>

          <PredictionSection
            predictions={predictions}
            predictionDate={predictionDate}
            userTimezone={userTimezone}
            isPredicting={isPredicting}
            handleFeedback={handleFeedback}
          />

          <AccuracyScore accuracy={accuracy} />

          <MLTraining userTimezone={userTimezone} />

          <DataDebugger userTimezone={userTimezone} />

          <HistoricalSleepData
            isLoading={isLoading}
            currentDisplayDate={currentDisplayDate}
            setCurrentDisplayDate={setCurrentDisplayDate}
            sleepRecords={sleepRecords}
            userTimezone={userTimezone}
          />
        </main>
      </div>

      <AddSleepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchData}
        setIsSubmitting={setIsSubmitting}
        startTime={startTime} // Pass startTime state
        setStartTime={setStartTime} // Pass setStartTime state
        endTime={endTime} // Pass endTime state
        setEndTime={setEndTime} // Pass setEndTime state
        errorMessage={errorMessage} // Pass errorMessage state
        setErrorMessage={setErrorMessage} // Pass setErrorMessage state
        userTimezone={userTimezone} // Pass userTimezone state
        isSubmitting={isSubmitting} // Pass isSubmitting state
      />
    </div>
  );
}

// --- Calendar Component ---
interface CalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  sleepData: SleepRecord[];
  timezone: string;
}

const CalendarView = ({
  date,
  setDate,
  sleepData,
  timezone,
}: CalendarProps) => {
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
                      title={`${formatTime(
                        sleep.start_time,
                        timezone
                      )} - ${formatTime(sleep.end_time, timezone)}`}
                    >
                      {formatTime(sleep.start_time, timezone)}
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
