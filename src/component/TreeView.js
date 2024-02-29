import React, {useEffect, useState} from "react";
import './TreeView.css'

const TreeView = (props)=>{
    const [isOpen, setIsOpen] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);


    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleToggle2 = () => {
        setIsOpen2(!isOpen2);
    };

    return(
        <ul id="tree-view">
            <li id="root-tree-view"><span className={`caret ${isOpen ? 'caret-down' : ''}`} onClick={handleToggle}>Network</span>
                <ul className={`nested ${isOpen ? 'active' : ''}`}>
                <li><span className={`caret ${isOpen2 ? 'caret-down' : ''}`} onClick={handleToggle2}>Marker</span>
                    <ul className={`nested ${isOpen2 ? 'active' : ''}`}>
                    <li>add Marker</li>
                    <li>remove Marker</li>
                    </ul>
                </li>
                </ul>
            </li>
        </ul>
    );
    
}

export default TreeView;