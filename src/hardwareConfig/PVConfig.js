/**
 * Use this file to configure the PVs that you want to connect to.
 */

export const PVList = {
    'Grating-X': {
        PVDevice: "ZTS2:wafer:x",
        fields: ['VAL', 'RBV', 'MOVN'],
        hardwareRoute: ['stages', 'grating', 'X'],
    },
    'Grating-Y': {
        PVDevice: "ZTS2:wafer:x",
        fields: ['VAL', 'RBV', 'MOVN'],
        hardwareRoute: ['stages', 'grating', 'Y'],
    },
    'Grating-Z': {
        PVDevice: "ZTS2:wafer:x",
        fields: ['VAL', 'RBV', 'MOVN'],
        hardwareRoute: ['stages', 'grating', 'Z'],
    }
}


export const commands = {
    'set': 'VAL',
    'get': 'RMV',
    'getIsMoving': 'MOVN',
}

export const createWSCommandMessage = (command, device, value) => {
    
    if (!commands[command]) {
        null
    }
    if (!PVDeviceToRoute(device)) {
        null
    }
    return { 
        type: 'write',
        pv: `${device}.${commands[command]}`,
        value
    };
}


export const fieldToProperty = (fieldName) => {
    const fieldMap = {
        'VAL': 'target',
        'RBV': 'current',
        'MOVN': 'isMoving',
    }
    
    if (fieldMap[fieldName]) {
        return fieldMap[fieldName];
    }
    return null;
}

export const PVDeviceToRoute = (PVDevice) => {
    const PV = Object.values(PVList).find(PV => PV.PVDevice === PVDevice);
    return PV ? PV.hardwareRoute : null;
}



