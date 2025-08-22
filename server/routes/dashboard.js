import express from 'express';
import { getDatabase } from '../config/database.js';
import { requireAuth } from './auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get dashboard summary data for a specific date
router.get('/summary', async (req, res) => {
  try {
    const { date } = req.query;
    const selectedDate = date || new Date().toISOString().split('T')[0];
    const db = getDatabase();
    
    // Get total hens count by shed
    const hensData = await db.all(`
      SELECT 
        s.shed_number,
        COALESCE(ss.present_hens, 0) as hen_count
      FROM sheds s
      LEFT JOIN shed_status ss ON s.id = ss.shed_id AND ss.date = ?
      ORDER BY s.shed_number
    `, [selectedDate]);
    
    // Get total mortality by shed
    const mortalityData = await db.all(`
      SELECT 
        s.shed_number,
        COALESCE(m.count, 0) as mortality_count
      FROM sheds s
      LEFT JOIN mortality m ON s.id = m.shed_id AND m.date = ?
      ORDER BY s.shed_number
    `, [selectedDate]);
    
    // Get total egg trays stock by shed
    const stockData = await db.all(`
      SELECT 
        s.shed_number,
        COALESCE(p.egg_trays, 0) as tray_stock
      FROM sheds s
      LEFT JOIN production p ON s.id = p.shed_id AND p.date = ?
      ORDER BY s.shed_number
    `, [selectedDate]);
    
    // Get total egg trays selling by shed
    const salesData = await db.all(`
      SELECT 
        s.shed_number,
        COALESCE(sl.trays_sold, 0) as trays_sold
      FROM sheds s
      LEFT JOIN sales sl ON s.id = sl.shed_id AND sl.date = ?
      ORDER BY s.shed_number
    `, [selectedDate]);
    
    // Get total feed in gudam (warehouse)
    const gudamData = await db.all(`
      SELECT 
        feed_type,
        quantity_kg
      FROM gudam 
      WHERE date = ?
      ORDER BY feed_type
    `, [selectedDate]);
    
    // Calculate totals
    const totalHens = hensData.reduce((sum, item) => sum + item.hen_count, 0);
    const totalMortality = mortalityData.reduce((sum, item) => sum + item.mortality_count, 0);
    const totalStock = stockData.reduce((sum, item) => sum + item.tray_stock, 0);
    const totalSales = salesData.reduce((sum, item) => sum + item.trays_sold, 0);
    const totalFeed = gudamData.reduce((sum, item) => sum + parseFloat(item.quantity_kg), 0);
    
    res.json({
      date: selectedDate,
      totalHens: {
        total: totalHens,
        breakdown: hensData
      },
      totalMortality: {
        total: totalMortality,
        breakdown: mortalityData
      },
      totalStock: {
        total: totalStock,
        breakdown: stockData
      },
      totalSales: {
        total: totalSales,
        breakdown: salesData
      },
      totalFeed: {
        total: totalFeed,
        breakdown: gudamData
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get gudam (warehouse) data
router.get('/gudam', async (req, res) => {
  try {
    const { date } = req.query;
    const selectedDate = date || new Date().toISOString().split('T')[0];
    const db = getDatabase();
    
    const gudamData = await db.all(`
      SELECT 
        feed_type,
        quantity_kg
      FROM gudam 
      WHERE date = ?
      ORDER BY feed_type
    `, [selectedDate]);
    
    res.json(gudamData);
    
  } catch (error) {
    console.error('Error fetching gudam data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add/Update gudam data
router.post('/gudam', async (req, res) => {
  try {
    const { date, feedData } = req.body;
    const db = getDatabase();
    
    if (!date || !feedData || !Array.isArray(feedData)) {
      return res.status(400).json({ error: 'Date and feed data array are required' });
    }
    
    // Delete existing data for the date
    await db.run('DELETE FROM gudam WHERE date = ?', [date]);
    
    // Insert new data
    for (const feed of feedData) {
      if (feed.feed_type && feed.quantity_kg !== undefined) {
        await db.run(
          'INSERT INTO gudam (feed_type, quantity_kg, date) VALUES (?, ?, ?)',
          [feed.feed_type, feed.quantity_kg, date]
        );
      }
    }
    
    res.json({ message: 'Gudam data saved successfully' });
    
  } catch (error) {
    console.error('Error saving gudam data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get historical data for charts
router.get('/history', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const db = getDatabase();
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    // Get daily totals for the date range
    const historyData = await db.all(`
      SELECT 
        ss.date,
        SUM(COALESCE(ss.present_hens, 0)) as total_hens,
        SUM(COALESCE(m.count, 0)) as total_mortality,
        SUM(COALESCE(p.egg_trays, 0)) as total_production,
        SUM(COALESCE(sl.trays_sold, 0)) as total_sales,
        SUM(COALESCE(f.quantity_kg, 0)) as total_feed
      FROM sheds s
      LEFT JOIN shed_status ss ON s.id = ss.shed_id 
      LEFT JOIN mortality m ON s.id = m.shed_id AND m.date = ss.date
      LEFT JOIN production p ON s.id = p.shed_id AND p.date = ss.date
      LEFT JOIN sales sl ON s.id = sl.shed_id AND sl.date = ss.date
      LEFT JOIN feed f ON s.id = f.shed_id AND f.date = ss.date
      WHERE ss.date BETWEEN ? AND ?
      GROUP BY ss.date
      ORDER BY ss.date
    `, [startDate, endDate]);
    
    res.json(historyData);
    
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
