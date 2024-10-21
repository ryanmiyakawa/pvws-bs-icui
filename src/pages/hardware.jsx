// src/pages/Home.jsx
import React from 'react';
import { useSelector } from "react-redux";
import { selectDevice } from "../reducers/HardwareReducer.js";
import GratingStage from '../hardwareContainers/GratingStage.jsx';
import WebSocketConnect from '../hardwareContainers/WebSocketConnect.jsx';
import StatusIndicator from '../components/ui/StatusIndicator.jsx';

import GratingStageWidget from '../widgets/GratingStageWidget.jsx';
import PinholeStageWidget from '../widgets/PinholeStageWidget.jsx';
import WaferStageWidget from '../widgets/WaferStageWidget.jsx';

const Hardware = () => {
  return (
    <div>
        <div class = 'flex flex-row'>
    <GratingStageWidget />
    <PinholeStageWidget />
    <WaferStageWidget />
    </div>
      <div>WebSocket Connection</div>
      <WebSocketConnect />
      <div>PV connections</div>
        <StatusIndicator 
            label="Grating X"
            selectConnected={() => useSelector(selectDevice(["stages", "grating", 'X', 'isConnected']))}
        />
         <StatusIndicator 
            label="Grating Y"
            selectConnected={() => useSelector(selectDevice(["stages", "grating", 'Y', 'isConnected']))}
        />
         <StatusIndicator 
            label="Grating Z"
            selectConnected={() => useSelector(selectDevice(["stages", "grating", 'Z', 'isConnected']))}
        />

    </div>
    )
};

export default Hardware;