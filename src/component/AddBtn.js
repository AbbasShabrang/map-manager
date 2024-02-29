import React from "react";
import './AddBtn.css'

const AddBtn = (props)=>{
      

    return(
        <button className='add-button' onClick={props.AddBtn}>Add New Point +</button>
    );
    
}

export default AddBtn;