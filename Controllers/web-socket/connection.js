
const WebSocket = require('ws');

module.exports = function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server }); // attach to HTTP server

  wss.on('connection', (ws) => {
    console.log('🟢 New client connected');

    ws.on('message', (message) => {
      console.log('📨 Received:', message);

      // Try to parse the message, don't crash if it's plain text
      try {
        const parsed = JSON.parse(message);
        console.log('Parsed message:', parsed);
      } catch {
        console.log('Message is not JSON, broadcasting as-is.');
      }

      // Broadcast to all other connected clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      console.log('🔴 Client disconnected');
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });

  console.log('✅ WebSocket server is ready');
};
