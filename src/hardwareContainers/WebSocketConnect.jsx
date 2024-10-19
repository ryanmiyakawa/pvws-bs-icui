import { useSelector, useDispatch } from "react-redux";
import ButtonToggle from '../components/ui/ButtonToggle.jsx';
import { webSocketSlice } from "../reducers/WebSocketReducer.js";
import { connectWebSocket } from "../websocketService.js" // Thunk

const WebSocketConnect = () => {
  const dispatch = useDispatch();

  const isConnecting = useSelector((state) => state.webSocket.isConnecting);
  const connectionFailed = useSelector((state) => state.webSocket.connectionFailed);

  let status = null;
  if (connectionFailed) {
    status = (<div className = 'text-red-900'>
      Connection Failed. Check WS address and connection
    </div>);
  } else if (isConnecting) {
    status = (<div>
      Connecting...
    </div>);
  }
  return (
    <ButtonToggle
        label="WebSocket Connection"
        status={status}
        getCurrent={() => useSelector((state) => state.webSocket.isConnected)}
        setTarget={(value) => {
            dispatch(
                value ? connectWebSocket() : webSocketSlice.actions.disconnect()
            );
        }}
    />
  );
};

export default WebSocketConnect;
