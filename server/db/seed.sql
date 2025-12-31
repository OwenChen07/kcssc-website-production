-- Seed data for development/testing
-- This populates the database with sample events and programs

-- Insert sample events
INSERT INTO events (title, date, time, end_time, location, category, description, featured) VALUES
('Lunar New Year Celebration', '2025-01-25', '11:00:00', '15:00:00', 'Community Hall', 'Holiday', 'Join us for our biggest celebration of the year with traditional performances, food, and festivities.', TRUE),
('Senior Health & Wellness Workshop', '2025-01-15', '14:00:00', '16:00:00', 'Room 102', 'Health', 'Learn about maintaining health and wellness with expert speakers and interactive sessions.', FALSE),
('Traditional Chinese Painting Class', '2025-01-18', '10:00:00', '12:00:00', 'Art Room', 'Arts', 'Explore the beautiful art of Chinese brush painting with our experienced instructors.', FALSE),
('Tai Chi in the Park', '2025-01-20', '09:00:00', '10:00:00', 'Kanata Park', 'Fitness', 'Start your morning with gentle Tai Chi exercises in the fresh air.', FALSE),
('Chinese New Year Dumpling Making', '2025-01-22', '13:00:00', '16:00:00', 'Kitchen', 'Cooking', 'Learn to make traditional dumplings for the New Year celebration.', TRUE),
('Technology Help Desk', '2025-01-24', '10:00:00', '12:00:00', 'Computer Lab', 'Learning', 'Get one-on-one help with your smartphone, tablet, or computer questions.', FALSE),
('Movie Afternoon: Classic Films', '2025-01-28', '14:00:00', '16:30:00', 'Community Hall', 'Social', 'Enjoy a classic Chinese film with friends and refreshments.', FALSE),
('Spring Festival Concert', '2025-02-01', '19:00:00', '21:00:00', 'Community Hall', 'Holiday', 'A special evening of traditional music and performances celebrating the Spring Festival.', TRUE),
('Morning Exercise Group', '2025-01-16', '08:00:00', '09:00:00', 'Community Hall', 'Fitness', 'Join our morning exercise group for a healthy start to your day.', FALSE),
('Chinese Calligraphy Workshop', '2025-01-17', '14:00:00', '16:00:00', 'Art Room', 'Arts', 'Learn the art of Chinese calligraphy with master calligraphers.', FALSE),
('Community Lunch', '2025-01-19', '12:00:00', '14:00:00', 'Dining Hall', 'Social', 'Enjoy a community lunch with friends and neighbors.', FALSE),
('Health Screening Day', '2025-01-21', '10:00:00', '15:00:00', 'Room 101', 'Health', 'Free health screenings including blood pressure, glucose, and more.', TRUE),
('Mahjong Tournament', '2025-01-23', '13:00:00', '17:00:00', 'Game Room', 'Social', 'Join our monthly Mahjong tournament. All skill levels welcome.', FALSE),
('Garden Club Meeting', '2025-01-26', '14:00:00', '16:00:00', 'Room 103', 'Social', 'Monthly meeting of the community garden club. Share tips and seeds!', FALSE),
('Chinese Language Class', '2025-01-27', '10:00:00', '11:30:00', 'Classroom A', 'Learning', 'Beginner-friendly Chinese language class. Practice conversation and characters.', FALSE),
('Karaoke Night', '2025-01-29', '18:00:00', '21:00:00', 'Community Hall', 'Social', 'Sing your favorite Chinese and English songs with friends!', FALSE),
('Book Club Discussion', '2025-01-30', '14:00:00', '16:00:00', 'Library', 'Learning', 'Monthly book club meeting. This month: Chinese literature classics.', FALSE),
('Yoga for Seniors', '2025-01-31', '09:00:00', '10:00:00', 'Activity Room', 'Fitness', 'Gentle yoga class designed specifically for seniors.', FALSE),
('Cooking Class: Dim Sum', '2025-02-02', '11:00:00', '14:00:00', 'Kitchen', 'Cooking', 'Learn to make traditional dim sum dishes from scratch.', TRUE),
('Computer Basics Workshop', '2025-02-03', '10:00:00', '12:00:00', 'Computer Lab', 'Learning', 'Introduction to computers for beginners. Learn the basics step by step.', FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample programs
INSERT INTO programs (title, category, icon, schedule, age_group, description, spots) VALUES
('Chinese Brush Painting', 'Arts & Crafts', 'Palette', 'Tuesdays, 10:00 AM - 12:00 PM', 'All Ages', 'Learn traditional Chinese brush painting techniques from experienced instructors. All skill levels welcome.', '12 spots available'),
('Tai Chi for Beginners', 'Health & Wellness', 'Heart', 'Mon/Wed/Fri, 9:00 AM - 10:00 AM', '55+', 'Gentle Tai Chi movements to improve balance, flexibility, and mental clarity.', '8 spots available'),
('Chinese Folk Dance', 'Music & Dance', 'Music', 'Thursdays, 2:00 PM - 4:00 PM', 'All Ages', 'Learn beautiful traditional Chinese dances in a fun, supportive environment.', '6 spots available'),
('Mandarin Conversation Circle', 'Language & Learning', 'BookOpen', 'Wednesdays, 1:00 PM - 2:30 PM', 'All Ages', 'Practice conversational Mandarin with fellow learners in a relaxed setting.', '10 spots available'),
('Cooking: Regional Cuisines', 'Social & Dining', 'Utensils', 'Saturdays, 11:00 AM - 1:00 PM', 'All Ages', 'Explore dishes from different regions of China. Taste and learn together!', '8 spots available'),
('Gentle Exercise Class', 'Fitness Programs', 'Dumbbell', 'Tuesdays/Thursdays, 11:00 AM - 12:00 PM', '65+', 'Low-impact exercises designed specifically for seniors to maintain mobility and strength.', '15 spots available'),
('Chinese Calligraphy', 'Arts & Crafts', 'Palette', 'Fridays, 10:00 AM - 12:00 PM', 'All Ages', 'Master the art of Chinese calligraphy, from basic strokes to complete characters.', '10 spots available'),
('Choir & Singing Group', 'Music & Dance', 'Music', 'Wednesdays, 3:00 PM - 5:00 PM', 'All Ages', 'Join our community choir singing Chinese and international songs.', 'Open enrollment'),
('Computer Skills Workshop', 'Language & Learning', 'BookOpen', 'Mondays, 2:00 PM - 4:00 PM', '55+', 'Learn to use smartphones, tablets, and computers with patient, step-by-step guidance.', '6 spots available')
ON CONFLICT DO NOTHING;

-- Insert sample photos
INSERT INTO photos (photo, description, event, date, favourite) VALUES
('/HeroPhoto.JPG', 'Community members gathering at the center for a special event', 'Lunar New Year Celebration', '2025-01-25', TRUE),
('/StoneHouse.jpg', 'Beautiful community center building during spring', 'Spring Festival Concert', '2025-02-01', TRUE),
('/HeroPhoto.JPG', 'Participants enjoying traditional activities', 'Chinese New Year Dumpling Making', '2025-01-22', TRUE),
('/StoneHouse.jpg', 'Health professionals conducting wellness checks', 'Health Screening Day', '2025-01-21', TRUE),
('/HeroPhoto.JPG', 'Artists showcasing their calligraphy work', 'Chinese Calligraphy Workshop', '2025-01-17', FALSE),
('/StoneHouse.jpg', 'Members practicing Tai Chi in the morning', 'Tai Chi in the Park', '2025-01-20', FALSE),
('/HeroPhoto.JPG', 'Traditional Chinese painting class in session', 'Traditional Chinese Painting Class', '2025-01-18', FALSE),
('/StoneHouse.jpg', 'Community lunch gathering with friends', 'Community Lunch', '2025-01-19', FALSE),
('/HeroPhoto.JPG', 'Expert speaker presenting health information', 'Senior Health & Wellness Workshop', '2025-01-15', FALSE),
('/StoneHouse.jpg', 'Morning exercise group in action', 'Morning Exercise Group', '2025-01-16', FALSE),
('/HeroPhoto.JPG', 'Technology help session for seniors', 'Technology Help Desk', '2025-01-24', FALSE),
('/StoneHouse.jpg', 'Classic film screening event', 'Movie Afternoon: Classic Films', '2025-01-28', FALSE),
('/HeroPhoto.JPG', 'Mahjong tournament participants', 'Mahjong Tournament', '2025-01-23', FALSE),
('/StoneHouse.jpg', 'Garden club members sharing tips', 'Garden Club Meeting', '2025-01-26', FALSE),
('/HeroPhoto.JPG', 'Language class students practicing', 'Chinese Language Class', '2025-01-27', FALSE),
('/StoneHouse.jpg', 'Karaoke night celebration', 'Karaoke Night', '2025-01-29', FALSE),
('/HeroPhoto.JPG', 'Book club discussion session', 'Book Club Discussion', '2025-01-30', FALSE),
('/StoneHouse.jpg', 'Yoga class for seniors', 'Yoga for Seniors', '2025-01-31', FALSE),
('/HeroPhoto.JPG', 'Dim sum cooking class demonstration', 'Cooking Class: Dim Sum', '2025-02-02', FALSE),
('/StoneHouse.jpg', 'Computer basics workshop participants', 'Computer Basics Workshop', '2025-02-03', FALSE)
ON CONFLICT DO NOTHING;


