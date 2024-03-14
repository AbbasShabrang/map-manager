import React from "react";
import './MapBtn.css'

const MapBtn = (props)=>{
      

    return(
        <button className='map-btn' onClick={props.changeMap}></button>
    );
    
}

export default MapBtn;