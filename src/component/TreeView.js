import React, {useState} from "react";
import './TreeView.css';
// import StateContext from '../store/state-contex';

const isOpenList = [true, false, false, false]

const TreeView = (props)=>{
    const [isOpen, setIsOpen] = useState(isOpenList);


    // const ctx = useContext(StateContext);

    const handleToggle = (index) => {
        const updatedIsOpen = [...isOpen];
        updatedIsOpen[index] = !updatedIsOpen[index];
        setIsOpen(updatedIsOpen);
    };

    return(
        <ul id="tree-view">
            <li id="root-tree-view"><span className={`caret ${isOpen[0] ? 'caret-down' : ''}`} onClick={()=>handleToggle(0)}>Network</span>
                <ul className={`nested ${isOpen[0] ? 'active' : ''}`}>
                <li><span className={`caret ${isOpen[1] ? 'caret-down' : ''}`} onClick={()=>handleToggle(1)}>Marker</span>
                    <ul className={`nested ${isOpen[1] ? 'active' : ''}`}>
                    <li id="add-Marker-tv" onClick={props.turnOnIsMarker}>add Marker</li>
                    <li>remove Marker</li>
                    </ul>
                </li>

                <li><span className={`caret ${isOpen[2] ? 'caret-down' : ''}`} onClick={()=>handleToggle(2)}>Connection</span>
                    <ul className={`nested ${isOpen[2] ? 'active' : ''}`}>
                    <li>add Connection</li>
                    <li>remove Connection</li>
                    </ul>
                </li>

                <li><span className={`caret ${isOpen[3] ? 'caret-down' : ''}`} onClick={()=>handleToggle(3)}>Nodes</span>
                    <ul className={`nested ${isOpen[3] ? 'active' : ''}`}>
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