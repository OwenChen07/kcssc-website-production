import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const headers = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

type SeedEvent = {
  title: string;
  date: string;
  time: string;
  end_time: string;
  location: string;
  category: string;
  description: string;
  featured: boolean;
  image_url: string | null;
};

type SeedProgram = {
  title: string;
  category: string;
  icon: string;
  schedule: string;
  age_group: string;
  description: string;
  spots: string;
  image_url: string | null;
};

type SeedPhoto = {
  photo: string;
  description: string;
  event: string;
  date: string;
  favourite: boolean;
};

const seedEvents: SeedEvent[] = [
  {
    title: 'Lunar New Year Celebration',
    date: '2025-01-25',
    time: '11:00:00',
    end_time: '15:00:00',
    location: 'Community Hall',
    category: 'Holiday',
    description: 'Join us for our biggest celebration of the year with traditional performances, food, and festivities.',
    featured: true,
    image_url: null,
  },
  {
    title: 'Senior Health & Wellness Workshop',
    date: '2025-01-15',
    time: '14:00:00',
    end_time: '16:00:00',
    location: 'Room 102',
    category: 'Health',
    description: 'Learn about maintaining health and wellness with expert speakers and interactive sessions.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Spring Festival Concert',
    date: '2025-02-01',
    time: '19:00:00',
    end_time: '21:00:00',
    location: 'Community Hall',
    category: 'Holiday',
    description: 'A special evening of traditional music and performances celebrating the Spring Festival.',
    featured: true,
    image_url: null,
  },
];

const seedPrograms: SeedProgram[] = [
  {
    title: 'Chinese Brush Painting',
    category: 'Arts & Crafts',
    icon: 'Palette',
    schedule: 'Tuesdays, 10:00 AM - 12:00 PM',
    age_group: 'All Ages',
    description: 'Learn traditional Chinese brush painting techniques from experienced instructors. All skill levels welcome.',
    spots: '12 spots available',
    image_url: null,
  },
  {
    title: 'Tai Chi for Beginners',
    category: 'Health & Wellness',
    icon: 'Heart',
    schedule: 'Mon/Wed/Fri, 9:00 AM - 10:00 AM',
    age_group: '55+',
    description: 'Gentle Tai Chi movements to improve balance, flexibility, and mental clarity.',
    spots: '8 spots available',
    image_url: null,
  },
  {
    title: 'Mandarin Conversation Circle',
    category: 'Language & Learning',
    icon: 'BookOpen',
    schedule: 'Wednesdays, 1:00 PM - 2:30 PM',
    age_group: 'All Ages',
    description: 'Practice conversational Mandarin with fellow learners in a relaxed setting.',
    spots: '10 spots available',
    image_url: null,
  },
];

const seedPhotos: SeedPhoto[] = [
  {
    photo: '/HeroPhoto.JPG',
    description: 'Community members gathering at the center for a special event',
    event: 'Lunar New Year Celebration',
    date: '2025-01-25',
    favourite: true,
  },
  {
    photo: '/StoneHouse.jpg',
    description: 'Beautiful community center building during spring',
    event: 'Spring Festival Concert',
    date: '2025-02-01',
    favourite: true,
  },
  {
    photo: '/HeroPhoto.JPG',
    description: 'Participants enjoying traditional activities',
    event: 'Senior Health & Wellness Workshop',
    date: '2025-01-15',
    favourite: false,
  },
];

async function getCount(table: 'events' | 'programs' | 'photos'): Promise<number> {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
    method: 'GET',
    headers: {
      ...headers,
      Prefer: 'count=exact',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to count ${table}: ${response.status} ${text}`);
  }

  const contentRange = response.headers.get('content-range') || '';
  const total = contentRange.split('/')[1];
  return total ? parseInt(total, 10) : 0;
}

async function insertRows(table: 'events' | 'programs' | 'photos', rows: unknown[]) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to insert ${table}: ${response.status} ${text}`);
  }

  const json = (await response.json()) as unknown[];
  return json.length;
}

async function seedTable(
  table: 'events' | 'programs' | 'photos',
  rows: unknown[]
): Promise<void> {
  const existingCount = await getCount(table);
  if (existingCount > 0) {
    console.log(`Skipping ${table}: already has ${existingCount} rows`);
    return;
  }

  const inserted = await insertRows(table, rows);
  console.log(`Seeded ${table}: inserted ${inserted} rows`);
}

async function main() {
  try {
    console.log('Seeding Supabase via REST (serverless mode)...');
    await seedTable('events', seedEvents);
    await seedTable('programs', seedPrograms);
    await seedTable('photos', seedPhotos);
    console.log('Done.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
