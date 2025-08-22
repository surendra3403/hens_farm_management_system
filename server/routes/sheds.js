import express from 'express';
import { getDatabase } from '../config/database.js';
import { requireAuth } from './auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get all sheds with their daily data for a specific date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const selectedDate = date || new Date().toISOString().split('T')[0];
    const db = getDatabase();
    
    const sheds = await db.all(`
      SELECT 
        s.id,
        s.shed_number,
        s.capacity,
        COALESCE(ss.present_hens, 0) as present_hens,
        COALESCE(m.count, 0) as mortality,
        COALESCE(p.egg_trays, 0) as production,
        COALESCE(sl.trays_sold, 0) as sales,
        COALESCE(f.quantity_kg, 0) as feed,
        COALESCE(n.note, '') as notes
      FROM sheds s
      LEFT JOIN shed_status ss ON s.id = ss.shed_id AND ss.date = ?
      LEFT JOIN mortality m ON s.id = m.shed_id AND m.date = ?
      LEFT JOIN production p ON s.id = p.shed_id AND p.date = ?
      LEFT JOIN sales sl ON s.id = sl.shed_id AND sl.date = ?
      LEFT JOIN feed f ON s.id = f.shed_id AND f.date = ?
      LEFT JOIN notes n ON s.id = n.shed_id AND n.date = ?
      ORDER BY s.shed_number
    `, [selectedDate, selectedDate, selectedDate, selectedDate, selectedDate, selectedDate]);
    
    res.json(sheds);
  } catch (error) {
    console.error('Error fetching sheds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new shed
router.post('/', async (req, res) => {
  try {
    const { shed_number, capacity, present_hens } = req.body;
    const db = getDatabase();
    
    if (!shed_number || !capacity || !present_hens) {
      return res.status(400).json({ error: 'Shed number, capacity, and present hens are required' });
    }
    
    // Check if shed number already exists
    const existingSheds = await db.all(
      'SELECT id FROM sheds WHERE shed_number = ?',
      [shed_number]
    );
    
    if (existingSheds.length > 0) {
      return res.status(400).json({ error: 'Shed number already exists' });
    }
    
    // Insert new shed
    const shedResult = await db.run(
      'INSERT INTO sheds (shed_number, capacity) VALUES (?, ?)',
      [shed_number, capacity]
    );
    
    const shedId = shedResult.lastID;
    
    // Insert initial present hens count for today
    const today = new Date().toISOString().split('T')[0];
    await db.run(
      'INSERT INTO shed_status (shed_id, present_hens, date) VALUES (?, ?, ?)',
      [shedId, present_hens, today]
    );
    
    res.status(201).json({ 
      message: 'Shed created successfully',
      shed: { id: shedId, shed_number, capacity, present_hens }
    });
    
  } catch (error) {
    console.error('Error creating shed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update shed details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { shed_number, capacity } = req.body;
    const db = getDatabase();
    
    if (!shed_number || !capacity) {
      return res.status(400).json({ error: 'Shed number and capacity are required' });
    }
    
    // Check if shed number already exists for other sheds
    const existingSheds = await db.all(
      'SELECT id FROM sheds WHERE shed_number = ? AND id != ?',
      [shed_number, id]
    );
    
    if (existingSheds.length > 0) {
      return res.status(400).json({ error: 'Shed number already exists' });
    }
    
    // Update shed
    await db.run(
      'UPDATE sheds SET shed_number = ?, capacity = ? WHERE id = ?',
      [shed_number, capacity, id]
    );
    
    res.json({ message: 'Shed updated successfully' });
    
  } catch (error) {
    console.error('Error updating shed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete shed
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    await db.run('DELETE FROM sheds WHERE id = ?', [id]);
    
    res.json({ message: 'Shed deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting shed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save daily data for a shed
router.post('/:id/daily-data', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, mortality, production, sales, feed, notes, present_hens } = req.body;
    const db = getDatabase();
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    // Update or insert present hens
    if (present_hens !== undefined) {
      await db.run(`
        INSERT OR REPLACE INTO shed_status (shed_id, present_hens, date) 
        VALUES (?, ?, ?)
      `, [id, present_hens, date]);
    }
    
    // Update or insert mortality
    if (mortality !== undefined) {
      await db.run(`
        INSERT OR REPLACE INTO mortality (shed_id, count, date) 
        VALUES (?, ?, ?)
      `, [id, mortality, date]);
    }
    
    // Update or insert production
    if (production !== undefined) {
      await db.run(`
        INSERT OR REPLACE INTO production (shed_id, egg_trays, date) 
        VALUES (?, ?, ?)
      `, [id, production, date]);
    }
    
    // Update or insert sales
    if (sales !== undefined) {
      await db.run(`
        INSERT OR REPLACE INTO sales (shed_id, trays_sold, date) 
        VALUES (?, ?, ?)
      `, [id, sales, date]);
    }
    
    // Update or insert feed
    if (feed !== undefined) {
      await db.run(`
        INSERT OR REPLACE INTO feed (shed_id, quantity_kg, date) 
        VALUES (?, ?, ?)
      `, [id, feed, date]);
    }
    
    // Update or insert notes
    if (notes !== undefined) {
      await db.run(`
        INSERT OR REPLACE INTO notes (shed_id, note, date) 
        VALUES (?, ?, ?)
      `, [id, notes, date]);
    }
    
    res.json({ message: 'Daily data saved successfully' });
    
  } catch (error) {
    console.error('Error saving daily data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get shed details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const sheds = await db.all(
      'SELECT id, shed_number, capacity FROM sheds WHERE id = ?',
      [id]
    );
    
    if (sheds.length === 0) {
      return res.status(404).json({ error: 'Shed not found' });
    }
    
    res.json(sheds[0]);
    
  } catch (error) {
    console.error('Error fetching shed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
