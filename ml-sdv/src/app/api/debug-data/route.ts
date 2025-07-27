import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface TestResult {
  name: string;
  status: string;
  count?: number;
  error?: string;
  data?: string;
  sufficient?: string;
  fields?: Record<string, string>;
  sampleRecord?: Record<string, unknown>;
  recordsFound?: number;
  readyForTraining?: boolean;
  hasData?: boolean;
}

interface Diagnostics {
  timestamp: string;
  supabaseConfig: {
    url: string;
    key: string;
  };
  tests: TestResult[];
  recommendations?: string[];
  summary?: {
    totalRecords: number;
    readyForML: boolean;
    hasErrors: boolean;
    nextAction: string;
  };
}

export async function GET() {
  try {
    console.log("🔍 Starting data diagnostics...");

    const diagnostics: Diagnostics = {
      timestamp: new Date().toISOString(),
      supabaseConfig: {
        url: supabaseUrl ? "✅ Set" : "❌ Missing",
        key: supabaseKey ? "✅ Set" : "❌ Missing",
      },
      tests: [],
    };

    // Test 1: Basic connection
    try {
      const { data: testData, error: testError } = await supabase
        .from("sleep_records")
        .select("*")
        .limit(1);

      diagnostics.tests.push({
        name: "Basic Connection",
        status: testError ? "❌ Failed" : "✅ Success",
        error: testError?.message,
        data: testData ? "Data found" : "No data",
      });
    } catch (error) {
      diagnostics.tests.push({
        name: "Basic Connection",
        status: "❌ Failed",
        error: (error as Error).message,
      });
    }

    // Test 2: Count records
    try {
      const { data: allData, error: countError } = await supabase
        .from("sleep_records")
        .select("*");

      const recordCount = allData ? allData.length : 0;

      diagnostics.tests.push({
        name: "Record Count",
        status: recordCount > 0 ? "✅ Success" : "⚠️ Empty",
        count: recordCount,
        error: countError?.message,
        sufficient:
          recordCount >= 30
            ? "✅ Enough for ML"
            : `❌ Need ${30 - recordCount} more`,
      });
    } catch (error) {
      diagnostics.tests.push({
        name: "Record Count",
        status: "❌ Failed",
        error: (error as Error).message,
      });
    }

    // Test 3: Data structure
    try {
      const { data: sampleData, error: structureError } = await supabase
        .from("sleep_records")
        .select("*")
        .limit(5);

      if (sampleData && sampleData.length > 0) {
        const sampleRecord = sampleData[0];
        const requiredFields = ["start_time", "end_time"];
        const optionalFields = [
          "sleep_duration",
          "sleep_quality",
          "stress_level",
          "sleep_cycle",
        ];

        const fieldStatus: Record<string, string> = {};
        requiredFields.forEach((field) => {
          fieldStatus[field] =
            field in sampleRecord ? "✅ Present" : "❌ Missing";
        });
        optionalFields.forEach((field) => {
          fieldStatus[field] =
            field in sampleRecord ? "✅ Present" : "⚪ Optional";
        });

        diagnostics.tests.push({
          name: "Data Structure",
          status: "✅ Analyzed",
          fields: fieldStatus,
          sampleRecord: sampleRecord,
          error: structureError ? String(structureError) : undefined,
        });
      } else {
        diagnostics.tests.push({
          name: "Data Structure",
          status: "⚠️ No data to analyze",
          error: structureError ? String(structureError) : undefined,
        });
      }
    } catch (error) {
      diagnostics.tests.push({
        name: "Data Structure",
        status: "❌ Failed",
        error: (error as Error).message,
      });
    }

    // Test 4: ML Training Query (exact same query as train-model)
    try {
      const { data: mlData, error: mlError } = await supabase
        .from("sleep_records")
        .select("*")
        .order("start_time", { ascending: true });

      diagnostics.tests.push({
        name: "ML Training Query",
        status: mlError ? "❌ Failed" : "✅ Success",
        recordsFound: mlData ? mlData.length : 0,
        readyForTraining: mlData ? mlData.length >= 30 : false,
        error: mlError?.message,
      });
    } catch (error) {
      diagnostics.tests.push({
        name: "ML Training Query",
        status: "❌ Failed",
        error: (error as Error).message,
      });
    }

    // Test 5: Other tables
    const otherTables = ["predictions"];
    for (const tableName of otherTables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select("*")
          .limit(1);

        diagnostics.tests.push({
          name: `Table: ${tableName}`,
          status: tableError ? "❌ Failed" : "✅ Accessible",
          hasData: tableData ? tableData.length > 0 : false,
          error: tableError?.message,
        });
      } catch (error) {
        diagnostics.tests.push({
          name: `Table: ${tableName}`,
          status: "❌ Failed",
          error: (error as Error).message,
        });
      }
    }

    // Generate recommendations
    const allRecordsTest = diagnostics.tests.find(
      (t) => t.name === "Record Count"
    );
    const recordCount = allRecordsTest?.count || 0;

    const recommendations = [];

    if (recordCount === 0) {
      recommendations.push(
        "🔧 Add sleep records using the 'Add Sleep Record' button"
      );
      recommendations.push("📝 You need at least 30 records for ML training");
      recommendations.push(
        "🎯 Use the AddSleepModal to enter historical sleep data"
      );
    } else if (recordCount < 30) {
      recommendations.push(
        `📊 Add ${30 - recordCount} more sleep records for ML training`
      );
      recommendations.push(
        "⏰ ML training requires minimum 30 data points for accuracy"
      );
    } else {
      recommendations.push("✅ You have enough data for ML training!");
      recommendations.push(
        "🤖 Click 'Train ML Model' button to start training"
      );
    }

    if (diagnostics.tests.some((t) => t.status.includes("❌"))) {
      recommendations.push(
        "🔍 Check Supabase credentials and database permissions"
      );
      recommendations.push(
        "🔐 Verify Row Level Security (RLS) policies allow data access"
      );
    }

    diagnostics.recommendations = recommendations;
    diagnostics.summary = {
      totalRecords: recordCount,
      readyForML: recordCount >= 30,
      hasErrors: diagnostics.tests.some((t) => t.status.includes("❌")),
      nextAction:
        recordCount === 0
          ? "Add sleep data first"
          : recordCount < 30
          ? `Add ${30 - recordCount} more records`
          : "Ready to train ML model",
    };

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    console.error("Diagnostic error:", error);
    return NextResponse.json(
      {
        error: "Diagnostic failed",
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
