// Data service to simulate database operations
// In production, this would connect to your actual database

export interface Event {
  id: number;
  title: string;
  date: string; // ISO date string or "January 25, 2025"
  time: string;
  location: string;
  category: string;
  description: string;
  featured: boolean;
  imageUrl?: string;
}

export interface Program {
  id: number;
  title: string;
  category: string;
  icon: string;
  schedule: string; // e.g., "Tuesdays, 10:00 AM - 12:00 PM" or "Mon/Wed/Fri, 9:00 AM - 10:00 AM"
  ageGroup: string;
  description: string;
  spots: string;
  imageUrl?: string;
}

// Convert date string to Date object
export function parseDate(dateString: string): Date {
  // Handle formats like "January 25, 2025"
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }
  // Fallback to current date if parsing fails
  return new Date();
}

// Get all events for a specific date
export function getEventsForDate(events: Event[], date: Date): Event[] {
  return events.filter(event => {
    const eventDate = parseDate(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
}

// Parse program schedule to get dates
// This is a simplified version - in production, you'd want more robust parsing
export function getProgramDatesForMonth(program: Program, year: number, month: number): Date[] {
  const dates: Date[] = [];
  const schedule = program.schedule.toLowerCase();
  
  // Parse day patterns
  const dayPatterns: { [key: string]: number[] } = {
    'monday': [1],
    'mon': [1],
    'tuesday': [2],
    'tue': [2],
    'wednesday': [3],
    'wed': [3],
    'thursday': [4],
    'thu': [4],
    'friday': [5],
    'fri': [5],
    'saturday': [6],
    'sat': [6],
    'sunday': [0],
    'sun': [0],
  };

  // Find matching days
  const matchingDays: number[] = [];
  for (const [pattern, dayNumbers] of Object.entries(dayPatterns)) {
    if (schedule.includes(pattern)) {
      matchingDays.push(...dayNumbers);
    }
  }

  // If no specific days found, return empty (could be a one-time event)
  if (matchingDays.length === 0) {
    return dates;
  }

  // Get all dates in the month that match the day of week
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (matchingDays.includes(date.getDay())) {
      dates.push(date);
    }
  }

  return dates;
}

// Get all programs for a specific date
export function getProgramsForDate(programs: Program[], date: Date): Program[] {
  return programs.filter(program => {
    const programDates = getProgramDatesForMonth(
      program,
      date.getFullYear(),
      date.getMonth()
    );
    return programDates.some(programDate => 
      programDate.getDate() === date.getDate() &&
      programDate.getMonth() === date.getMonth() &&
      programDate.getFullYear() === date.getFullYear()
    );
  });
}

