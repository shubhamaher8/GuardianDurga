-- Migration script for location_sharing table
-- Run this in your Supabase SQL editor

-- First, drop the NOT NULL constraint on the contacts column
ALTER TABLE location_sharing 
ALTER COLUMN contacts DROP NOT NULL;

-- Add new columns for storing contact information as strings
ALTER TABLE location_sharing 
ADD COLUMN IF NOT EXISTS contact_ids_string TEXT,
ADD COLUMN IF NOT EXISTS contact_names_string TEXT;

-- Add fallback column for simple contact count
ALTER TABLE location_sharing 
ADD COLUMN IF NOT EXISTS contact_count INTEGER DEFAULT 0;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_location_sharing_user_id ON location_sharing(user_id);
CREATE INDEX IF NOT EXISTS idx_location_sharing_status ON location_sharing(status);

-- Convert timestamp columns to use proper ISO format
ALTER TABLE location_sharing
ALTER COLUMN start_time TYPE TIMESTAMP WITH TIME ZONE,
ALTER COLUMN end_time TYPE TIMESTAMP WITH TIME ZONE,
ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE,
ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE; 