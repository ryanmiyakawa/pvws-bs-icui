import React, { useState, useEffect } from 'react';

const StatusIndicator = ({
  label,
  selectConnected,
  backgroundColorClass = 'bg-slate-600',
  labelColorClass = 'text-slate-100', 
}) => {
   
  const isConnected = selectConnected();
  // Render green square if connected, red square if disconnected
  const status = isConnected ? (
    <div className="bg-green-500 mx-3 p-2 w-4 h-4 rounded-full"></div>
  ) : (
    <div className="bg-red-500  mx-3 p-2 w-4 h-4 rounded-full"></div>
  );


  return (
    <div className={`flex items-center ${backgroundColorClass} text-black p-1 rounded-md`}>
      
    
        {status}
        <div className={`p-1 mx-3 w-36 ${labelColorClass} text-left font-bold text-xl`}>
          {label}
        </div>
      
      
    </div>
  );
};

export default StatusIndicator;
