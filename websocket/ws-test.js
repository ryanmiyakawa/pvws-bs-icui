import WebSocket from 'ws';

// Replace with your WebSocket URL
const ws = new WebSocket('ws://cxro-dev2.dhcp.lbl.gov:8080/pvws/pv');

ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Send a message to the server
  // ws.send(JSON.stringify(
  //   { 
  //     type: 'subscribe',
  //     pvs:['ZTS2:wafer:x', 'ZTS2:wafer:x.MOVN', 'ZTS2:wafer:x.RBV']
  //   }
  // ));
  ws.send(
    '{"type":"subscribe","pvs":["ZTS2:wafer:x.VAL","ZTS2:wafer:x.RBV","ZTS2:wafer:x.MOVN","ZTS2:wafer:x.VAL","ZTS2:wafer:x.RBV","ZTS2:wafer:x.MOVN","ZTS2:wafer:x.VAL","ZTS2:wafer:x.RBV","ZTS2:wafer:x.MOVN"]}'
  );

  ws.send(JSON.stringify({ "type": "echo", "body": "Hello, echo", "other": "Whatever else" }
  ));


//   setTimeout(() => {
//     ws.send(JSON.stringify(
//       { "type": "write", "pv": "ZTS2:wafer:x", "value": 25 }

//     ));
// }, 5000)

});

ws.on('message', (message) => {
  console.log(`Received message: ${message}`);
});

ws.on('error', (error) => {
  console.error(`WebSocket error: ${error}`);
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});

