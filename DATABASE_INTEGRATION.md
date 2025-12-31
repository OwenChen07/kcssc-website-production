# Database Integration Guide

This guide explains how to integrate a database with the calendar feature for Events and Programs.

## Current Architecture

The application currently uses mock data arrays (`allEvents` and `allPrograms`) in the component files. The data service (`src/lib/data-service.ts`) provides helper functions that work with this data structure.

## Database Integration Steps

### 1. Create API Service Layer

Create a new file `src/lib/api-service.ts` to handle database communication:

```typescript
// src/lib/api-service.ts
import type { Event, Program } from './data-service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Events API
export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
}

export async function fetchEventById(id: number): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }
  return response.json();
}

// Programs API
export async function fetchPrograms(): Promise<Program[]> {
  const response = await fetch(`${API_BASE_URL}/programs`);
  if (!response.ok) {
    throw new Error('Failed to fetch programs');
  }
  return response.json();
}

export async function fetchProgramById(id: number): Promise<Program> {
  const response = await fetch(`${API_BASE_URL}/programs/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch program');
  }
  return response.json();
}
```

### 2. Update Events Page

Replace the mock data with API calls:

```typescript
// src/pages/Events.tsx
import { useState, useEffect } from "react";
import { fetchEvents, type Event } from "@/lib/api-service";
// ... other imports

export default function Events() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ... existing state

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        const events = await fetchEvents();
        setAllEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  // ... rest of component
}
```

### 3. Update Programs Page

Similar approach for Programs:

```typescript
// src/pages/Programs.tsx
import { useState, useEffect } from "react";
import { fetchPrograms, type Program } from "@/lib/api-service";
// ... other imports

export default function Programs() {
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ... existing state

  useEffect(() => {
    async function loadPrograms() {
      try {
        setIsLoading(true);
        const programs = await fetchPrograms();
        setAllPrograms(programs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load programs');
      } finally {
        setIsLoading(false);
      }
    }
    loadPrograms();
  }, []);

  // ... rest of component
}
```

### 4. Database Schema Examples

#### Events Table (SQL)

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  end_time TIME,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
```

#### Programs Table (SQL)

```sql
CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  schedule VARCHAR(255) NOT NULL, -- e.g., "Tuesdays, 10:00 AM - 12:00 PM"
  age_group VARCHAR(50) NOT NULL,
  description TEXT,
  spots VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_programs_category ON programs(category);
CREATE INDEX idx_programs_age_group ON programs(age_group);
```

### 5. Backend API Examples

#### Express.js Example

```javascript
// server/routes/events.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Your database connection

// Get all events
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    if (startDate) {
      query += ' AND date >= $' + (params.length + 1);
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= $' + (params.length + 1);
      params.push(endDate);
    }

    query += ' ORDER BY date ASC, time ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

#### Next.js API Route Example

```typescript
// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = 'SELECT * FROM events WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    if (startDate) {
      query += ' AND date >= $' + (params.length + 1);
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= $' + (params.length + 1);
      params.push(endDate);
    }

    query += ' ORDER BY date ASC, time ASC';

    const result = await db.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 6. Date Format Considerations

The `parseDate` function in `data-service.ts` handles various date formats. Ensure your database returns dates in a format that can be parsed:

**Recommended formats:**
- ISO 8601: `"2025-01-25"`
- Full date string: `"January 25, 2025"`
- Timestamp: `"2025-01-25T00:00:00Z"`

**Database Query Example:**
```sql
-- PostgreSQL
SELECT 
  id,
  title,
  TO_CHAR(date, 'Month DD, YYYY') as date, -- Format for display
  date::text as date_iso, -- ISO format for parsing
  time,
  location,
  category,
  description,
  featured
FROM events;
```

### 7. Caching and Performance

For better performance, consider implementing caching:

```typescript
// src/lib/api-service.ts
let eventsCache: { data: Event[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchEvents(useCache = true): Promise<Event[]> {
  const now = Date.now();
  
  if (useCache && eventsCache && (now - eventsCache.timestamp) < CACHE_DURATION) {
    return eventsCache.data;
  }

  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  
  const data = await response.json();
  eventsCache = { data, timestamp: now };
  return data;
}
```

### 8. Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 9. Error Handling

Add proper error handling and loading states:

```typescript
// In your component
{isLoading && (
  <div className="text-center py-16">
    <p className="text-muted-foreground">Loading events...</p>
  </div>
)}

{error && (
  <div className="text-center py-16">
    <p className="text-destructive mb-4">{error}</p>
    <Button onClick={() => window.location.reload()}>Retry</Button>
  </div>
)}

{!isLoading && !error && (
  // Your calendar/list view
)}
```

### 10. Real-time Updates (Optional)

For real-time updates, consider using WebSockets or Server-Sent Events:

```typescript
// src/lib/api-service.ts
export function subscribeToEvents(callback: (events: Event[]) => void) {
  const eventSource = new EventSource(`${API_BASE_URL}/events/stream`);
  
  eventSource.onmessage = (event) => {
    const events = JSON.parse(event.data);
    callback(events);
  };
  
  return () => eventSource.close();
}
```

## Migration Checklist

- [ ] Create database tables with proper schema
- [ ] Set up backend API endpoints
- [ ] Create API service layer in frontend
- [ ] Replace mock data with API calls
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test date parsing with real database dates
- [ ] Implement caching if needed
- [ ] Set up environment variables
- [ ] Test calendar functionality with database data
- [ ] Add pagination if needed for large datasets

## Testing

After integration, test:
1. Calendar displays events/programs correctly
2. Date clicking works
3. Filters work with database queries
4. Search functionality
5. Loading and error states
6. Performance with large datasets

