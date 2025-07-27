import React, { useState } from "react";

interface ManualSleepEntryProps {
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  userTimezone: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>; // Add onSave prop
}

const ManualSleepEntry: React.FC<ManualSleepEntryProps> = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isSubmitting,
  setIsSubmitting,
  errorMessage,
  setErrorMessage,
  userTimezone,
  isOpen,
  onClose,
  onSave,
}) => {
  const [sleepScore, setSleepScore] = useState<number | "">("");
  const [mentalRecovery, setMentalRecovery] = useState<number | "">("");
  const [physicalRecovery, setPhysicalRecovery] = useState<number | "">("");
  const [sleepCycles, setSleepCycles] = useState<number | "">("");
  const [isMetricsVisible, setIsMetricsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const calculateSleepDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = endDate.getTime() - startDate.getTime();
    return Math.max(0, Math.floor(duration / 1000 / 60)); // Duration in minutes
  };

  const convertToUTC = (localTime: string): string => {
    const date = new Date(localTime);
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/add-sleep-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_time: convertToUTC(startTime),
          end_time: convertToUTC(endTime),
          sleep_duration: calculateSleepDuration(startTime, endTime),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add sleep record.");
      }

      alert("Record added successfully!");
      await onSave(); // Call onSave prop
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndClose = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
    onClose();
  };

  const handleSaveAndAddAnother = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
    setStartTime(endTime);
    setEndTime("");
    setSleepScore("");
    setMentalRecovery("");
    setPhysicalRecovery("");
    setSleepCycles("");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <section
        className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-[#e0e1dd]">
          Manual Sleep Entry
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="start-time"
              className="block text-sm font-medium text-[#e0e1dd] mb-1"
            >
              Start Time
            </label>
            <input
              type="datetime-local"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-[#e0e1dd] rounded-md shadow-sm bg-[#1b263b] text-[#e0e1dd] focus:ring-[#778da9] focus:border-[#778da9]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="end-time"
              className="block text-sm font-medium text-[#e0e1dd] mb-1"
            >
              End Time
            </label>
            <input
              type="datetime-local"
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border border-[#e0e1dd] rounded-md shadow-sm bg-[#1b263b] text-[#e0e1dd] focus:ring-[#778da9] focus:border-[#778da9]"
              required
            />
          </div>
          <button
            type="button"
            onClick={() => setIsMetricsVisible(!isMetricsVisible)}
            className="w-full bg-[#778da9] text-[#e0e1dd] font-bold py-2 px-4 rounded-lg hover:bg-[#415a77] transition duration-300"
          >
            {isMetricsVisible
              ? "Hide Sleep Quality Metrics"
              : "Add Sleep Quality Metrics"}
          </button>
          {isMetricsVisible && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="sleep-score"
                  className="block text-sm font-medium text-[#e0e1dd] mb-1"
                >
                  Sleep Score
                </label>
                <input
                  type="number"
                  id="sleep-score"
                  value={sleepScore}
                  onChange={(e) =>
                    setSleepScore(
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  className="w-full p-2 border border-[#e0e1dd] rounded-md shadow-sm bg-[#1b263b] text-[#e0e1dd] focus:ring-[#778da9] focus:border-[#778da9]"
                />
              </div>
              <div>
                <label
                  htmlFor="mental-recovery"
                  className="block text-sm font-medium text-[#e0e1dd] mb-1"
                >
                  Mental Recovery
                </label>
                <input
                  type="number"
                  id="mental-recovery"
                  value={mentalRecovery}
                  onChange={(e) =>
                    setMentalRecovery(
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  className="w-full p-2 border border-[#e0e1dd] rounded-md shadow-sm bg-[#1b263b] text-[#e0e1dd] focus:ring-[#778da9] focus:border-[#778da9]"
                />
              </div>
              <div>
                <label
                  htmlFor="physical-recovery"
                  className="block text-sm font-medium text-[#e0e1dd] mb-1"
                >
                  Physical Recovery
                </label>
                <input
                  type="number"
                  id="physical-recovery"
                  value={physicalRecovery}
                  onChange={(e) =>
                    setPhysicalRecovery(
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  className="w-full p-2 border border-[#e0e1dd] rounded-md shadow-sm bg-[#1b263b] text-[#e0e1dd] focus:ring-[#778da9] focus:border-[#778da9]"
                />
              </div>
              <div>
                <label
                  htmlFor="sleep-cycles"
                  className="block text-sm font-medium text-[#e0e1dd] mb-1"
                >
                  Sleep Cycles
                </label>
                <input
                  type="number"
                  id="sleep-cycles"
                  value={sleepCycles}
                  onChange={(e) =>
                    setSleepCycles(
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                  className="w-full p-2 border border-[#e0e1dd] rounded-md shadow-sm bg-[#1b263b] text-[#e0e1dd] focus:ring-[#778da9] focus:border-[#778da9]"
                />
              </div>
            </div>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSaveAndClose}
              disabled={isSubmitting || isLoading}
              className="w-full bg-[#415a77] text-[#e0e1dd] font-bold py-3 px-4 rounded-lg hover:bg-[#778da9] transition duration-300 disabled:bg-gray-600"
            >
              {isSubmitting || isLoading ? "Submitting..." : "Save and Close"}
            </button>
            <button
              type="button"
              onClick={handleSaveAndAddAnother}
              disabled={isSubmitting || isLoading}
              className="w-full bg-[#415a77] text-[#e0e1dd] font-bold py-3 px-4 rounded-lg hover:bg-[#778da9] transition duration-300 disabled:bg-gray-600"
            >
              {isSubmitting || isLoading
                ? "Submitting..."
                : "Save and Add Another"}
            </button>
          </div>
          {isLoading && <div className="spinner">Loading...</div>}
        </form>
      </section>
    </div>
  );
};

export default ManualSleepEntry;
