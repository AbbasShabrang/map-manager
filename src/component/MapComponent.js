import React, {useEffect, useState} from "react";
import L from 'leaflet';
import 'leaflet-geometryutil';

const markerList = [];

function addNewMarker(map, point) {
    const marker = L.marker([point.Latitude, point.Longitude]).addTo(map)
          .bindPopup(point.Latitude + " , "+ point.Longitude);

    markerList.push(marker);
    return marker
}

function markersFun(map, point) {
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

function calculateArcPoints(map, latlng1, latlng2, curvature) {
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

function changeCursorIcon(map, isAddMarker) {
    if (isAddMarker) {
        map.getContainer().style.cursor = 'pointer';
        console.log("mahdi");
    } else {
        map.getContainer().style.cursor = '';
        console.log("ksjjakdbhaasbhjdsvhjchjxwdsjacjhdabs'm");
    }
}

function hideContextMenuOfMarkers() {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'none';
}

function showContextMenuOfMarkers(latlng, marker) {
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

    useEffect(() => {
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

            if (countInitialized == 0) {
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
    
            // polyline.addEventListener('mouseover', ()=>{
            //     arcPoints.map((x)=>{
            //         console.log(x);
            //     })
            // });
    
            // const secondMarker = L.marker([props.points[1].Latitude+1, props.points[1].Longitude]).addTo(map);
            // map.addLayer(secondMarker);
    
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
    
    
    
            // setTimeout(() => {
            //     // Add a marker for the user's location
            //     let marker = null;
    
            //     // Locate the user's position
            //     map.locate({ setView: true, watch: true }) // enable continuous location updates
            //     .on('locationfound', (e) => {
            //         // If marker is already on the map, remove it
            //         if (marker) {
            //         map.removeLayer(marker);
            //         }
    
            //         marker = L.marker(e.latlng).addTo(map);
            //         marker.bindPopup('You are here!').openPopup();
            //     })
            //     .on('locationerror', (e) => {
            //         alert("Location access denied.");
            //     });
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
        if (map){
            changeCursorIcon(map, props.isAddMarker)
        }

        if (!map || !props.isAddMarker) return; // Exit early if map is not initialized or isAddMarker is false
        const clickHandler = (e) => {
            // Create a new point object with clicked coordinates
            const newPoint = {
                Latitude: e.latlng.lat,
                Longitude: e.latlng.lng
            };
            // Call the addPoint function passed down as prop to add the new point
            props.addPoint(newPoint);
        };
        map.on('click', clickHandler); // Attach click handler
        return () => {
            map.off('click', clickHandler); // Detach click handler when component unmounts or when isAddMarker becomes false
        };
    }, [map, props.isAddMarker, props.addPoint, props]);
      

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