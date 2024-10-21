// src/pages/Home.jsx
import React from "react";
import GratingStage from "../hardwareContainers/GratingStage.jsx";
import WebSocketConnect from "../hardwareContainers/WebSocketConnect.jsx";
import GratingDiode from "../hardwareContainers/GratingDiode.jsx";
import GratingLayout from "../hardwareContainers/GratingLayout.jsx";

import GratingStageWidget from "../widgets/GratingStageWidget.jsx";
import PinholeStageWidget from "../widgets/PinholeStageWidget.jsx";
import WaferStageWidget from "../widgets/WaferStageWidget.jsx";

const Home = () => {
  return (
    <div>
      <div className ="w-full h-1/2 bg-slate-800 p-10">
      <div className = '  py-5'>

     
        <WebSocketConnect />
      </div>

      <div class="flex flex-row py-5">
        <GratingStageWidget />
        <PinholeStageWidget />
        <WaferStageWidget />
      </div>

        <GratingLayout width = {1200} height = {700}/>
        <GratingStage />
        <GratingDiode />
      </div>
    </div>
  );
};

export default Home;
