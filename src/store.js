// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { hardwareSlice } from './reducers/HardwareReducer.js';
import { webSocketSlice } from './reducers/WebSocketReducer.js';
import { layoutSlice } from './reducers/LayoutReducer.js';
import { thunk } from 'redux-thunk';


// Combine reducers if you plan to add more
const rootReducer = combineReducers({
    hardware: hardwareSlice.reducer,
    webSocket: webSocketSlice.reducer,
    layout: layoutSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;