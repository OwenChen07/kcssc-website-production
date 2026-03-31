// Photos API routes
import { Router } from 'express';
import { query } from '../db/connection.js';
const router = Router();
// Get all photos with optional filters
router.get('/', async (req, res) => {
    try {
        const { favourite, event, year } = req.query;
        let sql = 'SELECT * FROM photos WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (favourite !== undefined) {
            sql += ` AND favourite = $${paramIndex}`;
            params.push(favourite === 'true');
            paramIndex++;
        }
        if (event) {
            sql += ` AND event = $${paramIndex}`;
            params.push(event);
            paramIndex++;
        }
        if (year) {
            sql += ` AND EXTRACT(YEAR FROM date) = $${paramIndex}`;
            params.push(year);
            paramIndex++;
        }
        sql += ' ORDER BY date DESC, id DESC';
        const result = await query(sql, params);
        // Format for frontend
        const photos = result.rows.map((row) => ({
            id: row.id,
            photo: row.photo,
            description: row.description || undefined,
            event: row.event,
            date: row.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            favourite: row.favourite,
        }));
        res.json(photos);
    }
    catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get photo by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM photos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        const row = result.rows[0];
        const photo = {
            id: row.id,
            photo: row.photo,
            description: row.description || undefined,
            event: row.event,
            date: row.date.toISOString().split('T')[0],
            favourite: row.favourite,
        };
        res.json(photo);
    }
    catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Create a new photo
router.post('/', async (req, res) => {
    try {
        const { photo, description, event, date, favourite } = req.body;
        // Validate required fields
        if (!photo || !event || !date) {
            return res.status(400).json({ error: 'Missing required fields: photo, event, date' });
        }
        const result = await query('INSERT INTO photos (photo, description, event, date, favourite) VALUES ($1, $2, $3, $4, $5) RETURNING *', [photo, description || null, event, date, favourite || false]);
        const row = result.rows[0];
        const newPhoto = {
            id: row.id,
            photo: row.photo,
            description: row.description || undefined,
            event: row.event,
            date: row.date.toISOString().split('T')[0],
            favourite: row.favourite,
        };
        res.status(201).json(newPhoto);
    }
    catch (error) {
        console.error('Error creating photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update a photo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { photo, description, event, date, favourite } = req.body;
        // Build update query dynamically based on provided fields
        const updates = [];
        const params = [];
        let paramIndex = 1;
        if (photo !== undefined) {
            updates.push(`photo = $${paramIndex}`);
            params.push(photo);
            paramIndex++;
        }
        if (description !== undefined) {
            updates.push(`description = $${paramIndex}`);
            params.push(description || null);
            paramIndex++;
        }
        if (event !== undefined) {
            updates.push(`event = $${paramIndex}`);
            params.push(event);
            paramIndex++;
        }
        if (date !== undefined) {
            updates.push(`date = $${paramIndex}`);
            params.push(date);
            paramIndex++;
        }
        if (favourite !== undefined) {
            updates.push(`favourite = $${paramIndex}`);
            params.push(favourite);
            paramIndex++;
        }
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        params.push(id);
        const sql = `UPDATE photos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await query(sql, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        const row = result.rows[0];
        const updatedPhoto = {
            id: row.id,
            photo: row.photo,
            description: row.description || undefined,
            event: row.event,
            date: row.date.toISOString().split('T')[0],
            favourite: row.favourite,
        };
        res.json(updatedPhoto);
    }
    catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete a photo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM photos WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
