// Seed photos data
import dotenv from 'dotenv';
import { resolve } from 'path';
import { query, closeDatabase } from './connection.js';
// Load .env
dotenv.config({ path: resolve(process.cwd(), '.env') });
const samplePhotos = [
    { photo: '/HeroPhoto.JPG', description: 'Community members gathering at the center for a special event', event: 'Lunar New Year Celebration', date: '2025-01-25', favourite: true },
    { photo: '/StoneHouse.jpg', description: 'Beautiful community center building during spring', event: 'Spring Festival Concert', date: '2025-02-01', favourite: true },
    { photo: '/HeroPhoto.JPG', description: 'Participants enjoying traditional activities', event: 'Chinese New Year Dumpling Making', date: '2025-01-22', favourite: true },
    { photo: '/StoneHouse.jpg', description: 'Health professionals conducting wellness checks', event: 'Health Screening Day', date: '2025-01-21', favourite: true },
    { photo: '/HeroPhoto.JPG', description: 'Artists showcasing their calligraphy work', event: 'Chinese Calligraphy Workshop', date: '2025-01-17', favourite: false },
    { photo: '/StoneHouse.jpg', description: 'Members practicing Tai Chi in the morning', event: 'Tai Chi in the Park', date: '2025-01-20', favourite: false },
    { photo: '/HeroPhoto.JPG', description: 'Traditional Chinese painting class in session', event: 'Traditional Chinese Painting Class', date: '2025-01-18', favourite: false },
    { photo: '/StoneHouse.jpg', description: 'Community lunch gathering with friends', event: 'Community Lunch', date: '2025-01-19', favourite: false },
    { photo: '/HeroPhoto.JPG', description: 'Expert speaker presenting health information', event: 'Senior Health & Wellness Workshop', date: '2025-01-15', favourite: false },
    { photo: '/StoneHouse.jpg', description: 'Morning exercise group in action', event: 'Morning Exercise Group', date: '2025-01-16', favourite: false },
    { photo: '/HeroPhoto.JPG', description: 'Technology help session for seniors', event: 'Technology Help Desk', date: '2025-01-24', favourite: false },
    { photo: '/StoneHouse.jpg', description: 'Classic film screening event', event: 'Movie Afternoon: Classic Films', date: '2025-01-28', favourite: false },
    { photo: '/HeroPhoto.JPG', description: 'Mahjong tournament participants', event: 'Mahjong Tournament', date: '2025-01-23', favourite: false },
    { photo: '/StoneHouse.jpg', description: 'Garden club members sharing tips', event: 'Garden Club Meeting', date: '2025-01-26', favourite: false },
    { photo: '/HeroPhoto.JPG', description: 'Language class students practicing', event: 'Chinese Language Class', date: '2025-01-27', favourite: false },
    { photo: '/StoneHouse.jpg', description: 'Karaoke night celebration', event: 'Karaoke Night', date: '2025-01-29', favourite: false },
    { photo: '/HeroPhoto.JPG', description: 'Book club discussion session', event: 'Book Club Discussion', date: '2025-01-30', favourite: false },
    { photo: '/StoneHouse.jpg', description: 'Yoga class for seniors', event: 'Yoga for Seniors', date: '2025-01-31', favourite: false },
    { photo: '/HeroPhoto.JPG', description: 'Dim sum cooking class demonstration', event: 'Cooking Class: Dim Sum', date: '2025-02-02', favourite: false },
    { photo: '/StoneHouse.jpg', description: 'Computer basics workshop participants', event: 'Computer Basics Workshop', date: '2025-02-03', favourite: false },
];
async function seedPhotos() {
    try {
        console.log('📸 Seeding photos database...\n');
        // Check if photos already exist
        const existingPhotos = await query('SELECT COUNT(*) as count FROM photos');
        const count = parseInt(existingPhotos.rows[0].count);
        if (count > 0) {
            console.log(`ℹ️  Found ${count} existing photos. Adding new ones...\n`);
        }
        let inserted = 0;
        let skipped = 0;
        for (const photo of samplePhotos) {
            try {
                await query('INSERT INTO photos (photo, description, event, date, favourite) VALUES ($1, $2, $3, $4, $5)', [photo.photo, photo.description, photo.event, photo.date, photo.favourite]);
                inserted++;
                console.log(`   ✅ Inserted: ${photo.event} - ${photo.date}`);
            }
            catch (error) {
                if (error.code === '23505') { // Unique constraint violation
                    skipped++;
                    console.log(`   ℹ️  Skipped (already exists): ${photo.event}`);
                }
                else {
                    console.error(`   ❌ Error inserting ${photo.event}:`, error.message);
                }
            }
        }
        console.log(`\n✅ Photos seeding complete!`);
        console.log(`   Inserted: ${inserted} photos`);
        console.log(`   Skipped: ${skipped} photos (already exist)`);
        // Show final count
        const finalCount = await query('SELECT COUNT(*) as count FROM photos');
        console.log(`   Total photos in database: ${finalCount.rows[0].count}\n`);
    }
    catch (error) {
        console.error('❌ Error seeding photos:', error.message);
        process.exit(1);
    }
    finally {
        await closeDatabase();
    }
}
seedPhotos();
