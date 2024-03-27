import React, {useEffect, useState} from "react";
import './TreeView.css';
// import StateContext from '../store/state-contex';

const isOpenList = [true, false, false, true]

const TreeView = (props)=>{
    const [isOpen, setIsOpen] = useState(isOpenList);


    // const ctx = useContext(StateContext);

    const handleToggle = (index) => {
        const updatedIsOpen = [...isOpen];
        updatedIsOpen[index] = !updatedIsOpen[index];
        setIsOpen(updatedIsOpen);
    };

    useEffect(() => {
        const nodes = document.querySelectorAll(".nodes");
        console.log("yeeeeeeeeeeeeeeeeeeee");
        nodes.forEach((node) => {
            console.log("nooooooooooooooo");

            node.addEventListener("contextmenu", handleNodeClick);
        });

        return () => {
            // Clean up event listeners when component unmounts
            nodes.forEach((node) => {
                node.removeEventListener("contextmenu", handleNodeClick);
            });
        };
    }, []);

    const handleNodeClick = (event) => {
        event.preventDefault();
        console.log("node targrt:", event.target);
        
        

        showContextMenuOfNode(event);
        // hideContextMenuOfNodes();  //TODO: use this function to close context menu in treeView
    }

    const showContextMenuOfNode = (event)=>{
        const nodeName = event.target.innerText;
        console.log("Clicked node:", nodeName);

        const nodePosition = event.target.getBoundingClientRect();
        console.log("nodePosition:", nodePosition);

        const contextMenuMarker = document.getElementById('nodeContextMenu');
        contextMenuMarker.style.display = 'block';
        contextMenuMarker.style.left = nodePosition.x + 'px';
        contextMenuMarker.style.top = nodePosition.y + 'px';
    }

    function hideContextMenuOfNodes() {                                                   //ok
        const contextMenu = document.getElementById('nodeContextMenu');
        contextMenu.style.display = 'none';
    }

    return(
        <ul id="tree-view">
            
            <div id="nodeContextMenu" style={{ display: 'none', position: 'absolute' }}>
                <ul className="nodeContextMenuUl">
                    <li className="markerContextMenuItem">remove marker</li>
                    <li className="lastMarkerContextMenuItem">Option 2</li>
                    {/* Add more options as needed */}
                </ul>
            </div>

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
                    <li id="add-Connection-tv" onClick={props.turnOnIsAddConnection}>add Connection</li>
                    <li>remove Connection</li>
                    </ul>
                </li>

                <li><span className={`caret ${isOpen[3] ? 'caret-down' : ''}`} onClick={()=>handleToggle(3)}>Nodes</span>
                    <ul className={`nested ${isOpen[3] ? 'active' : ''}`}>
                    <li className="nodes">TH1</li>
                    <li className="nodes">TH2</li>
                    </ul>
                </li>

                </ul>
            </li>
        </ul>
    );
    
}

export default TreeView;