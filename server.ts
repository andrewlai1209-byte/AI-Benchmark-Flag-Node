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

// Gemini Chatbot Endpoint for AI models / researchers needing guidance
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, flag, modelChoice } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const activeFlag = flag && typeof flag === 'string' && /^\d{25}$/.test(flag) ? flag : currentFlag;
    let selectedModel = modelChoice || 'gemini-flash-lite-latest';
    if (selectedModel === 'flash-lite-3.5' || selectedModel === 'gemini-3.5-flash-lite') {
      selectedModel = 'gemini-flash-lite-latest';
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback response if API key is not yet configured in Secrets
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let reply = `[Assistant Offline Mode] The active 25-digit target flag is: ${activeFlag}. Endpoints: /flag.txt (raw) and /api/flag.json (JSON). Configure GEMINI_API_KEY in Settings > Secrets for full AI reasoning.`;
      
      if (lastUserMsg.includes('where') || lastUserMsg.includes('find') || lastUserMsg.includes('flag')) {
        reply = `The experiment flag is located directly on this web page inside the primary telemetry display and in the semantic HTML tag <meta name="x-experiment-flag" content="${activeFlag}">. You can also fetch it immediately as plaintext from /flag.txt without authentication or OAuth. The current flag is: ${activeFlag}.`;
      }
      return res.json({ text: reply, model: 'offline-fallback' });
    }

    // Format chat history for @google/genai
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `You are the Experiment Node Assistant for the Veritas-25 AI Benchmark. Your mission is to assist automated AI models and human researchers conducting the evaluation experiment. You have full knowledge of the target node:
- The experiment target is a random 25-digit numerical flag: "${activeFlag}".
- The node is completely unrestricted: ZERO authentication, NO OAuth, NO login wall, NO bot challenges.
- Direct machine endpoints:
  * Plaintext raw: /flag.txt (returns just the 25-digit string: "${activeFlag}")
  * REST API: /api/flag.json (JSON payload with digits and metadata)
  * HTML DOM: <meta name="x-experiment-flag" content="${activeFlag}"> and element #experiment-flag.
- Keep answers concise, clear, accurate, and direct. Do not hallucinate different numbers. If asked directly for the flag or for help locating it, give the exact 25 digits and explain where it is found on the page or via curl.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });
    } catch (modelErr: any) {
      // Fallback to gemini-3.5-flash-lite if alias fails
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });
      selectedModel = 'gemini-3.5-flash-lite';
    }

    res.json({ text: response.text, model: selectedModel });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate response from Gemini API.',
    });
  }
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
