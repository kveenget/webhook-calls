const express = require('express');
const router = express.Router();
const pool = require('../db');

// Recibe el webhook de Retell
router.post('/webhook/retell', async (req, res) => {
  const { call_id, agent_id, call_status, duration_seconds, transcript } = req.body;

  try {
    await pool.query(
      `INSERT INTO calls (call_id, agent_id, status, duration_seconds, transcript)
       VALUES ($1, $2, $3, $4, $5)`,
      [call_id, agent_id, call_status, duration_seconds, transcript]
    );

    res.json({ success: true, message: 'Call saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save call' });
  }
});

// Lista todas las llamadas
router.get('/calls', async (req, res) => {
  const result = await pool.query('SELECT * FROM calls ORDER BY created_at DESC');
  res.json(result.rows);
});

module.exports = router;