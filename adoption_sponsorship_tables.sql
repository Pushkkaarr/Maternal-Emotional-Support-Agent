-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for sponsorships
CREATE TABLE IF NOT EXISTS sponsorships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  sponsor_name TEXT NOT NULL,
  sponsor_email TEXT NOT NULL,
  sponsor_phone TEXT,
  monthly_amount DECIMAL(10, 2) NOT NULL,
  duration_months INTEGER,
  is_ongoing BOOLEAN DEFAULT false,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('Active', 'Paused', 'Cancelled', 'Completed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for adoption applications
CREATE TABLE IF NOT EXISTS adoption_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  address TEXT NOT NULL,
  financial_info TEXT,
  reason TEXT,
  status TEXT NOT NULL CHECK (status IN ('Pending Review', 'In Progress', 'Approved', 'Completed', 'Rejected')),
  application_date TIMESTAMP WITH TIME ZONE NOT NULL,
  decision_date TIMESTAMP WITH TIME ZONE,
  interview_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add missing columns to children table if needed
ALTER TABLE children ADD COLUMN IF NOT EXISTS has_sponsor BOOLEAN DEFAULT false;
ALTER TABLE children ADD COLUMN IF NOT EXISTS sponsor_name TEXT;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update the updated_at timestamp
CREATE TRIGGER update_sponsorships_modtime
BEFORE UPDATE ON sponsorships
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_adoption_applications_modtime
BEFORE UPDATE ON adoption_applications
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Sample data for testing
INSERT INTO sponsorships (
  child_id, 
  sponsor_name, 
  sponsor_email, 
  sponsor_phone, 
  monthly_amount, 
  duration_months, 
  is_ongoing, 
  message, 
  status, 
  start_date
) 
VALUES 
((SELECT id FROM children WHERE full_name = 'John Doe' LIMIT 1), 
'Sarah Smith', 
'sarah@example.com', 
'+1234567890', 
50.00, 
12, 
false, 
'I am excited to help with your education!', 
'Active', 
NOW() - INTERVAL '1 month');

INSERT INTO adoption_applications (
  child_id, 
  applicant_name, 
  applicant_email, 
  applicant_phone, 
  address, 
  financial_info, 
  reason, 
  status, 
  application_date
) 
VALUES 
((SELECT id FROM children WHERE full_name = 'Jane Smith' LIMIT 1), 
'David and Maria Johnson', 
'johnson@example.com', 
'+0987654321', 
'123 Main St, Anytown, USA', 
'Financially stable with steady income', 
'We have always wanted to adopt and feel we can provide a loving home.', 
'Pending Review', 
NOW() - INTERVAL '2 weeks'); 