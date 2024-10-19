import { hardwareSlice, selectDevice } from "../reducers/HardwareReducer";
import { PVList, createWSCommandMessage } from '../hardwareConfig/PVConfig.js';
import { sendMessage } from '../websocketService.js';


// Sends the target value to PVWebsocket after updating the state
export const setTargetAndGo = (payload) => (dispatch, getState) => {
    const state = getState();
    let commands = payload;

    // Check if command is an array:
    if (!Array.isArray(commands)) {
        commands = [commands];
    }

    commands.map( command => {
        // Update the hardware state with the new target value
        dispatch(hardwareSlice.actions.setValue({...command, prop: 'target'}));

        // Send the new target value to the hardware va PVWebsocket
        const PVKey = command.PVKey;
        const PVDevice = PVList[PVKey].PVDevice;
        const value = command.value;
        const hardwareRoute = PVList[PVKey].hardwareRoute;
        const isDeviceConnected = selectDevice([...hardwareRoute, 'isConnected'])(state);


        if (!state.webSocket.isConnected || isDeviceConnected) {
            // Websocket or device is not connected, set current value to target value as a virtualization:
            dispatch(hardwareSlice.actions.setValue({
                PVKey: PVKey,
                prop: 'current',
                value: value
            }));
        } else {
            // Send the new target value to the hardware via PVWebsocket
            const msg = createWSCommandMessage('set', PVDevice, value);
            if (msg){
                sendMessage(msg);
            }  else {
                console.error('Invalid command message:', msg);
            }
        }
      
    });
}

export const keyboardHardwareControls = (payload) => (dispatch, getState) => {
    const state = getState();
    const key = payload.key;
    const jlPVKey = payload?.jl?.PVKey;
    const ikPVKey = payload?.ik?.PVKey;
    const yhPVKey = payload?.yh?.PVKey;
    
    let PVDevice;
    let hardwareRoute;
    if (jlPVKey) {
        PVDevice = PVList[jlPVKey].PVDevice;
        hardwareRoute = PVList[jlPVKey].hardwareRoute;

        const target = selectDevice([...hardwareRoute, 'target'])(state);
        const increment = selectDevice([...hardwareRoute, 'increment'])(state);

        switch(key){
            case 'j':
                dispatch(setTargetAndGo({PVKey: jlPVKey, value: target - increment}));
                break;
            case 'l':
                dispatch(setTargetAndGo({PVKey: jlPVKey, value: target + increment}));
                break;
            case 'J':
                dispatch(hardwareSlice.actions.lowerIncrement({PVKey: jlPVKey}));
                break;
            case 'L':
                dispatch(hardwareSlice.actions.raiseIncrement({PVKey: jlPVKey}));
                break;
        }
    }
    if (ikPVKey){
        PVDevice = PVList[ikPVKey].PVDevice;
        hardwareRoute = PVList[ikPVKey].hardwareRoute;

        const target = selectDevice([...hardwareRoute, 'target'])(state);
        const increment = selectDevice([...hardwareRoute, 'increment'])(state);

        switch(key){
            case 'i':
                dispatch(setTargetAndGo({PVKey: ikPVKey, value: target + increment}));
                break;
            case 'k':
                dispatch(setTargetAndGo({PVKey: ikPVKey, value: target - increment}));
                break;
            case 'I':
                dispatch(hardwareSlice.actions.raiseIncrement({PVKey: ikPVKey}));
                break;
            case 'K':
                dispatch(hardwareSlice.actions.lowerIncrement({PVKey: ikPVKey}));
                break;
        }
    }
    if (yhPVKey){
        PVDevice = PVList[yhPVKey].PVDevice;
        hardwareRoute = PVList[yhPVKey].hardwareRoute;

        const target = selectDevice([...hardwareRoute, 'target'])(state);
        const increment = selectDevice([...hardwareRoute, 'increment'])(state);

        switch(key){
            case 'y':
                dispatch(setTargetAndGo({PVKey: yhPVKey, value: target + increment}));
                break;
            case 'h':
                dispatch(setTargetAndGo({PVKey: yhPVKey, value: target - increment}));
                break;
            case 'Y':
                dispatch(hardwareSlice.actions.raiseIncrement({PVKey: yhPVKey}));
                break;
            case 'H':
                dispatch(hardwareSlice.actions.lowerIncrement({PVKey: yhPVKey}));
                break;
        }
    }

}

