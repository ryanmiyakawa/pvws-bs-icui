import { webSocket } from 'rxjs/webSocket';
import { filter, tap, catchError, take } from 'rxjs/operators';
import { webSocketSlice } from './reducers/WebSocketReducer.js';
import { hardwareSlice } from './reducers/HardwareReducer.js';
import { PVList, PVDeviceToRoute, fieldToProperty } from './hardwareConfig/PVConfig.js';
import { of } from 'rxjs';


const WS_ADDRESS = 'ws://cxro-dev2.dhcp.lbl.gov:8080/pvws/pv';

let ws$ = null;

// This redux thunk  returns a function that takes dispatch as an argument
// redux-thunk takes care of calling the function with dispatch
export const connectWebSocket = () => (dispatch) => {
  dispatch(webSocketSlice.actions.setIsConnecting());

  // Only establish WebSocket connection if it's not already open
  if (!ws$) {
    ws$ = webSocket(WS_ADDRESS);

    // As soon as the WebSocket connection is established, subscribe to the PVs (this is queued if ws is not yet connected)
    ws$.next({
      type: 'subscribe',
      pvs: Object.keys(PVList).map((key) => {
        const pv = PVList[key];
        const fields = pv.fields;
        return fields.map((field) => `${pv.PVDevice}.${field}`);
      }).flat()
    });

    // Monitor WebSocket stream
    ws$.pipe(
      tap(() => {
        console.log("WebSocket connection confirmed");

        // Dispatch that the WebSocket is connected
        dispatch(webSocketSlice.actions.setConnected());

      }),
      catchError((error) => {
        console.error('WebSocket connection error:', error);

        // Dispatch that the WebSocket is disconnected
        dispatch(webSocketSlice.actions.setConnectionFailed());

        // Return an observable to continue the stream
        return of(error);
      })
    ).subscribe({
      next: (msg) => {

        const data = msg; // No need to JSON.parse since RxJS already handles JSON parsing

        console.log(`Received message: ${JSON.stringify(data)}`);

        if (data.type === 'echo' || !data.pv) {
          console.log(`Echo message: ${data.body}`);
          return;
        }
        // Split pv into pvDevice and field where pv = <device>.<field>
        const pvParts = data.pv.split('.');
        const PVDevice = pvParts[0];
        const PVField = pvParts[1];

        const route = PVDeviceToRoute(PVDevice);
        if (data.value === undefined) {
          // This PV is not connected
          dispatch(hardwareSlice.actions.updateHardwareState({
            route,
            prop: 'isConnected',
            value: false,
          }));
        } else {
          // This PV is connected
          dispatch(hardwareSlice.actions.updateHardwareState({
            route,
            prop: fieldToProperty(PVField),
            value: data.value,
          }));
        }
      },
      error: (err) => {
        console.error('WebSocket Error:', err);
        // Optionally dispatch an error action
      },
      complete: () => {
        console.log('WebSocket connection closed.');
        dispatch(webSocketSlice.actions.setDisconnected()); // Handle connection closure
      }
    });
  }
};


// Function to disconnect from WebSocket
export const disconnectWebSocket = () => {
  if (ws$) {
    ws$.complete(); // Close the WebSocket connection
    ws$ = null;
  }
};

// Function to send a message to the WebSocket server
export const sendMessage = (message) => {
  if (ws$) {
    ws$.next(message); // Send message using the RxJS WebSocket subject
  } else {
    console.error("WebSocket connection is not established.");
  }
};
