import React, { useState, useEffect } from 'react';

const GetSetValue = ({
  deviceName, 
  selectProp,
  setTarget, 
  setIncrement,
  backgroundColorClass = 'bg-slate-600', 
  labelColorClass = 'text-slate-100', 
  buttonColorClass = 'bg-slate-300',

  currentValueTextColorClass = 'text-yellow-300',
  currentValuebackgroundColorClass = 'bg-red-700',
  targetValueColorClass = 'text-blue-700',
  targetValuebackgroundColorClass = 'bg-orange-200',

  showUnits = true,
  showPositionStores = true,
  showIncrementControls = true,
  showStopButton = true,
  showSetPositionField = true,
  showLabel = true,
  label = 'Motor Axis',
}) => {
  const [unitSelectedIndex, setUnitSelectedIndex]   = useState(0); 
  const [storeSelectedIndex, setStoreSelectedIndex] = useState(0); 
  const [localTargetValue, setLocalTargetValue]     = useState(''); // Local state for target input

  const currentPositionRaw  = selectProp('current'); 
  const config              = selectProp('config'); 


  const isConnected         = selectProp('isConnected'); 
  const target              = selectProp('target');
  const increment           = selectProp('increment');
  


  

  if (!isConnected){
    currentValuebackgroundColorClass = 'bg-cb'
    currentValueTextColorClass = 'text-gray-300'
  }

  useEffect(() => {
    // Sync local target value with Redux state when component mounts or Redux state changes
    setLocalTargetValue(rawToCalibrated(target, true));
  }, [target]);

  const handleDecrement = () => {
    const newTarget = validatePositionRange(rawToCalibrated(Number(target)) - increment);
    setTarget(newTarget); 
  };

  const handleIncrement = () => {
    const newTarget = validatePositionRange(rawToCalibrated(Number(target)) + increment);
    setTarget(newTarget); 
  };

  const handleStop = () => {
    console.log(`${deviceName}: Stop `);
  };

  const handleUnitDropdownChange = (event) => {
    const index = event.target.selectedIndex;
    setUnitSelectedIndex(index);
    console.log(`${deviceName}: Selected unit index:`, index);
  };

  const handleStoreDropdownChange = (event) => {
    const index = event.target.selectedIndex;
    setStoreSelectedIndex(index);

    const stores = config?.stores;
    if (!stores) {
      return;
    }
    const store = stores[storeSelectedIndex];
    setTarget(validatePositionRange(store.raw));


    console.log(`${deviceName}: Selected store index:`, index);
  };

  const validatePositionRange = (value) => {
    if (config?.min && value < config.min) {
      return config.min;
    }
    if (config?.max && value > config.max) {
      return config.max;
    }
    return value;
  }

  const rawToCalibrated = (value, toPrecisionString = false) => {
    const units = config?.units;
    if (!units) {
      return value;
    }
    const unit = units[unitSelectedIndex];

    if (toPrecisionString) {
      return (value * unit.slope + unit.offset).toFixed(unit.precision);
    } else {
      return (value * unit.slope + unit.offset);
    }

  }
  

  const displayToRaw = (value) => {
    const units = config?.units;
    if (!units) {
      return value;
    }
    const unit = units[unitSelectedIndex];

    return (value / unit.slope - unit.offset);
  }

  const handleInputChange = (e) => {
    setLocalTargetValue(e.target.value); // Update local input state
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setTarget(validatePositionRange(displayToRaw(Number(localTargetValue)))); // Dispatch to Redux
      e.target.blur(); // Unfocus input after Enter key press
    }
  };

  return (
    <div className={`flex items-center ${backgroundColorClass} text-black p-1 rounded-md`}>
      {showLabel && (
        <div className={`p-1 mx-1 w-24 ${labelColorClass} text-right font-bold text-xl`}>
          {label}
        </div>
      )}
  
      <div className={`ml-1 w-24 text-center text-xl font-bold ${currentValuebackgroundColorClass} ${currentValueTextColorClass}`}>
        {rawToCalibrated(currentPositionRaw, true)}
      </div>
  
      {showSetPositionField && (
        <div className="mx-1">
          <input
            value={localTargetValue} // Use local state for input value
            onClick={e => e.target.select()}
            onChange={handleInputChange} // Update local state on change
            onKeyDown={handleKeyPress} // Dispatch action on Enter key press
            className={`w-24 font-bold text-xl px-1 ${targetValuebackgroundColorClass} ${targetValueColorClass} text-center`}
          />
        </div>
      )}
  
      {showIncrementControls && (
        <button
          className={`p-1 mx-1 border rounded w-8 h-full flex items-center text-sm font-bold justify-center ${buttonColorClass}`}
          onClick={handleDecrement}
        >
          -
        </button>
      )}
  
      {showIncrementControls && (
        <div className="w-16">
          <input
            value={increment}
            onChange={e => setIncrement(Number(e.target.value))}
            className={`w-full px-1 text-xl font-bold text-center ${targetValueColorClass} ${targetValuebackgroundColorClass}`}
          />
        </div>
      )}
  
      {showIncrementControls && (
        <button
          className={`p-1 mx-1 rounded w-8 h-full flex items-center font-bold  text-sm justify-center ${buttonColorClass}`}
          onClick={handleIncrement}
        >
          +
        </button>
      )}
  
      {showUnits && config?.units && (
        <div className="p-1 mx-1">
          <select onChange={handleUnitDropdownChange} className="border rounded w-full px-1 py-1 text-sm">
            {config.units.map((unit, idx) => (
              <option key={`unit-${idx}`} value={unit.name}>{unit.name}</option>
            ))}
          </select>
        </div>
      )}
  
      {showPositionStores && config?.stores && (
        <div className="p-1 mx-1">
          <select onChange={handleStoreDropdownChange} className="border rounded w-full px-1 py-1 text-sm">
            {config.stores.map((store, idx) => (
              <option key={`store-${idx}`} value={store.name}>{store.name}</option>
            ))}
          </select>
        </div>
      )}
  
      {showStopButton && (
        <button
          className="p-1 mx-1 border rounded bg-red-500 text-white h-full text-sm"
          onClick={handleStop}
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default GetSetValue;
