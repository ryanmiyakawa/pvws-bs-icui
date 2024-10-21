import  GetSetValue  from "./GetSetValue.jsx";

const TileWidget = ({
  label,
  paramAr,
  backgroundColorClass = 'bg-slate-600',
  labelColorClass = 'text-slate-100', 
}) => {
   
  return (
    <div className={`h-42 w-48 flex flex-col items-center ${backgroundColorClass} text-black p-1 border`}>
      <div className={`p-1 mx-3 w-36 ${labelColorClass} text-left font-bold text-xl`}>
          {label}
        </div>
    {
       paramAr.map(params => (
        <GetSetValue
          key = {params.label}
          deviceName = {""}
          selectProp = {(prop) => params.hardwareSelector(prop)}
          showUnits={false}
          showPositionStores={false}
          showIncrementControls={false}
          showStopButton={false}
          showSetPositionField={false}
          showLabel={true}
          label={params.label}
          backgroundColorClass = {backgroundColorClass}
          widthNameClass = 'w-18'
          currenValueBfOff = {true}
        />
        ))
    }
    
       
      
      
    </div>
  );
};

export default TileWidget;
