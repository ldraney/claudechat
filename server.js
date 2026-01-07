const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8847;

// Store connected SSE clients
let clients = [];

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// SSE endpoint - browser connects here
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  // Add client to list
  clients.push(res);
  console.log(`Client connected. Total clients: ${clients.length}`);

  // Remove client on disconnect
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    console.log(`Client disconnected. Total clients: ${clients.length}`);
  });
});

// Receive response from hook
app.post('/response', (req, res) => {
  const { text, timestamp } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  console.log(`Received response (${text.length} chars)`);

  // Broadcast to all connected clients
  const message = JSON.stringify({
    type: 'response',
    text,
    timestamp: timestamp || new Date().toISOString()
  });

  clients.forEach(client => {
    client.write(`data: ${message}\n\n`);
  });

  res.json({ success: true, clientCount: clients.length });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', clients: clients.length });
});

app.listen(PORT, () => {
  console.log(`Claude Response Viewer running at http://localhost:${PORT}`);
  console.log('Open this URL in your browser to see responses');
});
