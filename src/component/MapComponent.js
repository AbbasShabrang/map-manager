import React, {useEffect, useState} from "react";
import L, { map, marker, point } from 'leaflet';
import 'leaflet-geometryutil';

const markerList = [];
const polylineList = [];
var pointsToUseInMapComponent = null;

let firstMarkerSelected = null;
let secondMarkerSelected = null;

function addNewMarker(map, point) {                                     //ok
    const marker = L.marker([point.Latitude, point.Longitude]).addTo(map)
          .bindPopup(point.name + " : " + point.Latitude + " , "+ point.Longitude);
        
    
    markerList.push(marker);
    return marker
}

function makeMarkersNull(){
    firstMarkerSelected = null;
    secondMarkerSelected = null;
}



function calculateArcPoints(map, latlng1, latlng2, curvature) {
    if (!map || !latlng1 || !latlng2) {
        return []; // Return empty array if map or coordinates are not valid
    }

    var pointCount = 100; // Number of points in the arc
    var points = [];
    var latlngs = [L.latLng(latlng1), L.latLng(latlng2)]; // Convert arrays to LatLng objects
    var distance = latlngs[0].distanceTo(latlngs[1]); // Calculate distance between points

    for (var i = 0; i <= pointCount; i++) {
        var t = i / pointCount;
        var point = L.GeometryUtil.interpolateOnLine(map, latlngs, t);
        var angle = L.GeometryUtil.bearing(latlngs[0], latlngs[1]) - 90;
        var offsetDistance = distance * curvature * Math.sin(Math.PI * t); // Calculate offset distance
        var offset = L.GeometryUtil.destination(point.latLng, angle, offsetDistance);
        points.push(offset);
    }

    return points;
}

async function deleteMarkerFromDB(markerName) {
    try {
        const response = await fetch(`http://localhost:8080/api/markers/${markerName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log(`Marker with name ${markerName} deleted successfully`);
        } else {
            console.error('Failed to delete marker');
        }
    } catch (error) {
        console.error('Error deleting marker:', error);
    }
};

export function findAndRemoveMarker(nodeName, map, connections, setConnections, points, setPoints) {
    const point = pointsToUseInMapComponent.find(point => point.name === nodeName);

    if (point) {
        // Find the corresponding marker in markersList
        const correspondingMarker = markerList.find(marker => 
          marker.getLatLng().lat === point.Latitude && marker.getLatLng().lng === point.Longitude
        );
        removeMarker(map, correspondingMarker, connections, setConnections, points, setPoints)
    }else{
        console.log("not found!!!!!!!!");
    }

    deleteMarkerFromDB(nodeName)

}
function removeMarker(map, marker, connections, setConnections, points, setPoints) {
    if (marker != null) {
        map.removeLayer(marker);
        
        const index = markerList.indexOf(marker);
        if (index !== -1) {
            markerList.splice(index, 1);
        }
    }

    const removedPoint = points.find(point => point.Latitude === marker.getLatLng().lat && point.Longitude === marker.getLatLng().lng);
        if (removedPoint) {
            const updatedPoints = points.filter(point => point !== removedPoint);
            setPoints(updatedPoints);
        }

    removeConnectionsRelatedToRemovedMarker(map, removedPoint, connections, setConnections)
}

function removeConnectionsRelatedToRemovedMarker(map, removedMarker, connections, setConnections) {
    console.log("removedPoint : ", removedMarker);
    const connectionsToRemove = polylineList.filter(polylineElement => {
        const marker1Match = removedMarker.Latitude === polylineElement.mark1LatLng.lat && removedMarker.Longitude === polylineElement.mark1LatLng.lng;
        const marker2Match = removedMarker.Latitude === polylineElement.mark2LatLng.lat && removedMarker.Longitude === polylineElement.mark2LatLng.lng;

        // Keep connections where either marker1 or marker2 doesn't match the removed marker
        return (marker1Match || marker2Match);
    });

    const updatedConnections = connections.filter(connection => {
        const marker1Match = removedMarker.Latitude === connection.marker1.Latitude && removedMarker.Longitude === connection.marker1.Longitude;
        const marker2Match = removedMarker.Latitude === connection.marker2.Latitude && removedMarker.Longitude === connection.marker2.Longitude;

        // Keep connections where either marker1 or marker2 doesn't match the removed marker
        return !(marker1Match || marker2Match);
    });


    // // Update the connections state with the filtered connections
    setConnections(updatedConnections);

    // Remove the corresponding layers from the map
    connectionsToRemove.forEach(connection => {
        map.removeLayer(connection.polyline);
    });
}


function changeCursorIcon(map, isAddMarker, isAddConnection) {                       //ok
    if (isAddMarker && isAddConnection){
        map.getContainer().style.cursor = 'not-allowed'
        alert('you can\'t do more than one task!!!')
    } else if (isAddMarker) {
        map.getContainer().style.cursor = 'pointer';
    } else if(isAddConnection){
        map.getContainer().style.cursor = 'copy';
    } else {
        map.getContainer().style.cursor = '';
    }
}

function hideContextMenuOfMarkers() {                                                   //ok
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'none';
}

function showContextMenuOfMarkers(marker) {                                     //ok
    const contextMenuMarker = document.getElementById('contextMenu');
    contextMenuMarker.style.display = 'block';
    contextMenuMarker.style.left = marker._icon._leaflet_pos.x + 'px';
    contextMenuMarker.style.top = marker._icon._leaflet_pos.y + 'px';
    // Handle marker-specific actions here if needed
    // For example, you can pass the marker reference to identify which marker triggered the context menu
}

function drawConnection(map, marker1_Latitude, marker1_Longitude, marker2_Latitude, marker2_Longitude, color, stroke, weight, curvature_factor) {
    if (!map || !marker1_Latitude || !marker2_Latitude) {
        return; // Exit early if map or markers are not valid
    }

    // Define coordinates for the polyline
    var arcPoints = calculateArcPoints(map, [marker1_Latitude, marker1_Longitude], [marker2_Latitude, marker2_Longitude], curvature_factor); // 0.5 is the curvature factor, adjust as needed
    // var latlngs = [markerList[0].getLatLng(), markerList[1].getLatLng()];

    // Create a polyline
    var polyline = L.polyline(arcPoints, {color: color, stroke: stroke, weight: weight}).addTo(map);
    polylineList.push({polyline:polyline, mark1LatLng:{lat:marker1_Latitude, lng:marker1_Longitude},
         mark2LatLng:{lat:marker2_Latitude, lng:marker2_Longitude} } )
    return {polyline:polyline, marker1:{marker1_Latitude, marker1_Longitude}, marker2:{marker2_Latitude, marker2_Longitude}}
}

function changeOnClickOfAddConnection(map, isAddConnection, addConnection, points, turnOnIsAddConnection) {
    markerList.map((marker) => {
        if (isAddConnection) {
            marker.off('click');
            marker.on('click', () => {
                console.log(marker);

                // Find the corresponding point in points state based on marker's lat and lng
                const selectedPoint = points.find(point => point.Latitude === marker.getLatLng().lat && point.Longitude === marker.getLatLng().lng);
                
                if (firstMarkerSelected == null) {
                    firstMarkerSelected = selectedPoint;
                } else if (secondMarkerSelected == null) {
                    secondMarkerSelected = selectedPoint;
                    if (secondMarkerSelected === firstMarkerSelected) {
                        secondMarkerSelected = null;
                    }
                }
                if (firstMarkerSelected != null && secondMarkerSelected != null) {
                    const newConnection = { marker1: firstMarkerSelected, marker2: secondMarkerSelected, degree: '0.4', status: 'yellow' };
                    addConnection(newConnection);
                    drawConnection(map, newConnection.marker1.Latitude, newConnection.marker1.Longitude,
                        newConnection.marker2.Latitude, newConnection.marker2.Longitude,
                        newConnection.status, true, 5, newConnection.degree);
                    makeMarkersNull();
                    turnOnIsAddConnection(false)
                }
            })

        } else {
            marker.off('click');
            marker.on('click', () => {
                console.log("you clicked on a marker");
            })
        }
    })

}


const handleClickOutside = (event) => {
    if (!event.target.closest("#nodeContextMenu")) {
        hideContextMenuOfMarkers();
    }
};


// function getMarkerByLatLng(latlng) {
//     for (let i = 0; i < markerList.length; i++) {
//       const marker = markerList[i];
//       if (marker.getLatLng().equals(latlng)) {
//         return marker; // Return the marker if its LatLng matches the target LatLng
//       }
//     }
//     return null; // Return null if no marker with the specified LatLng is found
// }

const MapComponent = (props)=>{
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    const [firstInitialized, setFirstInitialized] = useState(false);
    const [newPointAdded, setNewPointAdded] = useState(false);
    const [mapAddress, setMapAddress] = useState('./IRAN/SIMPLE_MAP/{z}/{x}/{y}.png')
    const [map, setMap] = useState(null);


    useEffect(()=>{
        pointsToUseInMapComponent = props.points;
    }, [props.points])

    function markersFun(map, point) {                                       //ok
        const marker = addNewMarker(map, point);
        marker.getPane()
    
        marker.on('mouseover', () => {
            marker.openPopup();
        });
        
        marker.on('mouseout', () => {
            setTimeout(()=>{
                marker.closePopup()
            },200);
        });
    
        marker.on('contextmenu', (e)=>{
            showContextMenuOfMarkers(marker);
            setSelectedMarker(marker);
        })
        
        marker.on('click', ()=>{
            console.log("offffffff");
        })
        
    }

    useEffect(() => {                                                                   //ok
        if (!isMapInitialized) {
            const map = L.map('map').setView([props.points[0].Latitude, props.points[0].Longitude], 7);
            props.setMap(map);
            setMap(map);
            setIsMapInitialized(true);
        }
        
    }, [props.points, isMapInitialized]);

    useEffect(() => {       
        const contextMenu = document.getElementById('map-btn');
        if (contextMenu) {
            if (props.mapType === 'sattelite') {
                contextMenu.style.background =  "url('/simple-map-icon.png') no-repeat center center rgba(255, 238, 217, 0.495)";

                setMapAddress('./IRAN/SATTELITE/{z}/{x}/{y}.jpg');
            } else {
                contextMenu.style.background =  "url('/sattelite-icon.png') no-repeat center center rgba(255, 238, 217, 0.495)";

                setMapAddress('./IRAN/SIMPLE_MAP/{z}/{x}/{y}.png');
            }
        }else {
            console.log("Element with ID 'map-btn' not found.");
        }
        
    }, [props.mapType]);

    useEffect(() => {
        if (map) {
            map.eachLayer(layer => {
                if (layer instanceof L.TileLayer) {
                    map.removeLayer(layer); // Remove existing layers
                }
            });
    
            L.tileLayer(mapAddress, {
                tms: true,
                maxZoom: 10,
                minZoom: 1,
                tileSize: 512,
                zoomOffset: -1
            }).addTo(map);
        }
    }, [map, mapAddress]);
    
    useEffect(() => {
    
        if(map){
            if (!firstInitialized) {
                props.points.map((point) => {
                    markersFun(map, point)
                });
                props.connections.map((connection) => {
                    drawConnection(map, connection.marker1.Latitude, connection.marker1.Longitude,
                        connection.marker2.Latitude, connection.marker2.Longitude, connection.status, true, 5, connection.degree)
                })
                setFirstInitialized(true);

            }else{
                if (newPointAdded) {
                    markersFun(map, props.points[props.points.length-1])
                    setNewPointAdded(false)
                    
                }else{
                    changeOnClickOfAddConnection(map, props.isAddConnection, props.addConnection, props.points, props.turnOnIsAddConnection)
                }


                
            }

    

            // console.log(map.getCenter()); 
            
            // console.log(map.getBounds()); 
            
            // map.removeLayer(firstMarker)
    
            // const customAnimationOptions = {
            //     duration: 2, // Animation duration in seconds
            //     easeLinearity: 0.25, // Animation easing, 0.25 is the default value
            // };
    
            // setTimeout(() => {
            //     firstMarker.openPopup();
    
            //     map.flyTo([props.latitude, props.longitude], 9, customAnimationOptions);
            // }, 1000);
    
        }
        
      }, [newPointAdded, map, props.isAddConnection]);

    useEffect(() => {
        if (map && !firstInitialized) {
            setFirstInitialized(true);
            L.control.scale().addTo(map);

            map.on('dragend', () => {
                console.log('Map dragged');
            });
    
            map.on('click', (e) => {
                console.log('Map clicked at:', e.latlng);
                hideContextMenuOfMarkers();
            });
    
            map.on('contextmenu', (e)=>{
                console.log("abbbbbbbas : ", e.type);
                hideContextMenuOfMarkers();
            });
            document.addEventListener("click", handleClickOutside);

        }
    }, [map, firstInitialized]);


    useEffect(()=>{
        if (props.isAddConnection){
            console.log(props.connections);
            const connection = props.connections[props.connections.length-1]
            var x = drawConnection(map, connection.marker1.Latitude, connection.marker1.Longitude,
                connection.marker2.Latitude, connection.marker2.Longitude, connection.status, true, 5, connection.degree)
    
        }
        
//todo
    }, [map, props.connections])





    useEffect(()=>{
        const isAddMarkerClickHandler = (e) => {
            // Create a new point object with clicked coordinates
            const newPoint = {
                name: props.newPointName,
                Latitude: e.latlng.lat,
                Longitude: e.latlng.lng
            };
            // Call the addPoint function passed down as prop to add the new point
            props.addPoint(newPoint); /////////////////////////////////////////////////////////////todo: add new point in data base
            setNewPointAdded(true)
            //todo
            props.turnOnIsMarker()
            
        };


        if (map){
            changeCursorIcon(map, props.isAddMarker, props.isAddConnection)
        }

        if (!map) return; // Exit early if map is not initialized or isAddMarker is false
        
        if(!props.isAddMarker && !props.isAddConnection) return;
        

        if (props.isAddMarker && !props.isAddConnection) {
            map.on('click', isAddMarkerClickHandler); // Attach click handler
            return () => {
                map.off('click', isAddMarkerClickHandler); // Detach click handler when component unmounts or when isAddMarker becomes false
            };
        } else if(!props.isAddMarker && props.isAddConnection){
            
        }

    }, [map, props.isAddMarker, props.addPoint, props.isAddConnection]);
      

    return(
        <div id="map">
            <div id="contextMenu" style={{ display: 'none', position: 'absolute' }}>
                <ul className="markerContextMenu">
                    <li className="markerContextMenuItem" onClick={()=>removeMarker(map, selectedMarker, props.connections, props.setConnections, props.points, props.setPoints)}>remove marker</li>
                    <li className="lastMarkerContextMenuItem">Option 2</li>
                    {/* Add more options as needed */}
                </ul>
            </div>
        </div>
    );
    
}

export default MapComponent;