from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from epics import PV
import asyncio

app = FastAPI()

# Global state to store hardware status
hardware_state = {}

# WebSocket manager to manage connection
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_state_update(self, websocket: WebSocket, state: dict):
        await websocket.send_json(state)

    async def broadcast_state(self, state: dict):
        for connection in self.active_connections:
            await self.send_state_update(connection, state)

manager = ConnectionManager()

# Generic callback function for EPICS PV subscriptions
def epics_subscription_cb(pvname=None, value=None, **kwargs):
    hardware_state[pvname] = value
    asyncio.create_task(manager.broadcast_state(hardware_state))

# Polling function for legacy devices that don't support callbacks
async def poll_pv(pv):
    while True:
        value = pv.get()  # Polling the PV value
        hardware_state[pv.pvname] = value
        await manager.broadcast_state(hardware_state)
        await asyncio.sleep(5)  # Poll every 5 seconds

# Set up hardware connections: either subscribe to updates or poll
def setup_hardware_connections(pv_names, use_polling=False):
    for pv_name in pv_names:
        pv = PV(pv_name)
        if use_polling:
            asyncio.create_task(poll_pv(pv))  # Poll if subscription not supported
        else:
            pv.add_callback(epics_subscription_cb)  # Subscribe to updates

# Example of PVs for dynamic setup
subscribe_pv_list = ['GRATING_STAGE:X', 'GRATING_STAGE:Y', 'GRATING_STAGE:Z']  # PVs with callbacks
polling_pv_list = ['LEGACY_DEVICE:1', 'LEGACY_DEVICE:2']  # PVs that need polling

# Setup connections
setup_hardware_connections(subscribe_pv_list)
setup_hardware_connections(polling_pv_list, use_polling=True)

# WebSocket connection handler
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle commands from frontend (e.g., move grating stage)
            command = parse_command(data)
            if command:
                process_command(command)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

def parse_command(data):
    # Example: Parse incoming data to extract commands
    pass

def process_command(command):
    # Example: Process command and send to EPICS PVs
    axis_map = {
        "X": 'GRATING_STAGE:X',
        "Y": 'GRATING_STAGE:Y',
        "Z": 'GRATING_STAGE:Z',
    }
    pv_name = axis_map.get(command["axis"])
    if pv_name:
        pv = PV(pv_name)
        pv.put(command["position"])
