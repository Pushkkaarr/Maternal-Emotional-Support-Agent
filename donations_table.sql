-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  donation_type TEXT NOT NULL CHECK (donation_type IN ('Money', 'Items', 'Services')),
  amount DECIMAL(10, 2),
  items_description TEXT,
  services_description TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_donation_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_donation_modtime
BEFORE UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_donation_modified_column();

-- Insert sample data
INSERT INTO donations (donor_name, donor_email, donor_phone, donation_type, amount, status)
VALUES 
('John Doe', 'john@example.com', '+1234567890', 'Money', 1000.00, 'Pending'),
('Jane Smith', 'jane@example.com', '+0987654321', 'Items', NULL, 'Approved'),
('Mike Johnson', 'mike@example.com', '+1122334455', 'Services', NULL, 'Completed');

INSERT INTO donations (donor_name, donor_email, donation_type, items_description, status)
VALUES 
('Sarah Wilson', 'sarah@example.com', 'Items', 'Children''s clothes and toys', 'Pending'),
('Tom Brown', 'tom@example.com', 'Items', 'School supplies and books', 'Approved');

INSERT INTO donations (donor_name, donor_email, donation_type, services_description, status)
VALUES 
('Lisa Davis', 'lisa@example.com', 'Services', 'Weekly tutoring services', 'Pending'),
('David Miller', 'david@example.com', 'Services', 'Monthly medical checkups', 'Approved'); 