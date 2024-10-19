// src/pages/Home.jsx
import React from 'react';
import GratingStage from '../hardwareContainers/GratingStage.jsx';
import WebSocketConnect from '../hardwareContainers/WebSocketConnect.jsx';

const Home = () => {
  return (
    <div>
      <div>WebSocket Connection</div>
      <WebSocketConnect />
      <GratingStage />
    </div>
    )
};

export default Home;