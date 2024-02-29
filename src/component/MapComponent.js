import React, {useEffect, useState} from "react";
import L from 'leaflet';


function markersFun(map, point) {
    const marker = L.marker([point.Latitude, point.Longitude]).addTo(map)
          .bindPopup(point.Latitude + " , "+ point.Longitude);

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

    marker.on('contextmenu', ()=>{
        console.log("kaslndjksadahbasjk");
    })
}

const MapComponent = (props)=>{
    
    useEffect(() => {
        const map = L.map('map').setView([props.points[0].Latitude, props.points[0].Longitude], 3);
    
        L.tileLayer('./IRAN/{z}/{x}/{y}.png', {
          tms:true,
          maxZoom: 10,
          minZoom: 1,
          tileSize: 512,
          zoomOffset: -1
        }).addTo(map);
    
        props.points.map((point)=>{
            markersFun(map, point);
        });

        map.on('dragend', () => {
            console.log('Map dragged');
        });

        map.on('click', (e) => {
            console.log('Map clicked at:', e.latlng);
        });

        map.on('contextmenu', (e)=>{
            console.log("abbbbbbbas : ", e.type);
        })

        

        L.control.scale().addTo(map);

        // const secondMarker = L.marker([props.points[1].Latitude+1, props.points[1].Longitude]).addTo(map);
        // map.addLayer(secondMarker);

        // console.log(map.getCenter()); 
        
        console.log(map.getBounds()); 
        
        // map.removeLayer(firstMarker)

        const customAnimationOptions = {
            duration: 2, // Animation duration in seconds
            easeLinearity: 0.25, // Animation easing, 0.25 is the default value
        };

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


      }, [props.points]);

      

    return(
        <div id="map"></div>
    );
    
}

export default MapComponent;