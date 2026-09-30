import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Default benchmark flag
const DEFAULT_FLAG = '8492018374920158392018472';

// In-memory current flag state for server endpoints
let currentFlag = DEFAULT_FLAG;

// Endpoint to update server-side current flag state
app.post('/api/node/flag', (req, res) => {
  const { flag } = req.body;
  if (flag && typeof flag === 'string' && /^\d{25}$/.test(flag)) {
    currentFlag = flag;
    res.json({ success: true, flag: currentFlag });
  } else {
    res.status(400).json({ error: 'Flag must be exactly 25 digits (0-9).' });
  }
});

// Direct raw flag text endpoint
app.get('/flag.txt', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Experiment-Flag', currentFlag);
  res.send(currentFlag);
});

// Direct JSON flag endpoint
app.get('/api/flag.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    flag: currentFlag,
    digits: 25,
    type: '25-digit-numeric-flag',
    experiment: 'AI Model Retrieval and Extraction Benchmark',
    auth_required: false,
    blocked: false,
    rate_limited: false,
    checksum: `${currentFlag.slice(0, 5)}-${currentFlag.slice(5, 10)}-${currentFlag.slice(10, 15)}-${currentFlag.slice(15, 20)}-${currentFlag.slice(20, 25)}`,
  });
});

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
