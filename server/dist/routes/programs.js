// Programs API routes
import { Router } from 'express';
import { query } from '../db/connection.js';
const router = Router();
// Get all programs with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, ageGroup } = req.query;
        let sql = 'SELECT * FROM programs WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (category) {
            sql += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }
        if (ageGroup) {
            sql += ` AND age_group = $${paramIndex}`;
            params.push(ageGroup);
            paramIndex++;
        }
        sql += ' ORDER BY title ASC';
        const result = await query(sql, params);
        // Format for frontend
        const programs = result.rows.map((row) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            icon: row.icon,
            schedule: row.schedule,
            ageGroup: row.age_group,
            description: row.description,
            spots: row.spots,
            imageUrl: row.image_url || undefined,
        }));
        res.json(programs);
    }
    catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get program by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM programs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Program not found' });
        }
        const row = result.rows[0];
        const program = {
            id: row.id,
            title: row.title,
            category: row.category,
            icon: row.icon,
            schedule: row.schedule,
            ageGroup: row.age_group,
            description: row.description,
            spots: row.spots,
            imageUrl: row.image_url || undefined,
        };
        res.json(program);
    }
    catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Create new program
router.post('/', async (req, res) => {
    try {
        const { title, category, icon, schedule, ageGroup, description, spots, imageUrl } = req.body;
        // Validate required fields
        if (!title || !category || !icon || !schedule || !ageGroup || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const sql = `
      INSERT INTO programs (title, category, icon, schedule, age_group, description, spots, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
        const params = [
            title,
            category,
            icon,
            schedule,
            ageGroup,
            description,
            spots || null,
            imageUrl || null,
        ];
        const result = await query(sql, params);
        const row = result.rows[0];
        res.status(201).json({
            id: row.id,
            title: row.title,
            category: row.category,
            icon: row.icon,
            schedule: row.schedule,
            ageGroup: row.age_group,
            description: row.description,
            spots: row.spots,
            imageUrl: row.image_url || undefined,
        });
    }
    catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update program
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, icon, schedule, ageGroup, description, spots, imageUrl } = req.body;
        // Check if program exists
        const checkResult = await query('SELECT id FROM programs WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Program not found' });
        }
        const sql = `
      UPDATE programs 
      SET title = $1, category = $2, icon = $3, schedule = $4, age_group = $5, 
          description = $6, spots = $7, image_url = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
        const params = [
            title,
            category,
            icon,
            schedule,
            ageGroup,
            description,
            spots || null,
            imageUrl || null,
            id,
        ];
        const result = await query(sql, params);
        const row = result.rows[0];
        res.json({
            id: row.id,
            title: row.title,
            category: row.category,
            icon: row.icon,
            schedule: row.schedule,
            ageGroup: row.age_group,
            description: row.description,
            spots: row.spots,
            imageUrl: row.image_url || undefined,
        });
    }
    catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Delete program
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM programs WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Program not found' });
        }
        res.json({ message: 'Program deleted successfully', id: parseInt(id) });
    }
    catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
