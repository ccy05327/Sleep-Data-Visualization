-- Sleep Data Visualization - Database Schema
-- Created for ML-SDV Next.js application

-- Table for storing actual sleep records
CREATE TABLE sleep_records (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    sleep_score INTEGER CHECK (sleep_score >= 0 AND sleep_score <= 100),
    mental_recovery INTEGER CHECK (mental_recovery >= 0 AND mental_recovery <= 100),
    physical_recovery INTEGER CHECK (physical_recovery >= 0 AND physical_recovery <= 100),
    timezone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints to ensure data integrity
    CONSTRAINT valid_sleep_duration CHECK (end_time > start_time),
    CONSTRAINT valid_duration_calculation CHECK (
        duration_minutes = EXTRACT(EPOCH FROM (end_time - start_time)) / 60
    )
);

-- Table for storing sleep predictions
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    predicted_for_date DATE NOT NULL,
    predicted_start_time TIMESTAMPTZ NOT NULL,
    predicted_end_time TIMESTAMPTZ NOT NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints to ensure data integrity
    CONSTRAINT valid_predicted_duration CHECK (predicted_end_time > predicted_start_time),
    CONSTRAINT unique_prediction_per_date UNIQUE (predicted_for_date)
);

-- Indexes for better query performance
CREATE INDEX idx_sleep_records_start_time ON sleep_records(start_time);
CREATE INDEX idx_sleep_records_created_at ON sleep_records(created_at);
CREATE INDEX idx_predictions_predicted_date ON predictions(predicted_for_date);
CREATE INDEX idx_predictions_created_at ON predictions(created_at);

-- Comments for documentation
COMMENT ON TABLE sleep_records IS 'Stores actual sleep session data recorded by the user';
COMMENT ON TABLE predictions IS 'Stores ML-generated sleep predictions and user feedback';

COMMENT ON COLUMN sleep_records.duration_minutes IS 'Sleep duration in minutes, calculated from start_time and end_time';
COMMENT ON COLUMN sleep_records.sleep_score IS 'Overall sleep quality score (0-100)';
COMMENT ON COLUMN sleep_records.mental_recovery IS 'Mental recovery score (0-100)';
COMMENT ON COLUMN sleep_records.physical_recovery IS 'Physical recovery score (0-100)';
COMMENT ON COLUMN sleep_records.timezone IS 'Timezone offset information (e.g., "+05:30", "-08:00")';

COMMENT ON COLUMN predictions.predicted_for_date IS 'The date for which this sleep prediction is made';
COMMENT ON COLUMN predictions.feedback IS 'User feedback on prediction accuracy (optional)';
