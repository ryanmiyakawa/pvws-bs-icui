
import TileWidget from '../components/ui/TileWidget.jsx';
import { useSelector } from 'react-redux';
import { selectDevice } from '../reducers/HardwareReducer.js';

const GratingStageWidget = () => {

    return (
        <TileWidget
            label = "Wafer Stage"
            backgroundColorClass = "bg-gray-700"
            textColorClass = "text-white"
            widthClass = "w-48"
            paramAr = {[
                {label: "X", hardwareSelector: (prop) => useSelector(selectDevice(["stages", "wafer", 'X', prop]))},
                {label: "Y", hardwareSelector: (prop) => useSelector(selectDevice(["stages", "wafer", 'Y', prop]))},
                {label: "Z", hardwareSelector: (prop) => useSelector(selectDevice(["stages", "wafer", 'Z', prop]))},
            ]}
        />
           
    );


}


export default GratingStageWidget;
