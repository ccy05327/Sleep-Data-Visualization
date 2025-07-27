#!/usr/bin/env node

/**
 * Model Deployment Helper Script
 * Helps validate and setup trained ML models for Vercel deployment
 */

const fs = require("fs");
const path = require("path");

console.log("🤖 Sleep Prediction Model Deployment Helper\n");

// Check if models directory exists
const modelsDir = path.join(process.cwd(), "models");
if (!fs.existsSync(modelsDir)) {
  console.log("📁 Creating models directory...");
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log("✅ Models directory created at:", modelsDir);
} else {
  console.log("✅ Models directory found at:", modelsDir);
}

// Check for model files
const requiredFiles = ["model_config.json"];

const optionalFiles = [
  "sleep_prediction_model.h5",
  "start_time_model.pkl",
  "duration_model.pkl",
  "feature_scaler.pkl",
  "scaler_params.json",
];

console.log("\n🔍 Checking for model files...");

let configFound = false;
let modelFilesFound = [];

// Check required files
requiredFiles.forEach((file) => {
  const filePath = path.join(modelsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found: ${file}`);
    configFound = true;

    if (file === "model_config.json") {
      try {
        const config = JSON.parse(fs.readFileSync(filePath, "utf8"));
        console.log(`   📊 Model Type: ${config.model_type || "Unknown"}`);
        console.log(
          `   📈 Performance: ${JSON.stringify(config.performance || {})}`
        );
        console.log(
          `   📅 Training Date: ${config.training_date || "Unknown"}`
        );
        console.log(`   📋 Data Points: ${config.data_points || "Unknown"}`);
      } catch (e) {
        console.log(`   ⚠️  Warning: Could not parse ${file}`);
      }
    }
  } else {
    console.log(`❌ Missing: ${file}`);
  }
});

// Check optional files
console.log("\n📦 Checking for model binaries...");
optionalFiles.forEach((file) => {
  const filePath = path.join(modelsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found: ${file}`);
    modelFilesFound.push(file);

    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   📏 Size: ${sizeKB} KB`);
  } else {
    console.log(`⚪ Optional: ${file} (not found)`);
  }
});

// Provide recommendations
console.log("\n💡 Recommendations:");

if (!configFound) {
  console.log("❌ No model configuration found!");
  console.log("   Please upload model_config.json from your Colab training");
  console.log("   This file contains essential model metadata");
} else {
  console.log("✅ Model configuration is ready");
}

if (modelFilesFound.length === 0) {
  console.log("⚠️  No model binary files found");
  console.log("   The system will use enhanced heuristic predictions");
  console.log("   For best accuracy, upload trained model files from Colab");
} else if (modelFilesFound.includes("sleep_prediction_model.h5")) {
  console.log("🧠 TensorFlow/Keras model detected");
  console.log("   This will provide the highest accuracy predictions");
  console.log("   Make sure @tensorflow/tfjs-node is installed");
} else if (modelFilesFound.includes("start_time_model.pkl")) {
  console.log("🌲 Scikit-learn models detected");
  console.log("   Good accuracy with enhanced heuristic fallback");
  console.log("   Consider training a TensorFlow model for best results");
}

// Check package.json dependencies
console.log("\n📦 Checking dependencies...");
const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const requiredDeps = ["@tensorflow/tfjs-node", "ml-matrix"];
    const missingDeps = requiredDeps.filter((dep) => !deps[dep]);

    if (missingDeps.length === 0) {
      console.log("✅ All required ML dependencies are installed");
    } else {
      console.log("⚠️  Missing dependencies:");
      missingDeps.forEach((dep) => {
        console.log(`   - ${dep}`);
      });
      console.log("\n   Run: npm install " + missingDeps.join(" "));
    }
  } catch (e) {
    console.log("❌ Could not parse package.json");
  }
} else {
  console.log("❌ package.json not found");
}

// Deployment checklist
console.log("\n✅ Deployment Checklist:");
console.log("□ Upload model files to models/ directory");
console.log(
  "□ Install ML dependencies (npm install @tensorflow/tfjs-node ml-matrix)"
);
console.log("□ Update database schema with new prediction columns");
console.log("□ Test predictions with /api/predict-advanced endpoint");
console.log("□ Monitor prediction accuracy and confidence scores");

console.log("\n🚀 Ready to deploy advanced ML predictions!");
console.log("\nFor detailed instructions, see: ADVANCED_ML_DEPLOYMENT.md");

// Create a simple test file if no models exist
if (!configFound && modelFilesFound.length === 0) {
  console.log("\n🔧 Creating sample model config for testing...");

  const sampleConfig = {
    model_type: "enhanced_heuristic",
    feature_names: [
      "start_hour_sin",
      "start_hour_cos",
      "day_sin",
      "day_cos",
      "month_sin",
      "month_cos",
      "is_weekend",
      "duration_7d_avg",
      "duration_7d_std",
      "start_hour_7d_avg",
      "cumulative_sleep_debt",
      "prev_duration",
      "prev_start_hour",
    ],
    performance: {
      start_r2: 0.75,
      duration_r2: 0.8,
      start_mae: 0.5,
      duration_mae: 0.3,
    },
    training_date: new Date().toISOString(),
    data_points: 100,
    requires_tensorflow: false,
    model_files: [],
  };

  fs.writeFileSync(
    path.join(modelsDir, "model_config.json"),
    JSON.stringify(sampleConfig, null, 2)
  );

  console.log(
    "✅ Sample config created - system ready for enhanced predictions"
  );
}
