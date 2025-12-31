// Simulated database/API service
// In production, this would connect to your actual database

import type { Event, Program } from "./data-service";

// Simulated database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Hardcoded events data (simulating database records)
const databaseEvents: Event[] = [
  {
    id: 1,
    title: "Lunar New Year Celebration",
    date: "January 25, 2025",
    time: "11:00 AM - 3:00 PM",
    location: "Community Hall",
    category: "Holiday",
    description: "Join us for our biggest celebration of the year with traditional performances, food, and festivities.",
    featured: true,
  },
  {
    id: 2,
    title: "Senior Health & Wellness Workshop",
    date: "January 15, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Room 102",
    category: "Health",
    description: "Learn about maintaining health and wellness with expert speakers and interactive sessions.",
    featured: false,
  },
  {
    id: 3,
    title: "Traditional Chinese Painting Class",
    date: "January 18, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Art Room",
    category: "Arts",
    description: "Explore the beautiful art of Chinese brush painting with our experienced instructors.",
    featured: false,
  },
  {
    id: 4,
    title: "Tai Chi in the Park",
    date: "January 20, 2025",
    time: "9:00 AM - 10:00 AM",
    location: "Kanata Park",
    category: "Fitness",
    description: "Start your morning with gentle Tai Chi exercises in the fresh air.",
    featured: false,
  },
  {
    id: 5,
    title: "Chinese New Year Dumpling Making",
    date: "January 22, 2025",
    time: "1:00 PM - 4:00 PM",
    location: "Kitchen",
    category: "Cooking",
    description: "Learn to make traditional dumplings for the New Year celebration.",
    featured: true,
  },
  {
    id: 6,
    title: "Technology Help Desk",
    date: "January 24, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Computer Lab",
    category: "Learning",
    description: "Get one-on-one help with your smartphone, tablet, or computer questions.",
    featured: false,
  },
  {
    id: 7,
    title: "Movie Afternoon: Classic Films",
    date: "January 28, 2025",
    time: "2:00 PM - 4:30 PM",
    location: "Community Hall",
    category: "Social",
    description: "Enjoy a classic Chinese film with friends and refreshments.",
    featured: false,
  },
  {
    id: 8,
    title: "Spring Festival Concert",
    date: "February 1, 2025",
    time: "7:00 PM - 9:00 PM",
    location: "Community Hall",
    category: "Holiday",
    description: "A special evening of traditional music and performances celebrating the Spring Festival.",
    featured: true,
  },
  {
    id: 9,
    title: "Morning Exercise Group",
    date: "January 16, 2025",
    time: "8:00 AM - 9:00 AM",
    location: "Community Hall",
    category: "Fitness",
    description: "Join our morning exercise group for a healthy start to your day.",
    featured: false,
  },
  {
    id: 10,
    title: "Chinese Calligraphy Workshop",
    date: "January 17, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Art Room",
    category: "Arts",
    description: "Learn the art of Chinese calligraphy with master calligraphers.",
    featured: false,
  },
  {
    id: 11,
    title: "Community Lunch",
    date: "January 19, 2025",
    time: "12:00 PM - 2:00 PM",
    location: "Dining Hall",
    category: "Social",
    description: "Enjoy a community lunch with friends and neighbors.",
    featured: false,
  },
  {
    id: 12,
    title: "Health Screening Day",
    date: "January 21, 2025",
    time: "10:00 AM - 3:00 PM",
    location: "Room 101",
    category: "Health",
    description: "Free health screenings including blood pressure, glucose, and more.",
    featured: true,
  },
  {
    id: 13,
    title: "Mahjong Tournament",
    date: "January 23, 2025",
    time: "1:00 PM - 5:00 PM",
    location: "Game Room",
    category: "Social",
    description: "Join our monthly Mahjong tournament. All skill levels welcome.",
    featured: false,
  },
  {
    id: 14,
    title: "Garden Club Meeting",
    date: "January 26, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Room 103",
    category: "Social",
    description: "Monthly meeting of the community garden club. Share tips and seeds!",
    featured: false,
  },
  {
    id: 15,
    title: "Chinese Language Class",
    date: "January 27, 2025",
    time: "10:00 AM - 11:30 AM",
    location: "Classroom A",
    category: "Learning",
    description: "Beginner-friendly Chinese language class. Practice conversation and characters.",
    featured: false,
  },
  {
    id: 16,
    title: "Karaoke Night",
    date: "January 29, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Community Hall",
    category: "Social",
    description: "Sing your favorite Chinese and English songs with friends!",
    featured: false,
  },
  {
    id: 17,
    title: "Book Club Discussion",
    date: "January 30, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Library",
    category: "Learning",
    description: "Monthly book club meeting. This month: Chinese literature classics.",
    featured: false,
  },
  {
    id: 18,
    title: "Yoga for Seniors",
    date: "January 31, 2025",
    time: "9:00 AM - 10:00 AM",
    location: "Activity Room",
    category: "Fitness",
    description: "Gentle yoga class designed specifically for seniors.",
    featured: false,
  },
  {
    id: 19,
    title: "Cooking Class: Dim Sum",
    date: "February 2, 2025",
    time: "11:00 AM - 2:00 PM",
    location: "Kitchen",
    category: "Cooking",
    description: "Learn to make traditional dim sum dishes from scratch.",
    featured: true,
  },
  {
    id: 20,
    title: "Computer Basics Workshop",
    date: "February 3, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Computer Lab",
    category: "Learning",
    description: "Introduction to computers for beginners. Learn the basics step by step.",
    featured: false,
  },
];

/**
 * Simulates fetching events from a database
 * In production, this would be: fetch('/api/events')
 */
export async function fetchEvents(): Promise<Event[]> {
  // Simulate network delay (1-2 seconds)
  await delay(1000 + Math.random() * 1000);
  
  // Simulate database query
  return [...databaseEvents];
}

/**
 * Simulates fetching a single event by ID
 */
export async function fetchEventById(id: number): Promise<Event | null> {
  await delay(500);
  return databaseEvents.find(event => event.id === id) || null;
}

// Hardcoded programs data (simulating database records)
const databasePrograms: Program[] = [
  {
    id: 1,
    title: "Chinese Brush Painting",
    category: "Arts & Crafts",
    icon: "Palette",
    schedule: "Tuesdays, 10:00 AM - 12:00 PM",
    ageGroup: "All Ages",
    description: "Learn traditional Chinese brush painting techniques from experienced instructors. All skill levels welcome.",
    spots: "12 spots available",
  },
  {
    id: 2,
    title: "Tai Chi for Beginners",
    category: "Health & Wellness",
    icon: "Heart",
    schedule: "Mon/Wed/Fri, 9:00 AM - 10:00 AM",
    ageGroup: "55+",
    description: "Gentle Tai Chi movements to improve balance, flexibility, and mental clarity.",
    spots: "8 spots available",
  },
  {
    id: 3,
    title: "Chinese Folk Dance",
    category: "Music & Dance",
    icon: "Music",
    schedule: "Thursdays, 2:00 PM - 4:00 PM",
    ageGroup: "All Ages",
    description: "Learn beautiful traditional Chinese dances in a fun, supportive environment.",
    spots: "6 spots available",
  },
  {
    id: 4,
    title: "Mandarin Conversation Circle",
    category: "Language & Learning",
    icon: "BookOpen",
    schedule: "Wednesdays, 1:00 PM - 2:30 PM",
    ageGroup: "All Ages",
    description: "Practice conversational Mandarin with fellow learners in a relaxed setting.",
    spots: "10 spots available",
  },
  {
    id: 5,
    title: "Cooking: Regional Cuisines",
    category: "Social & Dining",
    icon: "Utensils",
    schedule: "Saturdays, 11:00 AM - 1:00 PM",
    ageGroup: "All Ages",
    description: "Explore dishes from different regions of China. Taste and learn together!",
    spots: "8 spots available",
  },
  {
    id: 6,
    title: "Gentle Exercise Class",
    category: "Fitness Programs",
    icon: "Dumbbell",
    schedule: "Tuesdays/Thursdays, 11:00 AM - 12:00 PM",
    ageGroup: "65+",
    description: "Low-impact exercises designed specifically for seniors to maintain mobility and strength.",
    spots: "15 spots available",
  },
  {
    id: 7,
    title: "Chinese Calligraphy",
    category: "Arts & Crafts",
    icon: "Palette",
    schedule: "Fridays, 10:00 AM - 12:00 PM",
    ageGroup: "All Ages",
    description: "Master the art of Chinese calligraphy, from basic strokes to complete characters.",
    spots: "10 spots available",
  },
  {
    id: 8,
    title: "Choir & Singing Group",
    category: "Music & Dance",
    icon: "Music",
    schedule: "Wednesdays, 3:00 PM - 5:00 PM",
    ageGroup: "All Ages",
    description: "Join our community choir singing Chinese and international songs.",
    spots: "Open enrollment",
  },
  {
    id: 9,
    title: "Computer Skills Workshop",
    category: "Language & Learning",
    icon: "BookOpen",
    schedule: "Mondays, 2:00 PM - 4:00 PM",
    ageGroup: "55+",
    description: "Learn to use smartphones, tablets, and computers with patient, step-by-step guidance.",
    spots: "6 spots available",
  },
];

/**
 * Simulates fetching programs from a database
 * In production, this would be: fetch('/api/programs')
 */
export async function fetchPrograms(): Promise<Program[]> {
  // Simulate network delay (1-2 seconds)
  await delay(1000 + Math.random() * 1000);
  
  // Simulate database query
  return [...databasePrograms];
}

/**
 * Simulates fetching a single program by ID
 */
export async function fetchProgramById(id: number): Promise<Program | null> {
  await delay(500);
  return databasePrograms.find(program => program.id === id) || null;
}

