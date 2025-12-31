// API service layer for database communication
// Supports both mock data (development) and real API (production)

import type { Event, Program } from './data-service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'; // Default to true if not set

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

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
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

  // Use mock data if no API URL is configured or if explicitly enabled
  if (USE_MOCK_DATA || !API_BASE_URL) {
    const events = await fetchMockEvents();
    eventsCache = { data: events, timestamp: Date.now() };
    return events;
  }

  try {
    // Build query parameters
    const params = new URLSearchParams();
    // Add any filter parameters here if needed
    
    const events = await apiRequest<Event[]>(`/events?${params.toString()}`);
    eventsCache = { data: events, timestamp: Date.now() };
    return events;
  } catch (error) {
    console.error('Failed to fetch events from API, falling back to mock data:', error);
    // Fallback to mock data on error
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
  // Use mock data if no API URL is configured or if explicitly enabled
  if (USE_MOCK_DATA || !API_BASE_URL) {
    const event = await fetchMockEventById(id);
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }
    return event;
  }

  try {
    return await apiRequest<Event>(`/events/${id}`);
  } catch (error) {
    console.error(`Failed to fetch event ${id} from API, falling back to mock data:`, error);
    // Fallback to mock data on error
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot create events with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create event');
    }

    clearEventsCache(); // Clear cache after creating
    return response.json();
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot update events with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update event');
    }

    clearEventsCache(); // Clear cache after updating
    return response.json();
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot delete events with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete event');
    }

    clearEventsCache(); // Clear cache after deleting
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
  // Use mock data if no API URL is configured or if explicitly enabled
  if (USE_MOCK_DATA || !API_BASE_URL) {
    const allEvents = await fetchMockEvents();
    // Apply filters client-side
    return allEvents.filter(event => {
      if (filters.category && event.category !== filters.category) return false;
      if (filters.featured !== undefined && event.featured !== filters.featured) return false;
      // Date filtering would require parsing dates - simplified for now
      return true;
    });
  }

  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.featured !== undefined) params.append('featured', String(filters.featured));

    return await apiRequest<Event[]>(`/events?${params.toString()}`);
  } catch (error) {
    console.error('Failed to fetch filtered events from API, falling back to mock data:', error);
    // Fallback to mock data on error
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

  // Use mock data if no API URL is configured or if explicitly enabled
  if (USE_MOCK_DATA || !API_BASE_URL) {
    // Import mock programs data
    const { fetchPrograms: fetchMockPrograms } = await import('./mock-api');
    const programs = await fetchMockPrograms();
    programsCache = { data: programs, timestamp: Date.now() };
    return programs;
  }

  try {
    const programs = await apiRequest<Program[]>(`/programs`);
    programsCache = { data: programs, timestamp: Date.now() };
    return programs;
  } catch (error) {
    console.error('Failed to fetch programs from API, falling back to mock data:', error);
    // Fallback to mock data on error
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
  // Use mock data if no API URL is configured or if explicitly enabled
  if (USE_MOCK_DATA || !API_BASE_URL) {
    const { fetchProgramById: fetchMockProgramById } = await import('./mock-api');
    const program = await fetchMockProgramById(id);
    if (!program) {
      throw new Error(`Program with id ${id} not found`);
    }
    return program;
  }

  try {
    return await apiRequest<Program>(`/programs/${id}`);
  } catch (error) {
    console.error(`Failed to fetch program ${id} from API, falling back to mock data:`, error);
    // Fallback to mock data on error
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot create programs with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create program');
    }

    clearProgramsCache(); // Clear cache after creating
    return response.json();
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot update programs with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/programs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update program');
    }

    clearProgramsCache(); // Clear cache after updating
    return response.json();
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot delete programs with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/programs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete program');
    }

    clearProgramsCache(); // Clear cache after deleting
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
  // Use mock data if no API URL is configured or if explicitly enabled
  if (USE_MOCK_DATA || !API_BASE_URL) {
    const { fetchPrograms: fetchMockPrograms } = await import('./mock-api');
    const allPrograms = await fetchMockPrograms();
    // Apply filters client-side
    return allPrograms.filter(program => {
      if (filters.category && program.category !== filters.category) return false;
      if (filters.ageGroup && program.ageGroup !== filters.ageGroup) return false;
      return true;
    });
  }

  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.ageGroup) params.append('ageGroup', filters.ageGroup);

    return await apiRequest<Program[]>(`/programs?${params.toString()}`);
  } catch (error) {
    console.error('Failed to fetch filtered programs from API, falling back to mock data:', error);
    // Fallback to mock data on error
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

  // Use mock data if no API URL is configured or if explicitly enabled
  if (USE_MOCK_DATA || !API_BASE_URL) {
    // Return empty array for now - can add mock photos later if needed
    const photos: Photo[] = [];
    photosCache = { data: photos, timestamp: Date.now() };
    return photos;
  }

  try {
    const photos = await apiRequest<Photo[]>(`/photos`);
    photosCache = { data: photos, timestamp: Date.now() };
    return photos;
  } catch (error) {
    console.error('Failed to fetch photos from API:', error);
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    return [];
  }

  try {
    return await apiRequest<Photo[]>(`/photos?favourite=true`);
  } catch (error) {
    console.error('Failed to fetch favourite photos from API:', error);
    return [];
  }
}

/**
 * Fetch photos by year
 * @param year - Year (e.g., 2024)
 * @returns Promise<Photo[]>
 */
export async function fetchPhotosByYear(year: number): Promise<Photo[]> {
  if (USE_MOCK_DATA || !API_BASE_URL) {
    return [];
  }

  try {
    return await apiRequest<Photo[]>(`/photos?year=${year}`);
  } catch (error) {
    console.error(`Failed to fetch photos for year ${year} from API:`, error);
    return [];
  }
}

/**
 * Fetch photos by event
 * @param event - Event name
 * @returns Promise<Photo[]>
 */
export async function fetchPhotosByEvent(event: string): Promise<Photo[]> {
  if (USE_MOCK_DATA || !API_BASE_URL) {
    return [];
  }

  try {
    return await apiRequest<Photo[]>(`/photos?event=${encodeURIComponent(event)}`);
  } catch (error) {
    console.error(`Failed to fetch photos for event ${event} from API:`, error);
    return [];
  }
}

/**
 * Create a new photo
 * @param photo - Photo data (without id)
 * @returns Promise<Photo>
 */
export async function createPhoto(photo: Omit<Photo, 'id'>): Promise<Photo> {
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot create photos with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create photo');
    }

    photosCache = null; // Clear cache after creating
    return response.json();
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot update photos with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photo),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update photo');
    }

    photosCache = null; // Clear cache after updating
    return response.json();
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
  if (USE_MOCK_DATA || !API_BASE_URL) {
    throw new Error('Cannot delete photos with mock data. Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete photo');
    }

    photosCache = null; // Clear cache after deleting
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
 * Upload a photo file
 * @param file - File object from input
 * @returns Promise with file path
 */
export async function uploadPhoto(file: File): Promise<string> {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  
  if (!API_BASE_URL) {
    throw new Error('API base URL not configured. Set VITE_API_BASE_URL');
  }

  const formData = new FormData();
  formData.append('photo', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload/photo`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload photo');
    }

    const result = await response.json();
    return result.filePath;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
}

