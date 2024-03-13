import React, {useEffect, useState} from "react";
import L from 'leaflet';
import 'leaflet-geometryutil';

const markerList = [];

function addNewMarker(map, point) {                                     //ok
    const marker = L.marker([point.Latitude, point.Longitude]).addTo(map)
          .bindPopup(point.Latitude + " , "+ point.Longitude);

    markerList.push(marker);
    return marker
}

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
}

function calculateArcPoints(map, latlng1, latlng2, curvature) {                     //ok
    var pointCount = 100; // Number of points in the arc
    var points = [];
    var latlngs = [latlng1, latlng2];
    for (var i = 0; i <= pointCount; i++) {
        var t = i / pointCount;
        var point = L.GeometryUtil.interpolateOnLine(map, latlngs, t);
        var angle = L.GeometryUtil.bearing(latlng1, latlng2) - 90;
        var distance = latlng1.distanceTo(latlng2) * curvature * Math.sin(Math.PI * t);
        var offset = L.GeometryUtil.destination(point.latLng, angle, distance);
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

            if (countInitialized === 0) {
                props.points.map((point) => {
                    markersFun(map, point);
                });
            }else{
                markersFun(map, props.points[props.points.length-1])
            }

            setCountInitialized(prevCount => prevCount + 1);
    
                        
            // Define coordinates for the polyline
            var arcPoints = calculateArcPoints(map, markerList[0].getLatLng(), markerList[1].getLatLng(), 0.5); // 0.5 is the curvature factor, adjust as needed
            var arcPoints2 = calculateArcPoints(map, markerList[0].getLatLng(), markerList[1].getLatLng(), 0); // 0.5 is the curvature factor, adjust as need
            // var latlngs = [markerList[0].getLatLng(), markerList[1].getLatLng()];
    
            // Create a polyline
            var polyline = L.polyline(arcPoints, {color: 'red', stroke: true, weight: 5}).addTo(map);
            var polyline2 = L.polyline(arcPoints2, {color: 'blue', stroke: true, weight: 5}).addTo(map);
            console.log("tesssssssssssssst");
    
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
        
      }, [props.points, map]);

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
//todo
    }, [props.connections])


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
            map.on('click', isAddConnectionClickHandler); // Attach click handler
            return () => {
                map.off('click', isAddConnectionClickHandler); // Detach click handler when component unmounts or when isAddMarker becomes false
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