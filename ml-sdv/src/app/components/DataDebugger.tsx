import React, { useState } from "react";

interface DebugResult {
  timestamp: string;
  supabaseConfig: {
    url: string;
    key: string;
  };
  tests: Array<{
    name: string;
    status: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
  recommendations?: string[];
  summary?: {
    totalRecords: number;
    readyForML: boolean;
    hasErrors: boolean;
    nextAction: string;
  };
}

interface DataDebuggerProps {
  userTimezone: string;
}

const DataDebugger: React.FC<DataDebuggerProps> = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [debugResults, setDebugResults] = useState<DebugResult | null>(null);
  const [error, setError] = useState("");

  const runDiagnostics = async () => {
    setIsRunning(true);
    setError("");
    setDebugResults(null);

    try {
      const response = await fetch("/api/debug-data");

      if (!response.ok) {
        throw new Error(`Debug failed: ${response.status}`);
      }

      const data = await response.json();
      setDebugResults(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes("✅")) return "✅";
    if (status.includes("❌")) return "❌";
    if (status.includes("⚠️")) return "⚠️";
    return "⚪";
  };

  return (
    <section className="bg-[#1b263b] p-6 sm:p-8 rounded-xl shadow-md border border-[#e0e1dd]">
      <h2 className="text-2xl font-semibold mb-4 text-[#e0e1dd]">
        🔍 Data Debugger
      </h2>

      <div className="space-y-6">
        <div className="bg-[#0d1b2a] p-4 rounded-lg border border-[#415a77]">
          <p className="text-[#adb5bd] mb-4">
            Diagnose why ML training shows 0 records. This tool checks your
            database connection, data availability, and identifies common
            issues.
          </p>

          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="w-full bg-[#415a77] text-[#e0e1dd] font-bold py-3 px-4 rounded-lg hover:bg-[#778da9] transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Running Diagnostics...
              </span>
            ) : (
              "🔍 Run Data Diagnostics"
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-400/30 rounded-md p-4">
            <p className="text-red-400 text-sm">
              <strong>Diagnostic Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Results Display */}
        {debugResults && (
          <div className="space-y-4">
            {/* Summary */}
            {debugResults.summary && (
              <div className="bg-[#0d1b2a] p-4 rounded-lg border border-[#415a77]">
                <h3 className="text-lg font-semibold text-[#e0e1dd] mb-2">
                  📊 Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#adb5bd]">Total Records:</span>
                    <p className="text-[#e0e1dd] font-medium">
                      {debugResults.summary.totalRecords}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#adb5bd]">Ready for ML:</span>
                    <p
                      className={`font-medium ${
                        debugResults.summary.readyForML
                          ? "text-green-400"
                          : "text-orange-400"
                      }`}
                    >
                      {debugResults.summary.readyForML ? "Yes ✅" : "No ❌"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[#adb5bd]">Next Action:</span>
                    <p className="text-[#e0e1dd] font-medium">
                      {debugResults.summary.nextAction}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Test Results */}
            <div className="bg-[#0d1b2a] p-4 rounded-lg border border-[#415a77]">
              <h3 className="text-lg font-semibold text-[#e0e1dd] mb-2">
                🧪 Test Results
              </h3>
              <div className="space-y-3">
                {debugResults.tests.map((test, index) => (
                  <div key={index} className="border-l-4 border-[#415a77] pl-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#e0e1dd] font-medium">
                        {getStatusIcon(test.status)} {test.name}
                      </span>
                      <span className="text-sm text-[#adb5bd]">
                        {test.status}
                      </span>
                    </div>

                    {/* Show additional details */}
                    {test.count !== undefined && (
                      <p className="text-sm text-[#adb5bd] mt-1">
                        Records: {test.count}
                      </p>
                    )}
                    {test.sufficient && (
                      <p className="text-sm text-[#adb5bd]">
                        {test.sufficient}
                      </p>
                    )}
                    {test.error && (
                      <p className="text-sm text-red-400 mt-1">
                        Error: {test.error}
                      </p>
                    )}
                    {test.fields && (
                      <div className="text-sm text-[#adb5bd] mt-1">
                        <strong>Fields:</strong>
                        {Object.entries(test.fields).map(([field, status]) => (
                          <span key={field} className="ml-2">
                            {field}: {status as string}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {debugResults.recommendations && (
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-md p-4">
                <h4 className="text-blue-400 font-semibold mb-2">
                  💡 Recommendations
                </h4>
                <ul className="text-sm text-blue-300 space-y-1">
                  {debugResults.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw Data (Collapsible) */}
            <details className="bg-[#0d1b2a] p-4 rounded-lg border border-[#415a77]">
              <summary className="text-[#e0e1dd] font-medium cursor-pointer hover:text-[#778da9]">
                🔧 Raw Diagnostic Data (Click to expand)
              </summary>
              <pre className="text-xs text-[#adb5bd] mt-2 overflow-auto max-h-60">
                {JSON.stringify(debugResults, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </section>
  );
};

export default DataDebugger;
