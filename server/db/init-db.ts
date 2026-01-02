// Database initialization script
// Run this to create tables and optionally seed data

import dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { query, pool, closeDatabase } from './connection.js';

// Load .env
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function initializeDatabase() {
  try {
    console.log('📦 Initializing database...\n');

    // Read and execute schema
    const schemaPath = resolve(process.cwd(), 'server', 'db', 'schema.sql');
    console.log('📄 Reading schema from:', schemaPath);
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await query(statement + ';');
          console.log(`   ✅ Statement ${i + 1} executed`);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (error.message.includes('already exists') || error.code === '42P07') {
            console.log(`   ℹ️  Statement ${i + 1} skipped (already exists)`);
          } else {
            console.error(`   ❌ Statement ${i + 1} failed:`, error.message);
          }
        }
      }
    }

    console.log('\n✅ Database schema initialized successfully!\n');

    // Ask about seeding
    const seedData = process.argv.includes('--seed');
    if (seedData) {
      console.log('🌱 Seeding database with sample data...\n');
      const seedPath = resolve(process.cwd(), 'server', 'db', 'seed.sql');
      const seed = readFileSync(seedPath, 'utf-8');
      const seedStatements = seed
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (let i = 0; i < seedStatements.length; i++) {
        const statement = seedStatements[i];
        if (statement.trim()) {
          try {
            await query(statement + ';');
            console.log(`   ✅ Seed statement ${i + 1} executed`);
          } catch (error: any) {
            if (error.message.includes('already exists') || error.code === '23505') {
              console.log(`   ℹ️  Seed statement ${i + 1} skipped (data already exists)`);
            } else {
              console.error(`   ❌ Seed statement ${i + 1} failed:`, error.message);
            }
          }
        }
      }
      console.log('\n✅ Database seeded successfully!\n');
    } else {
      console.log('💡 To seed with sample data, run: npm run db:seed\n');
    }

    // Verify tables exist
    console.log('🔍 Verifying tables...\n');
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('📊 Tables in database:');
    tablesResult.rows.forEach((row: any) => {
      console.log(`   - ${row.table_name}`);
    });

    // Count records
    if (tablesResult.rows.length > 0) {
      console.log('\n📈 Record counts:');
      for (const row of tablesResult.rows) {
        const tableName = row.table_name;
        try {
          const countResult = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
          console.log(`   ${tableName}: ${countResult.rows[0].count} records`);
        } catch (error) {
          // Ignore errors
        }
      }
    }

    console.log('\n✅ Database initialization complete!');
  } catch (error: any) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

initializeDatabase();

