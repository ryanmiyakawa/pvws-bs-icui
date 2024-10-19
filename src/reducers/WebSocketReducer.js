import { createSlice } from '@reduxjs/toolkit';
import { connectWebSocket, disconnectWebSocket, sendMessage } from '../websocketService.js';
// import {PVList, commands} from '../hardwareConfig/PVConfig.js';
import { PVList, commands } from '../hardwareConfig/PVConfig.js';

export const webSocketSlice = createSlice({
  name: 'webSocket', // The name of the slice (prefixes the action types)
  initialState: { 
    isConnecting: false,
    isConnected: false, 
    connectionFailed: false,
  }, // Initial state for this slice
  reducers: {
    // Dispatched by thunk `connectWebSocket` in `websocketService.js`
    setConnected: (state, action) => {
      state.isConnecting = false;
      state.isConnected = true;
      state.connectionFailed = false;
    },
    setDisconnected: (state, action) => {
      state.isConnecting = false;
      state.isConnected = false;
    },
    setConnectionFailed: (state, action) => {
      state.isConnecting = false;
      state.connectionFailed = true;
    },
    setIsConnecting: (state, action) => {
      state.isConnecting = true;
    },


    disconnect: (state, action) => {
      disconnectWebSocket();
      state.isConnected = false;
    },

    
  },
});