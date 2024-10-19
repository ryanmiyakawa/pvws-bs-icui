import { useSelector, useDispatch } from "react-redux";
import GetSetValue from '../components/ui/GetSetValue.jsx';
import { hardwareSlice, selectDevice } from "../reducers/HardwareReducer.js";
import { setTargetAndGo, keyboardHardwareControls } from "../thunks/hardwareThunks.js";
import LayoutView from "../components/ui/LayoutView.jsx";
import LayoutSVG from "../components/ui/LayoutSVG.jsx";

const backgroundColorClass = "bg-slate-600";



const GratingSVG = () => {
  const shapes = useSelector((state) => state.layout.grating.shapes);
  const staticShapes = useSelector((state) => state.layout.grating.staticShapes);
  const svgSize = useSelector((state) => state.layout.grating.svgSize);
  const viewPort = useSelector((state) => state.layout.grating.viewPort);
  const unitsPerPixel = useSelector((state) => state.layout.grating.unitsPerPixel);

  const posXpx =  useSelector(selectDevice(["stages", "grating", "X", "current"]))/unitsPerPixel;
  const posYpx = useSelector(selectDevice(["stages", "grating", "Y", "current"]))/unitsPerPixel;
  

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Shapes that move with {posx, posy} */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <LayoutSVG shapes={shapes} svgSize={svgSize} viewPort={viewPort} posX = {posXpx} posY = {posYpx}/>
      </div>
      {/* Shapes that are static */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <LayoutSVG shapes={staticShapes} svgSize={svgSize} viewPort={viewPort} />
      </div>
    </div>
  );
};

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

<div className="layout-view bg-green-950">
  <LayoutView 
        setTarget = {(x,y) => {dispatch(setTargetAndGo(
          [
            {PVKey: "Grating-Y", value: y},
            {PVKey: "Grating-X", value: x}
          ]
        ))}}
        SVG = {GratingSVG}
        svgSize = {useSelector((state) => state.layout.grating.svgSize)}
        viewPort = {useSelector((state) => state.layout.grating.viewPort)}
        unitsPerPixel = {useSelector((state) => state.layout.grating.unitsPerPixel)}
        routeKeyboardHardwareControls = {(key) => dispatch(
          keyboardHardwareControls({
              key: key,
              jl: {PVKey: "Grating-X"},
              ik: {PVKey: "Grating-Y"},
              yh: {PVKey: "Grating-Z"},
            })
          )}
      />
      </div>
    </div>
  );
};

export default GratingStage;
