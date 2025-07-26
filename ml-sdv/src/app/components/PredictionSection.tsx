import React from "react";
import type { Prediction } from "../page"; // Corrected import

interface PredictionSectionProps {
  predictions: Prediction[];
  predictionDate: string;
  userTimezone: string;
  isPredicting: boolean;
  handleFeedback: (id: number, feedback: "accurate" | "inaccurate") => void;
}

const PredictionSection: React.FC<PredictionSectionProps> = ({
  predictions,
  predictionDate,
  userTimezone,
  isPredicting,
  handleFeedback,
}) => {
  const formatTime = (dateStr: string, timeZone: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: timeZone,
    });
  };

  const formatDuration = (startStr: string, endStr: string) => {
    const durationMs =
      new Date(endStr).getTime() - new Date(startStr).getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <section className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd]">
      <h2 className="text-2xl font-semibold mb-4 text-[#e0e1dd]">Prediction</h2>
      <div className="bg-[#0d1b2a] p-6 rounded-lg min-h-[120px] flex items-center justify-center border border-[#e0e1dd]">
        {isPredicting ? (
          <div className="text-[#e0e1dd]">Generating prediction...</div>
        ) : predictions.filter((p) => p.predicted_for_date === predictionDate)
            .length > 0 ? (
          <ul className="space-y-4 w-full">
            {predictions
              .filter((p) => p.predicted_for_date === predictionDate)
              .map((pred) => (
                <li
                  key={pred.id}
                  className="p-4 bg-[#1b263b] rounded-lg shadow-sm border border-[#415a77]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#e0e1dd] text-lg">
                        {formatTime(pred.predicted_start_time, userTimezone)} -{" "}
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
                        onClick={() => handleFeedback(pred.id, "inaccurate")}
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
          <p className="text-[#e0e1dd]">
            No prediction for this date. Generate one above.
          </p>
        )}
      </div>
    </section>
  );
};

export default PredictionSection;
