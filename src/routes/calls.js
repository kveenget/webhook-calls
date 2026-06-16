const express = require('express');
const router = express.Router();
const { Retell } = require('retell-sdk');
const pool = require('../db');

function verifyRetellSignature(req, res, next) {
  const signature = req.headers['x-retell-signature'];
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  const valid = Retell.verify(
    req.rawBody,
    process.env.RETELL_API_KEY,
    signature
  );

  if (!valid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}

// Recibe el webhook de Retell
router.post('/webhook/retell', verifyRetellSignature, async (req, res) => {
  const { event, call } = req.body;

  if (!call || !call.call_id) {
    return res.status(400).json({ error: 'Missing call data' });
  }

  const durationSeconds = call.duration_ms
    ? Math.floor(call.duration_ms / 1000)
    : null;

  try {
    await pool.query(
      `INSERT INTO calls
        (call_id, agent_id, status, duration_seconds, transcript, event_type, raw_payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (call_id) DO UPDATE SET
         status = EXCLUDED.status,
         duration_seconds = COALESCE(EXCLUDED.duration_seconds, calls.duration_seconds),
         transcript = COALESCE(EXCLUDED.transcript, calls.transcript),
         event_type = EXCLUDED.event_type,
         raw_payload = EXCLUDED.raw_payload,
         updated_at = NOW()`,
      [
        call.call_id,
        call.agent_id,
        call.call_status,
        durationSeconds,
        call.transcript,
        event,
        call,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Failed to save call' });
  }
});

// Lista todas las llamadas
router.get('/calls', async (req, res) => {
  const result = await pool.query('SELECT * FROM calls ORDER BY created_at DESC');
  res.json(result.rows);
});

module.exports = router;
