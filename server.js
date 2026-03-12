require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        mentor VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Database ready');
  } catch (err) {
    console.error('DB init error:', err);
  }
}

initDB();

app.get('/api/history/:mentor', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT role, content FROM messages WHERE mentor = $1 ORDER BY created_at ASC',
      [req.params.mentor]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load history' });
  }
});

app.post('/api/history/:mentor', async (req, res) => {
  try {
    const { role, content } = req.body;
    await pool.query(
      'INSERT INTO messages (mentor, role, content) VALUES ($1, $2, $3)',
      [req.params.mentor, role, content]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.delete('/api/history/:mentor', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE mentor = $1', [req.params.mentor]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reach Anthropic API.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mentors running on http://localhost:${PORT}`);
});
