import React, {useEffect, useState} from "react";
import './TreeView.css';
// import StateContext from '../store/state-contex';

const isOpenList = [true, false, false, true]



const TreeView = (props)=>{
    const [isOpen, setIsOpen] = useState(isOpenList);

    const handleClickOutside = (event) => {
        if (!event.target.closest("#nodeContextMenu") && !event.target.closest("#nodesContextMenu")) {
            hideContextMenuOfNodes();
            hideContextMenuOfNode();

        }
    };

    // const ctx = useContext(StateContext);

    const handleToggle = (index) => {
        const updatedIsOpen = [...isOpen];
        updatedIsOpen[index] = !updatedIsOpen[index];
        setIsOpen(updatedIsOpen);
    };

    useEffect(() => {
        const nodes = document.querySelectorAll(".node");
        const nodesElement = document.querySelectorAll(".nodes");


        // nodesElement.addEventListener("contextmenu", handleNodesClick);

        nodes.forEach((node) => {

            node.addEventListener("contextmenu", handleNodeClick);
        });
        document.addEventListener("click", handleClickOutside);

        return () => {
            // Clean up event listeners when component unmounts
            nodes.forEach((node) => {
                node.removeEventListener("contextmenu", handleNodeClick);
            });
            nodesElement.removeEventListener("contextmenu", handleNodesClick);

            document.removeEventListener("click", handleClickOutside);

        };
    }, []);

    const handleNodeClick = (event) => {
        event.preventDefault();
        console.log("node targrt:", event.target);
        
        

        showContextMenuOfNode(event);
    }

    const handleNodesClick = (event) => {
        event.preventDefault();        
        
        showContextMenuOfNodes(event);
    }

    const showContextMenuOfNode = (event)=>{
        const nodeName = event.target.innerText;
        console.log("Clicked node:", nodeName);

        const nodePosition = event.target.getBoundingClientRect();
        console.log("nodePosition:", nodePosition);

        const contextMenuMarker = document.getElementById('nodeContextMenu');
        contextMenuMarker.style.display = 'block';
        contextMenuMarker.style.left = (nodePosition.x+25) + 'px';
        contextMenuMarker.style.top = (nodePosition.y+14) + 'px';
    }

    const showContextMenuOfNodes = (event)=>{

        const nodesPosition = event.target.getBoundingClientRect();
        console.log("nodesPosition:", nodesPosition);

        const contextMenuMarker = document.getElementById('nodesContextMenu');
        contextMenuMarker.style.display = 'block';
        contextMenuMarker.style.left = (nodesPosition.x+25) + 'px';
        contextMenuMarker.style.top = nodesPosition.y + 'px';
    }

    function hideContextMenuOfNode() {                                                   //ok
        const contextMenu = document.getElementById('nodeContextMenu');
        contextMenu.style.display = 'none';
    }


    function hideContextMenuOfNodes() {                                                   //ok
        const contextMenu = document.getElementById('nodesContextMenu');
        contextMenu.style.display = 'none';
    }

    return(
        <ul id="tree-view">
            <div id="nodesContextMenu" style={{ display: 'none', position: 'absolute' }}>
                <ul className="nodeContextMenuUl">
                    <li className="nodeContextMenuItem">add new marker</li>
                    <li className="lastNodeContextMenuItem">Option 2</li>
                    {/* Add more options as needed */}
                </ul>
            </div>

            <div id="nodeContextMenu" style={{ display: 'none', position: 'absolute' }}>
                <ul className="nodeContextMenuUl">
                    <li className="nodeContextMenuItem">remove marker</li>
                    <li className="lastNodeContextMenuItem">Option 2</li>
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
                    <li className="node">TEH1</li>
                    <li className="node">TEH2</li>
                    </ul>
                </li>

                </ul>
            </li>
        </ul>
    );
    
}

export default TreeView;