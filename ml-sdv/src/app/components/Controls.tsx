import React from "react";

interface ControlsProps {
  predictionDate: string;
  setPredictionDate: (date: string) => void;
  handlePrediction: () => void;
  isPredicting: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  predictionDate,
  setPredictionDate,
  handlePrediction,
  isPredicting,
}) => {
  return (
    <section className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd]">
      <h2 className="text-2xl font-semibold mb-6 text-[#e0e1dd]">Controls</h2>
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
  );
};

export default Controls;
