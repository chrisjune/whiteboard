
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const drawingHistory = [];

wss.on('connection', (ws) => {
  // Send the entire drawing history to the new client
  drawingHistory.forEach(drawData => {
    ws.send(drawData);
  });

  // When a message is received from a client
  ws.on('message', (message) => {
    const messageString = message.toString();
    const data = JSON.parse(messageString);

    if (data.type === 'clear') {
      drawingHistory.length = 0; // Clear the history
      // Broadcast the clear message to all clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'clear' }));
        }
      });
    } else {
      // Add the new drawing data to our history
      drawingHistory.push(messageString);

      // Broadcast the new drawing to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(messageString);
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser.`);
});
