import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    // Get the most recent model
    const { data: modelData, error: modelError } = await supabase
      .from("ml_models")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (modelError || !modelData) {
      return NextResponse.json(
        { error: "No trained model found" },
        { status: 404 }
      );
    }

    // Count total sleep records
    const { count: recordCount } = await supabase
      .from("sleep_records")
      .select("*", { count: "exact", head: true });

    const modelInfo = {
      trainingDate: modelData.created_at,
      recordCount: recordCount || 0,
      accuracy: modelData.accuracy || { startTime: 0, duration: 0 },
    };

    return NextResponse.json({ modelInfo });
  } catch (error) {
    console.error("Error getting model info:", error);
    return NextResponse.json(
      { error: "Failed to get model information" },
      { status: 500 }
    );
  }
}
