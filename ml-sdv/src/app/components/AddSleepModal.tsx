import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

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
  const [sleepCycle, setSleepCycle] = useState<number | "">("");
  const [isMetricsVisible, setIsMetricsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentDateTime = new Date()
    .toLocaleString("sv-SE", { hour12: false, timeZoneName: "short" })
    .slice(0, 16)
    .replace(" ", "T");

  useEffect(() => {
    if (isOpen) {
      if (!startTime) setStartTime(currentDateTime);
      if (!endTime) setEndTime(currentDateTime);
    }
  }, [isOpen]);

  const calculateSleepDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = endDate.getTime() - startDate.getTime();
    return Math.max(0, Math.floor(duration / 1000 / 60)); // Duration in minutes
  };

  const getFormattedTimezone = (): string => {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60))
      .toString()
      .padStart(2, "0");
    const minutes = Math.abs(offset % 60)
      .toString()
      .padStart(2, "0");
    const sign = offset > 0 ? "-" : "+";
    return `UTC${sign}${hours}${minutes}`;
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
          timezone: getFormattedTimezone(),
          sleep_score: sleepScore || null,
          mental_recovery: mentalRecovery || null,
          physical_recovery: physicalRecovery || null,
          sleep_cycle: sleepCycle || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add sleep record.");
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
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
    setStartTime("");
    setEndTime("");
    setSleepScore("");
    setMentalRecovery("");
    setPhysicalRecovery("");
    setSleepCycle("");
  };

  if (!isOpen) return null;

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
              value={startTime || currentDateTime}
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
              value={endTime || currentDateTime}
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
                  value={sleepCycle}
                  onChange={(e) =>
                    setSleepCycle(
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
          {showSuccess && (
            <p className="text-green-400 text-sm font-medium bg-green-900/20 border border-green-400/30 rounded-md p-3">
              ✓ Record added successfully!
            </p>
          )}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSaveAndClose}
              disabled={isSubmitting || isLoading}
              className="w-full bg-[#415a77] text-[#e0e1dd] font-bold py-3 px-4 rounded-lg hover:bg-[#778da9] transition duration-300 disabled:bg-gray-600 flex items-center justify-center"
            >
              {isSubmitting || isLoading ? (
                "Submitting..."
              ) : (
                <FaPlus className="text-xl" />
              )}
            </button>
            <button
              type="button"
              onClick={handleSaveAndAddAnother}
              disabled={isSubmitting || isLoading}
              className="w-full bg-[#415a77] text-[#e0e1dd] font-bold py-3 px-4 rounded-lg hover:bg-[#778da9] transition duration-300 disabled:bg-gray-600 flex items-center justify-center"
            >
              {isSubmitting || isLoading ? (
                "Submitting..."
              ) : (
                <span className="flex items-center">
                  <FaPlus className="text-xl" />
                  <FaPlus className="text-xl ml-1" />
                </span>
              )}
            </button>
          </div>
          {isLoading && <div className="spinner">Loading...</div>}
        </form>
      </section>
    </div>
  );
};

export default ManualSleepEntry;
