
import TileWidget from '../components/ui/TileWidget.jsx';
import { useSelector } from 'react-redux';
import { selectDevice } from '../reducers/HardwareReducer.js';

const GratingStageWidget = () => {

    return (
        <TileWidget
            label = "Pinhole Stage"
            backgroundColorClass = "bg-green-900"
            textColorClass = "text-white"
            widthClass = "w-48"
            paramAr = {[
                {label: "X", hardwareSelector: (prop) => useSelector(selectDevice(["stages", "pinhole", 'X', prop]))},
                {label: "Y", hardwareSelector: (prop) => useSelector(selectDevice(["stages", "pinhole", 'Y', prop]))},
            ]}
        />
           
    );


}


export default GratingStageWidget;
