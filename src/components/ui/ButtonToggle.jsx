import React, { useState } from 'react';

const ButtonToggle = ({
  getCurrent, // Get current value
  setTarget,
  status = null,
  label = 'WS Connection',
  backgroundColorConnected = '#60cc50',
  textColorConnected = '#ff0',
  backgroundColorDisconnected = '#f0f0f0',
  textColorDisconnected = '#F99',
}) => {

  const isConnected = getCurrent(); 

  const toggleConnection = () => {
    setTarget(!isConnected);
  };

  const backgroundColor = isConnected
    ? backgroundColorConnected
    : backgroundColorDisconnected;
  const textColor = isConnected ? textColorConnected : textColorDisconnected;

  return (
    <div
    className="relative text-center w-96"
    onClick={toggleConnection}
    style={{
      backgroundColor,
      color: textColor,
      padding: '10px',
      borderRadius: '8px',
      cursor: 'pointer', // Make it clear it's clickable
    }}
  >
    <div className="text-center font-bold text-2xl">
      {label}
    </div>
    <div
      className="absolute left-0 right-0 text-center text-xs"
      style={{
        top: 'calc(100% - 17px)', // Adjust this value as needed
      }}
    >
      {status}
    </div>
  </div>
  );
};

export default ButtonToggle;
