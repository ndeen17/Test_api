const router = require('express').Router();
const { insertLog, getLogs } = require('../db');
const { isAllowed } = require('../rateLimiter');

router.post('/request', (req, res) => {
  const { user_id, payload } = req.body;

  if (!user_id || payload === undefined) {
    return res.status(400).json({ error: 'user_id and payload are required' });
  }

  const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);

  if (!isAllowed(user_id)) {
    insertLog({ user_id, payload: payloadStr, status_code: 429 });
    return res.status(429).json({ error: 'Rate limit exceeded. Max 5 requests per minute.' });
  }

  insertLog({ user_id, payload: payloadStr, status_code: 200 });
  res.status(200).json({ success: true, user_id, payload });
});

router.get('/logs', (req, res) => {
  const { sort_by, order } = req.query;
  const logs = getLogs({ sort_by, order });
  res.json({ logs });
});

module.exports = router;
