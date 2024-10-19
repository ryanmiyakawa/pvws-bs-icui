import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PVList, createWSCommandMessage } from '../hardwareConfig/PVConfig.js';
import { increaseIncrement, decreaseIncrement } from '../utils/handleIncrements.js';
import { current } from 'immer';


// Hardware state templates:
const STAGE_AXIS_TEMPLATE = {
  config: {}, isConnected: false, isMoving: false, isHomed: true, target: 0, current: 0, increment: 0.1 
}

const SENSOR_TEMPLATE = {
  config: {}, isConnected: false, current: 0
}

// All json files in the src/hardwareConfig directory will be imported into config
// properties in the corresponding state objects as defined by the stateRoute property
const configModules = import.meta.glob('../hardwareConfig/*.json');

// Thunk for fetching and loading hardware configuration
export const loadHardwareConfiguration = createAsyncThunk(
  'hardware/loadHardwareConfiguration',
  async () => {
    const configs = {};
    for (const path in configModules) {
      const module = await configModules[path]();
      configs[path] = module; // Directly assign the imported JSON content
    }
    return configs;
  }
);


export const hardwareSlice = createSlice({
  name: "hardware", // The name of the slice (prefixes the action types)
  initialState: {
      loading: false,
      error: null,
      stages: {
        mask: {
          X: STAGE_AXIS_TEMPLATE,
          Y: STAGE_AXIS_TEMPLATE,
          Z: STAGE_AXIS_TEMPLATE,
        },
        wafer: {
          X: STAGE_AXIS_TEMPLATE,
          Y: STAGE_AXIS_TEMPLATE,
          Z: STAGE_AXIS_TEMPLATE,
        },
        grating: {
          X: STAGE_AXIS_TEMPLATE,
          Y: STAGE_AXIS_TEMPLATE,
          Z: STAGE_AXIS_TEMPLATE,
        },
        m3fold: {
          Rx: STAGE_AXIS_TEMPLATE,
          Ry: STAGE_AXIS_TEMPLATE,
          Z:  STAGE_AXIS_TEMPLATE,
        },
      },
      sensors: {
        maskDiode: SENSOR_TEMPLATE,
        gratingDiode: SENSOR_TEMPLATE,
    },
  }, // Initial state for this slice
  reducers: {
    loadHardwareConfiguration: (state, action) => {
      loadConifg(state);
    },

    // Accepts action.payload = { path: ['mask', 'X'], value: 100 }
    setValue: (state, action) => {
      const PVKey = action.payload.PVKey;
      const PVDevice = PVList[PVKey].PVDevice;
      const prop = action.payload.prop;
      const hardwareRoute = PVList[PVKey].hardwareRoute;
      const path = [...hardwareRoute, prop];
      const value = action.payload.value;

      const lastKey = path.pop(); // Get the last key from the path
      const parent = path.reduce((acc, key) => acc[key], state); // Traverse the state up to the parent of the target key

      if (parent && lastKey) {
        parent[lastKey] = value; // Mutate the state
      }
    },

    raiseIncrement: (state, action) => {
      const PVKey = action.payload.PVKey;
      const hardwareRoute = PVList[PVKey].hardwareRoute;
      const increment = get(state, [...hardwareRoute, 'increment']);

      // increase increment to either 1, 2, or 5 in the current decade:
      const newIncrement = increaseIncrement(increment);

      set(state, [...hardwareRoute, 'increment'], newIncrement);

    },
    lowerIncrement: (state, action) => {
      const PVKey = action.payload.PVKey;
      const hardwareRoute = PVList[PVKey].hardwareRoute;
      const increment = get(state, [...hardwareRoute, 'increment']);

      // decrease increment to either 1, 2, or 5 in the current decade:
      const newIncrement = decreaseIncrement(increment);

      set(state, [...hardwareRoute, 'increment'], newIncrement);
    },


    // This is called by the websocket middleware in response to a message from the server
    updateHardwareState: (state, action) => {
      const hardwareStateObj = action.payload;

      const route = hardwareStateObj.route;
      const prop = hardwareStateObj.prop;
      const value = hardwareStateObj.value;

      // Use route to traverse the state object to the correct device
      let statePointer = state;
      for (let i = 0; i < route.length - 1; i++) {
        statePointer = statePointer[route[i]];
      }

      // Update the state with the new value
      statePointer[route[route.length - 1]].isConnected = true;
      statePointer[route[route.length - 1]][prop] = value;
    }
  },

  // Async handlers for loadHardwareConfiguration
  extraReducers: (builder) => {
    builder
      .addCase(loadHardwareConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHardwareConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        const configModules = action.payload;

        for (const path in configModules) {
          const configModule = configModules[path];
          if (configModule.stateRoute) {
              const statePath = configModule.stateRoute;
              const config = configModule.config;
              let statePointer = state;
              for (let i = 0; i < statePath.length - 1; i++) {
                  statePointer = statePointer[statePath[i]];
              }
              statePointer[statePath[statePath.length - 1]].config = config;
          } else {
              console.error('Config module missing stateRoute:', configModule)
          }
      }
        
      })
      .addCase(loadHardwareConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


// Selectors
// Usage: useSelector(selectDevice(['stages', 'mask', 'X', 'current']))
export const selectDevice = (devicePath) => (state) => {
  return devicePath.reduce((acc, key) => acc && acc[key], state.hardware);
}

// Traversing mutator:
const set = (state, route, value) => {
  let statePointer = state;
  for (let i = 0; i < route.length - 1; i++) {
    statePointer = statePointer[route[i]];
  }

  // Update the state with the new value
  statePointer[route[route.length - 1]] = value;
}

// Traversing accessor:
const get = (state, route) => {
  let statePointer = state;
  for (let i = 0; i < route.length; i++) {
    statePointer = statePointer[route[i]];
  }

  return statePointer;
}