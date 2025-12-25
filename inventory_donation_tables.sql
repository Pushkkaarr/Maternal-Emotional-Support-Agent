-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT,
  description TEXT,
  condition TEXT,
  acquisition_date DATE,
  expiry_date DATE,
  location TEXT,
  supplier TEXT,
  minimum_stock INTEGER DEFAULT 0,
  cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create the inventory_movements table to track ins and outs
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('IN', 'OUT')),
  reason TEXT NOT NULL,
  notes TEXT,
  source_destination TEXT,
  moved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create inventory_requests table to track needed items
CREATE TABLE IF NOT EXISTS inventory_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity_needed INTEGER NOT NULL,
  quantity_fulfilled INTEGER DEFAULT 0,
  unit TEXT,
  description TEXT,
  priority TEXT CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  display_on_wishlist BOOLEAN DEFAULT true,
  requested_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create a table to track donation pledges for specific requested items
CREATE TABLE IF NOT EXISTS donation_pledges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inventory_request_id UUID REFERENCES inventory_requests(id) ON DELETE SET NULL,
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  quantity INTEGER NOT NULL,
  delivery_method TEXT NOT NULL,
  pickup_date DATE,
  pickup_address TEXT,
  message TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Received', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp for inventory
CREATE TRIGGER update_inventory_modtime
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create a trigger to automatically update the updated_at timestamp for inventory_requests
CREATE TRIGGER update_inventory_requests_modtime
BEFORE UPDATE ON inventory_requests
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create a function to update inventory quantities when movements are added
CREATE OR REPLACE FUNCTION update_inventory_quantity() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.movement_type = 'IN' THEN
    UPDATE inventory SET quantity = quantity + NEW.quantity WHERE id = NEW.inventory_id;
  ELSIF NEW.movement_type = 'OUT' THEN
    UPDATE inventory SET quantity = quantity - NEW.quantity WHERE id = NEW.inventory_id;
    -- Prevent negative quantities
    IF (SELECT quantity FROM inventory WHERE id = NEW.inventory_id) < 0 THEN
      UPDATE inventory SET quantity = 0 WHERE id = NEW.inventory_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update inventory quantities on movement insert
CREATE TRIGGER update_inventory_on_movement
AFTER INSERT ON inventory_movements
FOR EACH ROW
EXECUTE FUNCTION update_inventory_quantity();

-- Function to update the fulfilled quantity when a pledge is received
CREATE OR REPLACE FUNCTION update_fulfilled_quantity() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Received' AND (OLD IS NULL OR OLD.status != 'Received') THEN
    -- Increment the fulfilled quantity
    UPDATE inventory_requests 
    SET quantity_fulfilled = quantity_fulfilled + NEW.quantity
    WHERE id = NEW.inventory_request_id;
  ELSIF OLD.status = 'Received' AND NEW.status != 'Received' THEN
    -- Decrement the fulfilled quantity
    UPDATE inventory_requests 
    SET quantity_fulfilled = GREATEST(0, quantity_fulfilled - OLD.quantity)
    WHERE id = NEW.inventory_request_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update fulfilled quantities
CREATE TRIGGER update_fulfilled_on_pledge
AFTER INSERT OR UPDATE ON donation_pledges
FOR EACH ROW
EXECUTE FUNCTION update_fulfilled_quantity();

-- Insert sample data into inventory
INSERT INTO inventory (item_name, category, quantity, unit, description, condition, location, minimum_stock)
VALUES 
('School Notebooks', 'School Supplies', 120, 'pieces', 'Standard ruled notebooks for school use', 'New', 'Storage Room A', 50),
('Children''s T-shirts', 'Clothing', 85, 'pieces', 'Assorted sizes and colors', 'New', 'Storage Room B', 30),
('Rice', 'Food', 200, 'kg', 'White rice for daily meals', 'Good', 'Kitchen Storage', 100),
('First Aid Kits', 'Medical', 15, 'kits', 'Basic first aid supplies', 'New', 'Medical Cabinet', 10),
('Blankets', 'Bedding', 45, 'pieces', 'Warm blankets for winter', 'Good', 'Linen Closet', 20);

-- Insert sample movement data
INSERT INTO inventory_movements (inventory_id, quantity, movement_type, reason, source_destination)
VALUES
((SELECT id FROM inventory WHERE item_name = 'School Notebooks'), 50, 'IN', 'Donation', 'ABC School Supplies'),
((SELECT id FROM inventory WHERE item_name = 'Rice'), 20, 'OUT', 'Weekly consumption', 'Main Kitchen'),
((SELECT id FROM inventory WHERE item_name = 'Children''s T-shirts'), 25, 'IN', 'Purchase', 'Local Clothing Store'),
((SELECT id FROM inventory WHERE item_name = 'First Aid Kits'), 5, 'OUT', 'Distributed to dormitories', 'Building B');

-- Insert sample data into inventory_requests
INSERT INTO inventory_requests (item_name, category, quantity_needed, unit, description, priority)
VALUES 
('School Uniforms', 'Clothes', 10, 'sets', 'School uniforms for children ages 6-10', 'High'),
('Story Books', 'Books', 15, 'books', 'Children''s story books for ages 3-8', 'Medium'),
('Winter Jackets', 'Clothes', 8, 'pieces', 'Warm winter jackets for children ages 4-12', 'High'),
('Rice', 'Food', 50, 'kg', 'Rice for daily meals', 'Critical'),
('Toys', 'Toys', 12, 'pieces', 'Educational toys for different age groups', 'Medium'); 