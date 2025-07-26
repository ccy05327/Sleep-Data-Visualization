import React from "react";

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
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/add-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime,
          endTime,
          timezone: userTimezone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add record.");
      }

      alert("Record added successfully!");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd]">
      <h2 className="text-2xl font-semibold mb-4 text-[#e0e1dd]">
        Manual Sleep Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#415a77] text-[#e0e1dd] font-bold py-3 px-4 rounded-lg hover:bg-[#778da9] transition duration-300 disabled:bg-gray-600"
        >
          {isSubmitting ? "Submitting..." : "Add Record"}
        </button>
      </form>
    </section>
  );
};

export default ManualSleepEntry;
