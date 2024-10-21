import { useSelector, useDispatch } from "react-redux";
import GetSetValue from '../components/ui/GetSetValue.jsx';
import { hardwareSlice, selectDevice } from "../reducers/HardwareReducer.js";
import { setTargetAndGo, keyboardHardwareControls } from "../thunks/hardwareThunks.js";
import LayoutView from "../components/ui/LayoutView.jsx";
import LayoutSVG from "../components/ui/LayoutSVG.jsx";

const backgroundColorClass = "bg-blue-800";


const textColorClass = "text-white";
const deviceName = "Grating Diode";

const GratingDiode = () => {

  return (
    <div className = {`rounded p-2 m-2 ${backgroundColorClass}`}>

      
      <GetSetValue
        deviceName = {deviceName}
        selectProp = {(prop) => useSelector(selectDevice(["sensors", "gratingDiode", prop]))}
        
        showUnits={true}
        showPositionStores={false}
        showIncrementControls={false}
        showStopButton={false}
        showSetPositionField={false}
        showLabel={true}
        label={deviceName}
        backgroundColorClass = {backgroundColorClass}

        widthNameClass = 'w-48'
      />
      
    </div>
  );
};

export default GratingDiode;
