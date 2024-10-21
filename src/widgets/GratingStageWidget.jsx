
import TileWidget from '../components/ui/TileWidget.jsx';
import { useSelector } from 'react-redux';
import { selectDevice } from '../reducers/HardwareReducer.js';

const GratingStageWidget = () => {

    return (
        <TileWidget
            label = "Grating Stage"
            backgroundColorClass = "bg-red-900"
            textColorClass = "text-white"
            widthClass = "w-48"
            paramAr = {[
                {label: "X", hardwareSelector: (prop) => useSelector(selectDevice(["stages", "grating", 'X', prop]))},
                {label: "Y", hardwareSelector: (prop) => useSelector(selectDevice(["stages", "grating", 'Y', prop]))},
                {label: "Z", hardwareSelector: (prop) => useSelector(selectDevice(["stages", "grating", 'Z', prop]))},
            ]}
        />
           
    );


}


export default GratingStageWidget;
