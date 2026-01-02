// Events API routes
import { Router } from 'express';
import { query } from '../db/connection.js';
const router = Router();
// Get all events with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, startDate, endDate, featured } = req.query;
        let sql = 'SELECT * FROM events WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (category) {
            sql += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }
        if (startDate) {
            sql += ` AND date >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }
        if (endDate) {
            sql += ` AND date <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }
        if (featured !== undefined) {
            sql += ` AND featured = $${paramIndex}`;
            params.push(featured === 'true');
            paramIndex++;
        }
        sql += ' ORDER BY date ASC, time ASC';
        const result = await query(sql, params);
        // Format dates for frontend
        const events = result.rows.map((row) => ({
            id: row.id,
            title: row.title,
            date: formatDateForDisplay(row.date),
            time: formatTime(row.time, row.end_time),
            location: row.location,
            category: row.category,
            description: row.description,
            featured: row.featured,
            imageUrl: row.image_url || undefined,
        }));
        res.json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const row = result.rows[0];
        const event = {
            id: row.id,
            title: row.title,
            date: formatDateForDisplay(row.date),
            time: formatTime(row.time, row.end_time),
            location: row.location,
            category: row.category,
            description: row.description,
            featured: row.featured,
            imageUrl: row.image_url || undefined,
        };
        res.json(event);
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Helper function to format date for display
function formatDateForDisplay(date) {
    const d = new Date(date);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
// Helper function to format time
function formatTime(time, endTime) {
    const formatTime = (t) => {
        const [hours, minutes] = t.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };
    if (endTime) {
        return `${formatTime(time)} - ${formatTime(endTime)}`;
    }
    return formatTime(time);
}
// Create new event
router.post('/', async (req, res) => {
    try {
        const { title, date, time, endTime, location, category, description, featured, imageUrl } = req.body;
        // Validate required fields
        if (!title || !date || !time || !location || !category || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Parse time strings to TIME format
        const parseTime = (timeStr) => {
            // Handle formats like "10:00 AM" or "10:00:00"
            const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
            if (match) {
                let hours = parseInt(match[1]);
                const minutes = match[2];
                const ampm = match[3]?.toUpperCase();
                if (ampm === 'PM' && hours !== 12)
                    hours += 12;
                if (ampm === 'AM' && hours === 12)
                    hours = 0;
                return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
            }
            return timeStr; // Assume already in HH:MM:SS format
        };
        const sql = `
      INSERT INTO events (title, date, time, end_time, location, category, description, featured, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
        const params = [
            title,
            date,
            parseTime(time),
            endTime ? parseTime(endTime) : null,
            location,
            category,
            description,
            featured || false,
            imageUrl || null,
        ];
        const result = await query(sql, params);
        const row = result.rows[0];
        res.status(201).json({
            id: row.id,
            title: row.title,
            date: formatDateForDisplay(row.date),
            time: formatTime(row.time, row.end_time),
            location: row.location,
            category: row.category,
            description: row.description,
            featured: row.featured,
            imageUrl: row.image_url || undefined,
        });
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update event
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, time, endTime, location, category, description, featured, imageUrl } = req.body;
        // Check if event exists
        const checkResult = await query('SELECT id FROM events WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const parseTime = (timeStr) => {
            const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
            if (match) {
                let hours = parseInt(match[1]);
                const minutes = match[2];
                const ampm = match[3]?.toUpperCase();
                if (ampm === 'PM' && hours !== 12)
                    hours += 12;
                if (ampm === 'AM' && hours === 12)
                    hours = 0;
                return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
            }
            return timeStr;
        };
        const sql = `
      UPDATE events 
      SET title = $1, date = $2, time = $3, end_time = $4, location = $5, 
          category = $6, description = $7, featured = $8, image_url = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `;
        const params = [
            title,
            date,
            parseTime(time),
            endTime ? parseTime(endTime) : null,
            location,
            category,
            description,
            featured || false,
            imageUrl || null,
            id,
        ];
        const result = await query(sql, params);
        const row = result.rows[0];
        res.json({
            id: row.id,
            title: row.title,
            date: formatDateForDisplay(row.date),
            time: formatTime(row.time, row.end_time),
            location: row.location,
            category: row.category,
            description: row.description,
            featured: row.featured,
            imageUrl: row.image_url || undefined,
        });
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete event
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully', id: parseInt(id) });
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
