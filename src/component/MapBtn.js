import React from "react";
import './MapBtn.css'

const MapBtn = (props)=>{
      

    return(
        <button id='map-btn' onClick={props.changeMap}></button>
    );
    
}

export default MapBtn;