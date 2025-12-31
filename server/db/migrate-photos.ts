// Migration script to add photos table
// Run this to add the photos table to an existing database

import dotenv from 'dotenv';
import { resolve } from 'path';
import { query, pool, closeDatabase } from './connection';

// Load .env
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function migratePhotos() {
  try {
    console.log('📦 Running photos table migration...\n');

    // Check if photos table already exists
    const checkTable = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'photos'
      );
    `);

    if (checkTable.rows[0].exists) {
      console.log('ℹ️  Photos table already exists. Migration not needed.\n');
      await closeDatabase();
      return;
    }

    console.log('📄 Creating photos table...\n');

    // Create photos table
    await query(`
      CREATE TABLE photos (
        id SERIAL PRIMARY KEY,
        photo VARCHAR(500) NOT NULL,
        description TEXT,
        event VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        favourite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('   ✅ Photos table created');

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_photos_date ON photos(date);`);
    console.log('   ✅ Index on date created');

    await query(`CREATE INDEX IF NOT EXISTS idx_photos_event ON photos(event);`);
    console.log('   ✅ Index on event created');

    await query(`CREATE INDEX IF NOT EXISTS idx_photos_favourite ON photos(favourite);`);
    console.log('   ✅ Index on favourite created');

    // Create trigger for updated_at
    await query(`
      CREATE TRIGGER update_photos_updated_at 
      BEFORE UPDATE ON photos
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('   ✅ Trigger for updated_at created');

    console.log('\n✅ Photos table migration completed successfully!\n');

    // Verify table exists
    const verifyTable = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'photos';
    `);

    if (verifyTable.rows.length > 0) {
      console.log('✅ Verified: photos table exists');
    }

  } catch (error: any) {
    console.error('❌ Error running migration:', error.message);
    if (error.code === '42P07') {
      console.log('ℹ️  Table may already exist');
    }
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

migratePhotos();


