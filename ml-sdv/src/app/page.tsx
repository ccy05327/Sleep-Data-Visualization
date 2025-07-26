// In /src/app/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// --- Type Definitions ---
interface SleepRecord {
  id: number;
  start_time: string;
  end_time: string;
  sleep_duration: number | null;
}

interface Prediction {
  id: number; // ID is now required for feedback
  predicted_for_date: string;
  predicted_start_time: string;
  predicted_end_time: string;
  timezone: string;
  feedback: "accurate" | "inaccurate" | null;
}

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

      // Fetch existing predictions to show history
      const { data: predictionData } = await supabase
        .from("predictions")
        .select("*");
      setPredictions(predictionData || []);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // --- Handlers ---
  const handlePrediction = async () => {
    setIsPredicting(true);
    setPredictions([]);

    try {
      const response = await fetch("/api/predict", {
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

      // To get the ID for the feedback buttons, we need to fetch the prediction we just created.
      const { data: newPrediction, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("predicted_start_time", data.predictions[0].predicted_start_time)
        .single();

      if (error)
        throw new Error("Could not retrieve new prediction from database.");

      if (newPrediction) {
        setPredictions([newPrediction]);
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
    // Optimistic UI update: show the change immediately
    setPredictions((currentPredictions) =>
      currentPredictions.map((p) =>
        p.id === predictionId ? { ...p, feedback: feedback } : p
      )
    );

    // Call the API to save the change to the database
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        predictionId: predictionId,
        feedback: feedback,
      }),
    });
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
          <section className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd]">
            <h2 className="text-2xl font-semibold mb-6 text-[#e0e1dd]">
              Controls
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="prediction-date"
                  className="block text-sm font-medium text-[#e0e1dd] mb-1"
                >
                  Select Date for Prediction
                </label>
                <input
                  type="date"
                  id="prediction-date"
                  value={predictionDate}
                  onChange={(e) => setPredictionDate(e.target.value)}
                  className="w-full p-2 border border-[#e0e1dd] rounded-md shadow-sm bg-[#1b263b] text-[#e0e1dd] focus:ring-[#778da9] focus:border-[#778da9]"
                />
              </div>
              <button
                onClick={handlePrediction}
                disabled={isPredicting}
                className="w-full bg-[#415a77] text-[#e0e1dd] font-bold py-3 px-4 rounded-lg hover:bg-[#778da9] transition duration-300 disabled:bg-gray-600"
              >
                {isPredicting ? "Predicting..." : "Predict Sleep"}
              </button>
            </div>
          </section>

          <section className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd]">
            <h2 className="text-2xl font-semibold mb-4 text-[#e0e1dd]">
              Prediction
            </h2>
            <div className="bg-[#0d1b2a] p-6 rounded-lg min-h-[120px] flex items-center justify-center border border-[#e0e1dd]">
              {isPredicting ? (
                <div className="text-[#e0e1dd]">Generating prediction...</div>
              ) : predictions.length > 0 ? (
                <ul className="space-y-4 w-full">
                  {predictions.map((pred) => (
                    <li
                      key={pred.id}
                      className="p-4 bg-[#1b263b] rounded-lg shadow-sm border border-[#415a77]"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-[#e0e1dd] text-lg">
                            {formatTime(
                              pred.predicted_start_time,
                              userTimezone
                            )}{" "}
                            -{" "}
                            {formatTime(pred.predicted_end_time, userTimezone)}
                          </p>
                          <p className="text-sm text-[#adb5bd]">
                            Predicted Duration:{" "}
                            {formatDuration(
                              pred.predicted_start_time,
                              pred.predicted_end_time
                            )}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFeedback(pred.id, "accurate")}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                              pred.feedback === "accurate"
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-[#415a77] text-white border-[#778da9] hover:bg-[#778da9]"
                            }`}
                          >
                            Accurate
                          </button>
                          <button
                            onClick={() =>
                              handleFeedback(pred.id, "inaccurate")
                            }
                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                              pred.feedback === "inaccurate"
                                ? "bg-red-500 text-white border-red-500"
                                : "bg-[#415a77] text-white border-[#778da9] hover:bg-[#778da9]"
                            }`}
                          >
                            Inaccurate
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#e0e1dd]">Predictions will appear here.</p>
              )}
            </div>
          </section>

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
        </main>
      </div>
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
