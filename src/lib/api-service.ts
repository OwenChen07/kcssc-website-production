// API service layer using Supabase client directly
// Supports both mock data (development) and Supabase (production)

import type { Event, Program } from './data-service';
import { supabase, TABLES, STORAGE_BUCKET } from './supabase-client';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'; // Default to true if not set
const SUPABASE_ENABLED = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

// Import mock API functions as fallback
import { fetchEvents as fetchMockEvents, fetchEventById as fetchMockEventById } from './mock-api';

// Cache configuration
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let eventsCache: CacheEntry<Event[]> | null = null;
let programsCache: CacheEntry<Program[]> | null = null;

// Helper function to check if cache is valid
function isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
  if (!cache) return false;
  const now = Date.now();
  return (now - cache.timestamp) < CACHE_DURATION;
}

// ==================== Helper Functions ====================

// Format date for display (converts "2025-01-25" to "January 25, 2025")
function formatDateForDisplay(date: string): string {
  const d = new Date(date);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Format time for display (converts "10:00:00" to "10:00 AM")
function formatTime(time: string, endTime?: string | null): string {
  const formatTime = (t: string) => {
    // Handle both "HH:MM:SS" and "HH:MM" formats
    const parts = t.split(':');
    const hour = parseInt(parts[0]);
    const minutes = parts[1] || '00';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (endTime) {
    return `${formatTime(time)} - ${formatTime(endTime)}`;
  }
  return formatTime(time);
}

// Parse time from display format to database format ("10:00 AM" -> "10:00:00")
function parseTime(timeStr: string): string {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3]?.toUpperCase();
    
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
  }
  return timeStr; // Assume already in HH:MM:SS format
}

// Parse date from display format to database format ("January 25, 2025" -> "2025-01-25")
function parseDate(dateStr: string): string {
  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Try to parse formatted date
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  // Fallback: try to parse as-is
  return dateStr;
}

// Transform database row to Event interface
function transformEventRow(row: any): Event {
  return {
    id: row.id,
    title: row.title,
    date: formatDateForDisplay(row.date),
    time: formatTime(row.time, row.end_time),
    location: row.location,
    category: row.category,
    description: row.description || '',
    featured: row.featured || false,
    imageUrl: row.image_url || undefined,
  };
}

// Transform Event interface to database row
function transformEventToRow(event: Partial<Event>): any {
  const row: any = {};
  if (event.title !== undefined) row.title = event.title;
  if (event.date !== undefined) row.date = parseDate(event.date);
  if (event.time !== undefined) {
    const timeParts = event.time.split(' - ');
    row.time = parseTime(timeParts[0]);
    if (timeParts[1]) {
      row.end_time = parseTime(timeParts[1]);
    }
  }
  if (event.location !== undefined) row.location = event.location;
  if (event.category !== undefined) row.category = event.category;
  if (event.description !== undefined) row.description = event.description;
  if (event.featured !== undefined) row.featured = event.featured;
  if (event.imageUrl !== undefined) row.image_url = event.imageUrl || null;
  return row;
}

// Transform database row to Program interface
function transformProgramRow(row: any): Program {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    icon: row.icon,
    schedule: row.schedule,
    ageGroup: row.age_group,
    description: row.description || '',
    spots: row.spots || '',
    imageUrl: row.image_url || undefined,
  };
}

// Transform Program interface to database row
function transformProgramToRow(program: Partial<Program>): any {
  const row: any = {};
  if (program.title !== undefined) row.title = program.title;
  if (program.category !== undefined) row.category = program.category;
  if (program.icon !== undefined) row.icon = program.icon;
  if (program.schedule !== undefined) row.schedule = program.schedule;
  if (program.ageGroup !== undefined) row.age_group = program.ageGroup;
  if (program.description !== undefined) row.description = program.description;
  if (program.spots !== undefined) row.spots = program.spots || null;
  if (program.imageUrl !== undefined) row.image_url = program.imageUrl || null;
  return row;
}

// ==================== Events API ====================

/**
 * Fetch all events from the database
 * @param useCache - Whether to use cached data if available (default: true)
 * @returns Promise<Event[]>
 */
export async function fetchEvents(useCache = true): Promise<Event[]> {
  // Check cache first
  if (useCache && isCacheValid(eventsCache)) {
    return eventsCache!.data;
  }

  // Use mock data if enabled or if Supabase is not configured
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    const events = await fetchMockEvents();
    eventsCache = { data: events, timestamp: Date.now() };
    return events;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.EVENTS)
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;

    const events = (data || []).map(transformEventRow);
    eventsCache = { data: events, timestamp: Date.now() };
    return events;
  } catch (error) {
    console.error('Failed to fetch events from Supabase, falling back to mock data:', error);
    const events = await fetchMockEvents();
    eventsCache = { data: events, timestamp: Date.now() };
    return events;
  }
}

/**
 * Fetch a single event by ID
 * @param id - Event ID
 * @returns Promise<Event>
 */
export async function fetchEventById(id: number): Promise<Event> {
  // Use mock data if enabled or if Supabase is not configured
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    const event = await fetchMockEventById(id);
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }
    return event;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.EVENTS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Event with id ${id} not found`);

    return transformEventRow(data);
  } catch (error) {
    console.error(`Failed to fetch event ${id} from Supabase, falling back to mock data:`, error);
    const event = await fetchMockEventById(id);
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }
    return event;
  }
}

/**
 * Create a new event
 * @param event - Event data (without id)
 * @returns Promise<Event>
 */
export async function createEvent(event: Omit<Event, 'id'>): Promise<Event> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot create events with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const row = transformEventToRow(event);
    
    const { data, error } = await supabase
      .from(TABLES.EVENTS)
      .insert(row)
      .select()
      .single();

    if (error) throw error;

    clearEventsCache();
    return transformEventRow(data);
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * Update an existing event
 * @param id - Event ID
 * @param event - Updated event data
 * @returns Promise<Event>
 */
export async function updateEvent(id: number, event: Partial<Event>): Promise<Event> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot update events with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const row = transformEventToRow(event);
    
    const { data, error } = await supabase
      .from(TABLES.EVENTS)
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Event with id ${id} not found`);

    clearEventsCache();
    return transformEventRow(data);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * Delete an event
 * @param id - Event ID
 * @returns Promise<void>
 */
export async function deleteEvent(id: number): Promise<void> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot delete events with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const { error } = await supabase
      .from(TABLES.EVENTS)
      .delete()
      .eq('id', id);

    if (error) throw error;

    clearEventsCache();
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/**
 * Fetch events with filters
 * @param filters - Filter options
 * @returns Promise<Event[]>
 */
export interface EventFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  featured?: boolean;
}

export async function fetchEventsWithFilters(filters: EventFilters): Promise<Event[]> {
  // Use mock data if enabled or if Supabase is not configured
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    const allEvents = await fetchMockEvents();
    // Apply filters client-side
    return allEvents.filter(event => {
      if (filters.category && event.category !== filters.category) return false;
      if (filters.featured !== undefined && event.featured !== filters.featured) return false;
      return true;
    });
  }

  try {
    let query = supabase.from(TABLES.EVENTS).select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.startDate) {
      query = query.gte('date', parseDate(filters.startDate));
    }
    if (filters.endDate) {
      query = query.lte('date', parseDate(filters.endDate));
    }
    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const { data, error } = await query.order('date', { ascending: true }).order('time', { ascending: true });

    if (error) throw error;

    return (data || []).map(transformEventRow);
  } catch (error) {
    console.error('Failed to fetch filtered events from Supabase, falling back to mock data:', error);
    const allEvents = await fetchMockEvents();
    return allEvents.filter(event => {
      if (filters.category && event.category !== filters.category) return false;
      if (filters.featured !== undefined && event.featured !== filters.featured) return false;
      return true;
    });
  }
}

// ==================== Programs API ====================

/**
 * Fetch all programs from the database
 * @param useCache - Whether to use cached data if available (default: true)
 * @returns Promise<Program[]>
 */
export async function fetchPrograms(useCache = true): Promise<Program[]> {
  // Check cache first
  if (useCache && isCacheValid(programsCache)) {
    return programsCache!.data;
  }

  // Use mock data if enabled or if Supabase is not configured
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    const { fetchPrograms: fetchMockPrograms } = await import('./mock-api');
    const programs = await fetchMockPrograms();
    programsCache = { data: programs, timestamp: Date.now() };
    return programs;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PROGRAMS)
      .select('*')
      .order('title', { ascending: true });

    if (error) throw error;

    const programs = (data || []).map(transformProgramRow);
    programsCache = { data: programs, timestamp: Date.now() };
    return programs;
  } catch (error) {
    console.error('Failed to fetch programs from Supabase, falling back to mock data:', error);
    const { fetchPrograms: fetchMockPrograms } = await import('./mock-api');
    const programs = await fetchMockPrograms();
    programsCache = { data: programs, timestamp: Date.now() };
    return programs;
  }
}

/**
 * Fetch a single program by ID
 * @param id - Program ID
 * @returns Promise<Program>
 */
export async function fetchProgramById(id: number): Promise<Program> {
  // Use mock data if enabled or if Supabase is not configured
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    const { fetchProgramById: fetchMockProgramById } = await import('./mock-api');
    const program = await fetchMockProgramById(id);
    if (!program) {
      throw new Error(`Program with id ${id} not found`);
    }
    return program;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PROGRAMS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Program with id ${id} not found`);

    return transformProgramRow(data);
  } catch (error) {
    console.error(`Failed to fetch program ${id} from Supabase, falling back to mock data:`, error);
    const { fetchProgramById: fetchMockProgramById } = await import('./mock-api');
    const program = await fetchMockProgramById(id);
    if (!program) {
      throw new Error(`Program with id ${id} not found`);
    }
    return program;
  }
}

/**
 * Create a new program
 * @param program - Program data (without id)
 * @returns Promise<Program>
 */
export async function createProgram(program: Omit<Program, 'id'>): Promise<Program> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot create programs with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const row = transformProgramToRow(program);
    
    const { data, error } = await supabase
      .from(TABLES.PROGRAMS)
      .insert(row)
      .select()
      .single();

    if (error) throw error;

    clearProgramsCache();
    return transformProgramRow(data);
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
}

/**
 * Update an existing program
 * @param id - Program ID
 * @param program - Updated program data
 * @returns Promise<Program>
 */
export async function updateProgram(id: number, program: Partial<Program>): Promise<Program> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot update programs with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const row = transformProgramToRow(program);
    
    const { data, error } = await supabase
      .from(TABLES.PROGRAMS)
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Program with id ${id} not found`);

    clearProgramsCache();
    return transformProgramRow(data);
  } catch (error) {
    console.error('Error updating program:', error);
    throw error;
  }
}

/**
 * Delete a program
 * @param id - Program ID
 * @returns Promise<void>
 */
export async function deleteProgram(id: number): Promise<void> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot delete programs with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const { error } = await supabase
      .from(TABLES.PROGRAMS)
      .delete()
      .eq('id', id);

    if (error) throw error;

    clearProgramsCache();
  } catch (error) {
    console.error('Error deleting program:', error);
    throw error;
  }
}

/**
 * Fetch programs with filters
 * @param filters - Filter options
 * @returns Promise<Program[]>
 */
export interface ProgramFilters {
  category?: string;
  ageGroup?: string;
}

export async function fetchProgramsWithFilters(filters: ProgramFilters): Promise<Program[]> {
  // Use mock data if enabled or if Supabase is not configured
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    const { fetchPrograms: fetchMockPrograms } = await import('./mock-api');
    const allPrograms = await fetchMockPrograms();
    return allPrograms.filter(program => {
      if (filters.category && program.category !== filters.category) return false;
      if (filters.ageGroup && program.ageGroup !== filters.ageGroup) return false;
      return true;
    });
  }

  try {
    let query = supabase.from(TABLES.PROGRAMS).select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.ageGroup) {
      query = query.eq('age_group', filters.ageGroup);
    }

    const { data, error } = await query.order('title', { ascending: true });

    if (error) throw error;

    return (data || []).map(transformProgramRow);
  } catch (error) {
    console.error('Failed to fetch filtered programs from Supabase, falling back to mock data:', error);
    const { fetchPrograms: fetchMockPrograms } = await import('./mock-api');
    const allPrograms = await fetchMockPrograms();
    return allPrograms.filter(program => {
      if (filters.category && program.category !== filters.category) return false;
      if (filters.ageGroup && program.ageGroup !== filters.ageGroup) return false;
      return true;
    });
  }
}

// ==================== Cache Management ====================

/**
 * Clear the events cache
 */
export function clearEventsCache(): void {
  eventsCache = null;
}

/**
 * Clear the programs cache
 */
export function clearProgramsCache(): void {
  programsCache = null;
}

/**
 * Clear all caches
 */
export function clearAllCaches(): void {
  eventsCache = null;
  programsCache = null;
  photosCache = null;
}

// ==================== Photos API ====================

export interface Photo {
  id: number;
  photo: string; // URL or path to the photo
  description?: string;
  event: string; // Event name
  date: string; // YYYY-MM-DD format
  favourite: boolean;
}

let photosCache: CacheEntry<Photo[]> | null = null;

/**
 * Fetch all photos from the database
 * @param useCache - Whether to use cached data if available (default: true)
 * @returns Promise<Photo[]>
 */
export async function fetchPhotos(useCache = true): Promise<Photo[]> {
  // Check cache first
  if (useCache && isCacheValid(photosCache)) {
    return photosCache!.data;
  }

  // Use mock data if enabled or if Supabase is not configured
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    const photos: Photo[] = [];
    photosCache = { data: photos, timestamp: Date.now() };
    return photos;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PHOTOS)
      .select('*')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error) throw error;

    const photos = (data || []).map((row: any) => ({
      id: row.id,
      photo: row.photo,
      description: row.description || undefined,
      event: row.event,
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
      favourite: row.favourite || false,
    }));

    photosCache = { data: photos, timestamp: Date.now() };
    return photos;
  } catch (error) {
    console.error('Failed to fetch photos from Supabase:', error);
    const photos: Photo[] = [];
    photosCache = { data: photos, timestamp: Date.now() };
    return photos;
  }
}

/**
 * Fetch favourite photos (for carousel)
 * @returns Promise<Photo[]>
 */
export async function fetchFavouritePhotos(): Promise<Photo[]> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PHOTOS)
      .select('*')
      .eq('favourite', true)
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      photo: row.photo,
      description: row.description || undefined,
      event: row.event,
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
      favourite: row.favourite || false,
    }));
  } catch (error) {
    console.error('Failed to fetch favourite photos from Supabase:', error);
    return [];
  }
}

/**
 * Fetch photos by year
 * @param year - Year (e.g., 2024)
 * @returns Promise<Photo[]>
 */
export async function fetchPhotosByYear(year: number): Promise<Photo[]> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    return [];
  }

  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from(TABLES.PHOTOS)
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      photo: row.photo,
      description: row.description || undefined,
      event: row.event,
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
      favourite: row.favourite || false,
    }));
  } catch (error) {
    console.error(`Failed to fetch photos for year ${year} from Supabase:`, error);
    return [];
  }
}

/**
 * Fetch photos by event
 * @param event - Event name
 * @returns Promise<Photo[]>
 */
export async function fetchPhotosByEvent(event: string): Promise<Photo[]> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PHOTOS)
      .select('*')
      .eq('event', event)
      .order('date', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      photo: row.photo,
      description: row.description || undefined,
      event: row.event,
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
      favourite: row.favourite || false,
    }));
  } catch (error) {
    console.error(`Failed to fetch photos for event ${event} from Supabase:`, error);
    return [];
  }
}

/**
 * Create a new photo
 * @param photo - Photo data (without id)
 * @returns Promise<Photo>
 */
export async function createPhoto(photo: Omit<Photo, 'id'>): Promise<Photo> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot create photos with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.PHOTOS)
      .insert({
        photo: photo.photo,
        description: photo.description || null,
        event: photo.event,
        date: photo.date,
        favourite: photo.favourite || false,
      })
      .select()
      .single();

    if (error) throw error;

    photosCache = null;
    return {
      id: data.id,
      photo: data.photo,
      description: data.description || undefined,
      event: data.event,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      favourite: data.favourite || false,
    };
  } catch (error) {
    console.error('Error creating photo:', error);
    throw error;
  }
}

/**
 * Update an existing photo
 * @param id - Photo ID
 * @param photo - Updated photo data
 * @returns Promise<Photo>
 */
export async function updatePhoto(id: number, photo: Partial<Photo>): Promise<Photo> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot update photos with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const updates: any = {};
    if (photo.photo !== undefined) updates.photo = photo.photo;
    if (photo.description !== undefined) updates.description = photo.description || null;
    if (photo.event !== undefined) updates.event = photo.event;
    if (photo.date !== undefined) updates.date = photo.date;
    if (photo.favourite !== undefined) updates.favourite = photo.favourite;

    const { data, error } = await supabase
      .from(TABLES.PHOTOS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Photo with id ${id} not found`);

    photosCache = null;
    return {
      id: data.id,
      photo: data.photo,
      description: data.description || undefined,
      event: data.event,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      favourite: data.favourite || false,
    };
  } catch (error) {
    console.error('Error updating photo:', error);
    throw error;
  }
}

/**
 * Delete a photo
 * @param id - Photo ID
 * @returns Promise<void>
 */
export async function deletePhoto(id: number): Promise<void> {
  if (USE_MOCK_DATA || !SUPABASE_ENABLED) {
    throw new Error('Cannot delete photos with mock data. Configure Supabase or set VITE_USE_MOCK_DATA=false');
  }

  try {
    const { error } = await supabase
      .from(TABLES.PHOTOS)
      .delete()
      .eq('id', id);

    if (error) throw error;

    photosCache = null;
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}

/**
 * Clear the photos cache
 */
export function clearPhotosCache(): void {
  photosCache = null;
}

/**
 * Upload a photo file to Supabase Storage
 * @param file - File object from input
 * @returns Promise with file URL
 */
export async function uploadPhoto(file: File): Promise<string> {
  if (!SUPABASE_ENABLED) {
    throw new Error('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1E9);
    const ext = file.name.split('.').pop();
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `${sanitizedName}-${timestamp}-${randomSuffix}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading photo to Supabase Storage:', error);
    throw error;
  }
}
