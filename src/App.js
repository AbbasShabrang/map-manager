import './App.css';
import React, { useEffect, useState } from 'react';
import MapComponent from './component/MapComponent.js';
import AddBtn from './component/AddBtn.js';
import NewPoint from './component/NewPoint.js';
import './component/form.css'
import TreeView from './component/TreeView.js';
import DataView from './component/DataView.js';
import MapBtn from './component/MapBtn.js';
import { marker } from 'leaflet';

let samplePoints = [
  {name:"TEH1", Latitude: 35.73546050156551, Longitude: 51.16163671486197},
  {name:"TEH2", Latitude: 35.53546050156551, Longitude: 51.46163671486197},
  {name:"UKW1", Latitude: 34.23546050156551, Longitude: 50.46163671486197},
  {name:"UKW2", Latitude: 34.23546050156551, Longitude: 49.46163671486197}  
];

let sampleConnections = [
  {marker1: samplePoints[0], marker2: samplePoints[1] , degree: '0.2', status: 'red' }
];

function App() {
  const [map, setMap] = useState(null);
  const [addNewPoint, setAddNewPoint] = useState(false);
  const [newPointName, setNewPointName] = useState(null);
  const [points, setPoints] = useState(samplePoints);
  const [connections , setConnections] = useState(sampleConnections)
  const [isAddMarker, setIsAddMarker] = useState(false);
  const [isAddConnection, setIsAddConnection] = useState(false);
  const [mapType, setMapType] = useState('simple')
  const [markers, setMarkers] = useState([])

  useEffect(()=>{
    const getAllMarkersFromDB = async ()=>{
      try {
        const response = await fetch("http://localhost:8080/api/markers")
        const markersFromDB = await response.json()

        if (JSON.stringify(markersFromDB) !== JSON.stringify(markers)) {
          setMarkers(markersFromDB);
        }
      } catch (error) {
        console.log(error);
      }

    }
    getAllMarkersFromDB();
  }, [markers])


  const addPoint = (newPoint) => {
    setPoints(prevPoints => [...prevPoints, newPoint]);
  };

  const addConnection = (newConnection) => {
    setConnections(prevConnectios => [...prevConnectios, newConnection]);
  }

  const removeConnection = (removedConnection) => {

    // Filter out the removed connection from the connections state
    const updatedConnections = connections.filter(connection => (
      connection !== removedConnection
    ));
    // Update the connections state with the filtered connections
    setConnections(updatedConnections);
  }

  function turnOnIsMarker(){
    if (!isAddMarker) {
      addBtnHandler();
    }

    setIsAddMarker(!isAddMarker);
    activeDeActiveMarker()
  }


  function activeDeActiveMarker() {
    if(document.getElementById('add-Marker-tv').classList.contains('make-tv-active')){
      document.getElementById('add-Marker-tv').classList.remove('make-tv-active');
    }else{
      document.getElementById('add-Marker-tv').classList.add('make-tv-active');
    }
  }

  function changeMap(){
    if (mapType === 'simple') {
      setMapType('sattelite')
    }else{
      setMapType('simple')
    }
  }

  function turnOnIsAddConnection(){
    setIsAddConnection(!isAddConnection);
    if(document.getElementById('add-Connection-tv').classList.contains('make-tv-active')){
      document.getElementById('add-Connection-tv').classList.remove('make-tv-active');
    }else{
      document.getElementById('add-Connection-tv').classList.add('make-tv-active');
    }
  }

  function addBtnHandler(){
    setAddNewPoint(true);
  }

  function turnOffNewPointModal() {
    setAddNewPoint(false);
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    setNewPointName(event.target.elements.name.value);
    turnOffNewPointModal();
  };

  useEffect(()=>{
    if (newPointName && points.some(point => point.name === newPointName)) {
      activeDeActiveMarker()
      setIsAddMarker(!isAddMarker);
    }

  }, [newPointName])

  return (
    <div className="App">
      <TreeView turnOnIsMarker={turnOnIsMarker} map={map} setConnections={setConnections} turnOnIsAddConnection={turnOnIsAddConnection}
       markers={markers} connections={connections} points={points} setPoints={setPoints}></TreeView>
      <DataView></DataView>
      
      <MapComponent map={map} setMap={setMap} points={points} connections={connections} addPoint={addPoint} addConnection={addConnection}
       isAddMarker={isAddMarker} turnOnIsMarker={turnOnIsMarker} isAddConnection={isAddConnection} turnOnIsAddConnection={turnOnIsAddConnection} mapType={mapType}
       removeConnection={removeConnection} newPointName={newPointName} setConnections={setConnections} setPoints={setPoints}></MapComponent>

      <MapBtn changeMap={changeMap}/>

      <AddBtn AddBtn={addBtnHandler}/>
      {
        addNewPoint &&
        <NewPoint onDismiss={()=>{
          turnOffNewPointModal()
          activeDeActiveMarker()
          setIsAddMarker(!isAddMarker);

        }}>
          <form onSubmit={handleSubmit}>
            <h2>Enter your point name!</h2>
            <div className="item">
              <label htmlFor="name">Marker Name<span>*</span></label>
              <input id="name" type="text" name="name" required/>
            </div>
            <div className="btn-block">
              <button className='form-btn' type="submit" href="/">Submit name</button>
            </div>
          </form> 
          {/* <form onSubmit={turnOffNewPointModal}>
            <h2>Enter your point !</h2>
            <div className="item">
              <label htmlFor="Latitude">Latitude<span>*</span></label>
              <input id="Latitude" type="number" step='0.00000000000000001' name="Latitude" required/>
            </div>
            <div className="item">
              <label htmlFor="Longitude">Longitude<span>*</span></label>
              <input id="Longitude" type="number" step='0.00000000000000001' name="Longitude" required/>
            </div>
            <div className="btn-block">
              <button className='form-btn' type="submit" href="/">Submit</button>
            </div>
          </form> */}
        </NewPoint>
      }
    </div>

  );
}

export default App;
