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
  start_date: string;
  end_date: string;
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
    title: 'Lantern Farewell Night',
    date: '2026-03-02',
    time: '18:30:00',
    end_time: '20:30:00',
    location: 'Community Hall',
    category: 'Holiday',
    description: 'A festive evening with lantern displays, performances, and family activities to close the season.',
    featured: true,
    image_url: null,
  },
  {
    title: 'Spring Wellness Checkpoint',
    date: '2026-03-04',
    time: '10:00:00',
    end_time: '12:30:00',
    location: 'Room 102',
    category: 'Health',
    description: 'Basic wellness checks and guidance with community health volunteers.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Ink Painting Studio',
    date: '2026-03-06',
    time: '13:30:00',
    end_time: '15:30:00',
    location: 'Art Studio',
    category: 'Arts',
    description: 'Guided Chinese ink painting session for beginners and returning artists.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Tai Chi Sunrise Session',
    date: '2026-03-08',
    time: '08:30:00',
    end_time: '09:30:00',
    location: 'Garden Courtyard',
    category: 'Fitness',
    description: 'A gentle morning Tai Chi class focused on balance and breathing.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Dumpling Basics Lab',
    date: '2026-03-10',
    time: '11:00:00',
    end_time: '13:00:00',
    location: 'Kitchen Studio',
    category: 'Cooking',
    description: 'Hands-on dumpling folding and filling techniques for all experience levels.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Mandarin Conversation Lab',
    date: '2026-03-12',
    time: '18:00:00',
    end_time: '19:30:00',
    location: 'Library Room A',
    category: 'Learning',
    description: 'A practical speaking session for beginner and intermediate Mandarin learners.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Neighborhood Potluck Evening',
    date: '2026-03-14',
    time: '17:30:00',
    end_time: '19:30:00',
    location: 'Community Hall',
    category: 'Social',
    description: 'Bring a favorite dish and connect with neighbors in a welcoming evening gathering.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Qingming Community Memorial',
    date: '2026-03-18',
    time: '14:00:00',
    end_time: '15:30:00',
    location: 'Room 102',
    category: 'Holiday',
    description: 'A remembrance gathering exploring Qingming traditions and family stories.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Mindful Breathing Workshop',
    date: '2026-03-20',
    time: '16:00:00',
    end_time: '17:30:00',
    location: 'Library Room A',
    category: 'Health',
    description: 'Learn breathing and stress reduction practices for daily wellbeing.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Traditional Music Open Rehearsal',
    date: '2026-03-22',
    time: '19:00:00',
    end_time: '20:30:00',
    location: 'Community Hall',
    category: 'Arts',
    description: 'Open rehearsal showcasing traditional instruments and ensemble pieces.',
    featured: true,
    image_url: null,
  },
  {
    title: 'Family Stretch and Move',
    date: '2026-03-24',
    time: '10:00:00',
    end_time: '11:00:00',
    location: 'Community Hall',
    category: 'Fitness',
    description: 'A low-impact fitness class designed for families of all ages.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Healthy Wok Cooking Class',
    date: '2026-03-26',
    time: '17:00:00',
    end_time: '19:00:00',
    location: 'Kitchen Studio',
    category: 'Cooking',
    description: 'Cook lighter stir-fry meals with nutrition-minded ingredient swaps.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Small Business Resource Talk',
    date: '2026-03-28',
    time: '18:30:00',
    end_time: '20:00:00',
    location: 'Room 201',
    category: 'Learning',
    description: 'Tips and resources for local entrepreneurs and first-time business owners.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Newcomer Meet and Greet',
    date: '2026-03-30',
    time: '17:30:00',
    end_time: '19:00:00',
    location: 'Community Hall',
    category: 'Social',
    description: 'A welcoming social event to help new members connect with the community.',
    featured: true,
    image_url: null,
  },
  {
    title: 'Spring Festival Family Day',
    date: '2026-04-04',
    time: '11:00:00',
    end_time: '14:00:00',
    location: 'Community Hall',
    category: 'Holiday',
    description: 'Family-focused holiday celebration with games, performances, and food.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Community Blood Pressure Clinic',
    date: '2026-04-08',
    time: '09:30:00',
    end_time: '12:00:00',
    location: 'Room 102',
    category: 'Health',
    description: 'Drop-in blood pressure checks and health education for residents.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Youth Arts Showcase',
    date: '2026-04-12',
    time: '17:30:00',
    end_time: '19:30:00',
    location: 'Community Hall',
    category: 'Arts',
    description: 'Student art and performance showcase highlighting spring projects.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Weekend Walking Club',
    date: '2026-04-16',
    time: '09:00:00',
    end_time: '10:30:00',
    location: 'Center Parking Lot',
    category: 'Fitness',
    description: 'Guided neighborhood walking group for cardio and social movement.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Tea and Pastry Workshop',
    date: '2026-04-20',
    time: '14:00:00',
    end_time: '16:00:00',
    location: 'Kitchen Studio',
    category: 'Cooking',
    description: 'Pair teas with simple pastries and learn preparation techniques.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Senior Digital Skills Clinic',
    date: '2026-04-24',
    time: '13:00:00',
    end_time: '15:00:00',
    location: 'Computer Lab',
    category: 'Learning',
    description: 'Hands-on guidance for messaging apps, online forms, and device settings.',
    featured: false,
    image_url: null,
  },
  {
    title: 'Volunteer Appreciation Mixer',
    date: '2026-04-28',
    time: '18:00:00',
    end_time: '20:00:00',
    location: 'Community Hall',
    category: 'Social',
    description: 'A relaxed social evening celebrating volunteers and community partners.',
    featured: false,
    image_url: null,
  },
];

const seedPrograms: SeedProgram[] = [
  {
    title: 'Spring Festival Craft Workshop',
    category: 'Holiday',
    icon: 'Calendar',
    schedule: 'March 2026 Saturdays, 11:00 AM - 12:30 PM',
    age_group: 'All Ages',
    description: 'Family-focused holiday craft projects inspired by spring celebration themes.',
    spots: '20 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-03-31',
  },
  {
    title: 'Holiday Story Circle',
    category: 'Holiday',
    icon: 'Calendar',
    schedule: 'March-April 2026 Wednesdays, 6:30 PM - 7:30 PM',
    age_group: 'All Ages',
    description: 'Community storytelling sessions centered on seasonal traditions and memories.',
    spots: '18 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Lantern Art and Culture Lab',
    category: 'Holiday',
    icon: 'Palette',
    schedule: 'April 2026 Sundays, 1:00 PM - 3:00 PM',
    age_group: 'All Ages',
    description: 'Create decorative lanterns while learning the cultural significance behind designs.',
    spots: '16 spots available',
    image_url: null,
    start_date: '2026-04-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Community Wellness Basics',
    category: 'Health',
    icon: 'Heart',
    schedule: 'March-April 2026 Mondays, 10:00 AM - 11:00 AM',
    age_group: 'Adults',
    description: 'Foundational health literacy workshops covering sleep, hydration, and stress care.',
    spots: '22 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Nutrition for Busy Families',
    category: 'Health',
    icon: 'Heart',
    schedule: 'March-April 2026 Thursdays, 6:00 PM - 7:00 PM',
    age_group: 'Adults',
    description: 'Practical nutrition guidance and meal planning strategies for households.',
    spots: '20 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Breathing and Calm Practice',
    category: 'Health',
    icon: 'Heart',
    schedule: 'April 2026 Tuesdays, 5:30 PM - 6:30 PM',
    age_group: 'All Ages',
    description: 'Guided breathing and mindfulness practice to support daily wellbeing.',
    spots: '24 spots available',
    image_url: null,
    start_date: '2026-04-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Chinese Brush Painting Studio',
    category: 'Arts',
    icon: 'Palette',
    schedule: 'March-April 2026 Tuesdays, 10:00 AM - 12:00 PM',
    age_group: 'All Ages',
    description: 'Explore brush control, composition, and traditional painting techniques.',
    spots: '14 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Community Choir Workshop',
    category: 'Arts',
    icon: 'Music',
    schedule: 'March-April 2026 Fridays, 7:00 PM - 8:30 PM',
    age_group: 'All Ages',
    description: 'Develop vocal harmony and perform multicultural repertoire together.',
    spots: '25 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Youth Creative Media Lab',
    category: 'Arts',
    icon: 'Camera',
    schedule: 'April 2026 Saturdays, 2:00 PM - 4:00 PM',
    age_group: '13-18',
    description: 'Hands-on visual storytelling through photo composition and short video projects.',
    spots: '12 spots available',
    image_url: null,
    start_date: '2026-04-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Beginner Tai Chi Flow',
    category: 'Fitness',
    icon: 'Dumbbell',
    schedule: 'March-April 2026 Mon/Wed/Fri, 9:00 AM - 10:00 AM',
    age_group: '55+',
    description: 'Gentle movement sessions to improve balance, mobility, and coordination.',
    spots: '15 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Low Impact Strength Circuit',
    category: 'Fitness',
    icon: 'Dumbbell',
    schedule: 'March-April 2026 Tuesdays, 6:00 PM - 7:00 PM',
    age_group: 'Adults',
    description: 'Progressive strength training with low-impact routines and coaching.',
    spots: '18 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Weekend Walking Club',
    category: 'Fitness',
    icon: 'Dumbbell',
    schedule: 'March-April 2026 Saturdays, 8:30 AM - 9:30 AM',
    age_group: 'All Ages',
    description: 'Social group walks focused on light cardio and consistent activity habits.',
    spots: '30 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Family Dumpling Kitchen',
    category: 'Cooking',
    icon: 'Utensils',
    schedule: 'March 2026 Sundays, 11:30 AM - 1:30 PM',
    age_group: 'All Ages',
    description: 'Learn filling prep and folding techniques in a hands-on family format.',
    spots: '16 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-03-31',
  },
  {
    title: 'Healthy Wok Techniques',
    category: 'Cooking',
    icon: 'Utensils',
    schedule: 'April 2026 Wednesdays, 5:30 PM - 7:30 PM',
    age_group: 'Adults',
    description: 'Cook balanced stir-fry meals with practical ingredient and seasoning methods.',
    spots: '14 spots available',
    image_url: null,
    start_date: '2026-04-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Tea and Pastry Pairing',
    category: 'Cooking',
    icon: 'Utensils',
    schedule: 'April 2026 Sundays, 2:00 PM - 4:00 PM',
    age_group: 'All Ages',
    description: 'Match tea styles with simple pastry recipes in an interactive tasting class.',
    spots: '18 spots available',
    image_url: null,
    start_date: '2026-04-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Mandarin Conversation Circle',
    category: 'Learning',
    icon: 'BookOpen',
    schedule: 'March-April 2026 Wednesdays, 1:00 PM - 2:30 PM',
    age_group: 'All Ages',
    description: 'Practice daily Mandarin conversation in a supportive peer-learning environment.',
    spots: '12 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Digital Skills for Seniors',
    category: 'Learning',
    icon: 'Laptop',
    schedule: 'March-April 2026 Thursdays, 2:00 PM - 3:30 PM',
    age_group: '55+',
    description: 'Build confidence using smartphones, messaging, and online service portals.',
    spots: '10 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Youth Leadership Fundamentals',
    category: 'Learning',
    icon: 'GraduationCap',
    schedule: 'April 2026 Tuesdays, 4:30 PM - 6:00 PM',
    age_group: '13-18',
    description: 'Develop communication, teamwork, and goal-setting strategies for youth leaders.',
    spots: '15 spots available',
    image_url: null,
    start_date: '2026-04-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Senior Social Tea Hour',
    category: 'Social',
    icon: 'Users',
    schedule: 'March-April 2026 Mondays, 2:00 PM - 3:30 PM',
    age_group: '55+',
    description: 'A relaxed tea hour for connection, conversation, and light activities.',
    spots: '26 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Community Potluck Club',
    category: 'Social',
    icon: 'Users',
    schedule: 'March-April 2026 Fridays, 6:30 PM - 8:30 PM',
    age_group: 'All Ages',
    description: 'Monthly potluck gatherings to share meals and strengthen neighborhood ties.',
    spots: '28 spots available',
    image_url: null,
    start_date: '2026-03-01',
    end_date: '2026-04-30',
  },
  {
    title: 'Newcomer Welcome Circle',
    category: 'Social',
    icon: 'Users',
    schedule: 'April 2026 Sundays, 4:00 PM - 5:30 PM',
    age_group: 'All Ages',
    description: 'A friendly orientation and social meetup for new members and families.',
    spots: '24 spots available',
    image_url: null,
    start_date: '2026-04-01',
    end_date: '2026-04-30',
  },
];

const seedPhotos: SeedPhoto[] = [
  {
    photo: '/HeroPhoto.JPG',
    description: 'Community members gathering at the center for spring programming',
    event: 'Spring Wellness Fair',
    date: '2026-03-07',
    favourite: true,
  },
  {
    photo: '/StoneHouse.jpg',
    description: 'Beautiful community center building during spring',
    event: 'Intergenerational Tea Ceremony',
    date: '2026-04-16',
    favourite: true,
  },
  {
    photo: '/HeroPhoto.JPG',
    description: 'Participants enjoying a family workshop activity',
    event: 'Family Dumpling Workshop',
    date: '2026-03-28',
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

async function deleteAllRows(table: 'events' | 'programs' | 'photos') {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?id=not.is.null`, {
    method: 'DELETE',
    headers: {
      ...headers,
      Prefer: 'return=minimal',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to clear ${table}: ${response.status} ${text}`);
  }
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

async function reseedEvents(rows: unknown[]): Promise<void> {
  const existingCount = await getCount('events');
  if (existingCount > 0) {
    console.log(`Clearing events: deleting ${existingCount} existing rows`);
    await deleteAllRows('events');
  }

  const inserted = await insertRows('events', rows);
  console.log(`Reseeded events: inserted ${inserted} rows`);
}

async function reseedPrograms(rows: unknown[]): Promise<void> {
  const existingCount = await getCount('programs');
  if (existingCount > 0) {
    console.log(`Clearing programs: deleting ${existingCount} existing rows`);
    await deleteAllRows('programs');
  }

  const inserted = await insertRows('programs', rows);
  console.log(`Reseeded programs: inserted ${inserted} rows`);
}

async function main() {
  try {
    console.log('Seeding Supabase via REST (serverless mode)...');
    await reseedEvents(seedEvents);
    await reseedPrograms(seedPrograms);
    await seedTable('photos', seedPhotos);
    console.log('Done.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
