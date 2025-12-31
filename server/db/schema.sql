-- Database Schema for KCSSC Website
-- Supports PostgreSQL, MySQL, and SQLite

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  end_time TIME,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  schedule VARCHAR(255) NOT NULL, -- e.g., "Tuesdays, 10:00 AM - 12:00 PM"
  age_group VARCHAR(50) NOT NULL,
  description TEXT,
  spots VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_age_group ON programs(age_group);

-- Trigger to update updated_at timestamp (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Photos Table
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  photo VARCHAR(500) NOT NULL, -- URL or path to the photo
  description TEXT,
  event VARCHAR(255) NOT NULL, -- Event name
  date DATE NOT NULL,
  favourite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for photos
CREATE INDEX IF NOT EXISTS idx_photos_date ON photos(date);
CREATE INDEX IF NOT EXISTS idx_photos_event ON photos(event);
CREATE INDEX IF NOT EXISTS idx_photos_favourite ON photos(favourite);

-- Trigger to update updated_at timestamp for photos
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


