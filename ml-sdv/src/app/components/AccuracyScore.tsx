import React from "react";

interface AccuracyScoreProps {
  accuracy: { score: number; total: number };
}

const AccuracyScore: React.FC<AccuracyScoreProps> = ({ accuracy }) => {
  return (
    <section className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd]">
      <h2 className="text-2xl font-semibold mb-4 text-[#e0e1dd]">
        Prediction Accuracy
      </h2>
      <div className="text-center">
        {accuracy.total > 0 ? (
          <>
            <p className="text-5xl font-bold text-white">{accuracy.score}%</p>
            <p className="text-sm text-[#adb5bd] mt-1">
              Based on {accuracy.total} feedback entries.
            </p>
          </>
        ) : (
          <p className="text-[#adb5bd]">No feedback provided yet.</p>
        )}
      </div>
    </section>
  );
};

export default AccuracyScore;
