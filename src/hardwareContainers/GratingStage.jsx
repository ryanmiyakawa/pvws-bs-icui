import { useSelector, useDispatch } from "react-redux";
import GetSetValue from '../components/ui/GetSetValue.jsx';
import { hardwareSlice, selectDevice } from "../reducers/HardwareReducer.js";
import { setTargetAndGo } from "../thunks/hardwareThunks.js";

const backgroundColorClass = "bg-slate-600";
const textColorClass = "text-white";
const stageName = "Grating Stage";
const axes = ['X', 'Y', 'Z'];

const GratingStage = () => {
const dispatch = useDispatch();

  return (
    <div className = {`rounded p-2 m-2 ${backgroundColorClass}`}>
      <div className = {`p-2 ml-2 text-xl font-bold ${textColorClass}`}>
      {stageName}
        </div>

      {axes.map(axis => (
      <GetSetValue
        key = {axis}
        deviceName = {"Grating"}
        selectProp = {(prop) => useSelector(selectDevice(["stages", "grating", axis, prop]))}
        setIncrement = {(value) => {
          dispatch(
            hardwareSlice.actions.setValue({
              PVKey: `Grating-${axis}`,
              prop: 'increment',
              value
            })
          );
        }}
        setTarget   = {(value) => {
          dispatch(
            setTargetAndGo({
              PVKey: `Grating-${axis}`,
              value
            })
          );
        }}

        showUnits={true}
        showPositionStores={true}
        showIncrementControls={true}
        showStopButton={true}
        showSetPositionField={true}
        showLabel={true}
        label={axis}
        backgroundColorClass = {backgroundColorClass}
      />
      ))}
    </div>
  );
};

export default GratingStage;
