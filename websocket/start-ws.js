import { WebSocketServer } from 'ws';
// const { subscribeToEPICSPV } = require('./epicsService'); // Example EPICS subscription

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');


  // On interval send a message to the client
    const interval = setInterval(() => {
        wss.send(JSON.stringify({ position: Math.random() * 100 }));
    }, 1000);

  // Subscribe to EPICS PV updates for the stage position
//   const pvSubscription = subscribeToEPICSPV('STAGE:POSITION', (position) => {
//     // Broadcast the updated position to all connected clients
//     wss.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ position }));
//       }
//     });
//   });

  // Clean up the subscription when the client disconnects
//   ws.on('close', () => {
//     console.log('Client disconnected');
//     pvSubscription.unsubscribe(); // Unsubscribe from EPICS PV updates
//   });
});

console.log('WebSocket server is running on ws://localhost:8080');