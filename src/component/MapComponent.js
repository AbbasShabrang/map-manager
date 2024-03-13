import React, {useEffect, useState} from "react";
import L from 'leaflet';
import 'leaflet-geometryutil';

const markerList = [];
let firstMarkerSelected = null;
let secondMarkerSelected = null;

function addNewMarker(map, point) {                                     //ok
    const marker = L.marker([point.Latitude, point.Longitude]).addTo(map)
          .bindPopup(point.Latitude + " , "+ point.Longitude);

    markerList.push(marker);
    return marker
}

function makeMarkersNull(){
    firstMarkerSelected = null;
    secondMarkerSelected = null;
}

function markersFun(map, point) {                                       //ok
    const marker = addNewMarker(map, point);
    // console.log(markerList);
    marker.getPane()

    marker.on('mouseover', () => {
        marker.openPopup();
    });
    
    marker.on('mouseout', () => {
        setTimeout(()=>{
            marker.closePopup()
        },200);
    });

    marker.on('popupopen', () => {
        console.log('Popup opened');
    });

    marker.on('contextmenu', (e)=>{
        const latlng = marker.getLatLng();
        console.log('Latitude:', latlng.lat, 'Longitude:', latlng.lng);
        let x = e.containerPoint.x;
        let y = e.containerPoint.y;
        console.log(x);
        console.log(y);
        showContextMenuOfMarkers(latlng, marker);
    })
    
    marker.on('click', ()=>{
        console.log("offffffff");
        // console.log("ashhdfhgasfyhfv"+marker.getLatLng());
    })
    
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

function showContextMenuOfMarkers(latlng, marker) {                                     //ok
    const contextMenuMarker = document.getElementById('contextMenu');
    contextMenuMarker.style.display = 'block';
    contextMenuMarker.style.left = marker._icon._leaflet_pos.x + 'px';
    contextMenuMarker.style.top = marker._icon._leaflet_pos.y + 'px';
    // Handle marker-specific actions here if needed
    // For example, you can pass the marker reference to identify which marker triggered the context menu
}

function drawConnection(map, marker1, marker2, color, stroke, weight, curvature_factor) {
    if (!map || !marker1 || !marker2) {
        return; // Exit early if map or markers are not valid
    }

    // Define coordinates for the polyline
    var arcPoints = calculateArcPoints(map, [marker1.Latitude, marker1.Longitude], [marker2.Latitude, marker2.Longitude], curvature_factor); // 0.5 is the curvature factor, adjust as needed
    // var latlngs = [markerList[0].getLatLng(), markerList[1].getLatLng()];

    // Create a polyline
    var polyline = L.polyline(arcPoints, {color: color, stroke: stroke, weight: weight}).addTo(map);
}

function changeOnClickOfAddConnection(points, isAddConnection){
    if (isAddConnection) {
        points.map((point)=>{
            const marker = getMarkerByLatLng(L.latLng(point.Latitude, point.Longitude))
            
            marker.off('click');
            marker.on('click', ()=>{
                console.log("ashhdfhgasfyhfv"+marker.getLatLng());
            })
        })
    }else{
        points.map((point)=>{
            const marker = getMarkerByLatLng(L.latLng(point.Latitude, point.Longitude))
            marker.off('click');
            marker.on('click', ()=>{
                console.log("you clicked on a marker");
            })
        })
    }
}

function getMarkerByLatLng(latlng) {
    for (let i = 0; i < markerList.length; i++) {
      const marker = markerList[i];
      if (marker.getLatLng().equals(latlng)) {
        return marker; // Return the marker if its LatLng matches the target LatLng
      }
    }
    return null; // Return null if no marker with the specified LatLng is found
  }

const MapComponent = (props)=>{
    const [map, setMap] = useState(null);
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    const [countInitialized, setCountInitialized] = useState(0);

    useEffect(() => {                                                                   //ok
        if (!isMapInitialized) {
            const map = L.map('map').setView([props.points[0].Latitude, props.points[0].Longitude], 7);
    
            L.tileLayer('./IRAN/{z}/{x}/{y}.png', {
                tms: true,
                maxZoom: 10,
                minZoom: 1,
                tileSize: 512,
                zoomOffset: -1
            }).addTo(map);
    
            setMap(map);
            setIsMapInitialized(true);
        }
    }, [props.points, isMapInitialized]);

    useEffect(() => {
    
        if(map){
            const connectionStablished = props.isAddConnection
            console.log("isAddConnection : "+connectionStablished);
            if (countInitialized === 0) {
                console.log("isAddConnection2 : "+connectionStablished);

                props.points.map((point) => {
                    markersFun(map, point);
                });
                props.connections.map((connection) => {
                    drawConnection(map, connection.marker1, connection.marker2, connection.status, true, 5, connection.degree)
                })
            }else{
                markersFun(map, props.points[props.points.length-1])

                changeOnClickOfAddConnection(props.points, props.isAddConnection)

                
            }

            setCountInitialized(prevCount => prevCount + 1);
    

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
        
      }, [props.points, map, props.isAddConnection]);

    useEffect(() => {
        if (map && countInitialized === 0) {
            setCountInitialized(1); // Update countInitialized to prevent infinite loop
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
        }
    }, [map, countInitialized]);


    useEffect(()=>{
        console.log(props.connections);
        const connection = props.connections[props.connections.length-1]
        drawConnection(map, connection.marker1, connection.marker2, connection.status, true, 5, connection.degree)

//todo
    }, [map, props.connections])


    useEffect(()=>{
        const isAddMarkerClickHandler = (e) => {
            // Create a new point object with clicked coordinates
            const newPoint = {
                Latitude: e.latlng.lat,
                Longitude: e.latlng.lng
            };
            // Call the addPoint function passed down as prop to add the new point
            props.addPoint(newPoint);
        };
        
        const isAddConnectionClickHandler = (e) => {
            const newConnection = {
                marker1: {Latitude: 34.23546050156551, Longitude: 50.46163671486197}, 
                marker2: {Latitude: 34.23546050156551, Longitude: 49.46163671486197},
                degree: '0.3',
                status: 'green'
            }
            props.addConnection(newConnection)
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
            console.log("teeeeeeeeeeeeeeeeeesttttttttttt2");
            map.on('click', isAddConnectionClickHandler);
            return () => {
                map.off('click', isAddConnectionClickHandler);
            };
        }

    }, [map, props.isAddMarker, props.addPoint, props.isAddConnection]);
      

    return(
        <div id="map">
            <div id="contextMenu" style={{ display: 'none', position: 'absolute' }}>
                <ul className="markerContextMenu">
                    <li className="markerContextMenuItem">Option 1</li>
                    <li className="lastMarkerContextMenuItem">Option 2</li>
                    {/* Add more options as needed */}
                </ul>
            </div>
        </div>
    );
    
}

export default MapComponent;