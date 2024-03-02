import React, {useEffect, useState, useContext} from "react";
import './TreeView.css';
import StateContext from '../store/state-contex';

const TreeView = (props)=>{
    const [isOpen, setIsOpen] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);


    const ctx = useContext(StateContext);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleToggle2 = () => {
        setIsOpen2(!isOpen2);
    };

    const handleToggle3 = () => {
        setIsOpen3(!isOpen3);
    };

    const handleToggle4 = () => {
        setIsOpen4(!isOpen4);
    };

    return(
        <ul id="tree-view">
            <li id="root-tree-view"><span className={`caret ${isOpen ? 'caret-down' : ''}`} onClick={handleToggle}>Network</span>
                <ul className={`nested ${isOpen ? 'active' : ''}`}>
                <li><span className={`caret ${isOpen2 ? 'caret-down' : ''}`} onClick={handleToggle2}>Marker</span>
                    <ul className={`nested ${isOpen2 ? 'active' : ''}`}>
                    <li id="add-Marker-tv" onClick={props.turnOnIsMarker}>add Marker</li>
                    <li>remove Marker</li>
                    </ul>
                </li>

                <li><span className={`caret ${isOpen3 ? 'caret-down' : ''}`} onClick={handleToggle3}>Connection</span>
                    <ul className={`nested ${isOpen3 ? 'active' : ''}`}>
                    <li>add Connection</li>
                    <li>remove Connection</li>
                    </ul>
                </li>

                <li><span className={`caret ${isOpen4 ? 'caret-down' : ''}`} onClick={handleToggle4}>Nodes</span>
                    <ul className={`nested ${isOpen4 ? 'active' : ''}`}>
                    <li>TH1</li>
                    <li>TH2</li>
                    </ul>
                </li>

                </ul>
            </li>
        </ul>
    );
    
}

export default TreeView;