import './App.css';
import React, { useEffect, useState } from 'react';
import MapComponent from './component/MapComponent.js';
import AddBtn from './component/AddBtn.js';
import NewPoint from './component/NewPoint.js';
import './component/form.css'
import TreeView from './component/TreeView.js';
import DataView from './component/DataView.js';

let samplePoints = [
  {Latitude: 35.73546050156551, Longitude: 51.16163671486197},
  {Latitude: 35.53546050156551, Longitude: 51.46163671486197}
  
];

function App() {
  const [addNewPoint, setAddNewPoint] = useState(false);
  const [points, setPoints] = useState(samplePoints);
  const [isAddMarker, setIsAddMarker] = useState(false);
  


  const addPoint = (newPoint) => {
    setPoints(prevPoints => [...prevPoints, newPoint]);
  };

  useEffect(()=>{
    console.log(isAddMarker);
  },[isAddMarker]);

  function turnOnIsMarker(){
    setIsAddMarker(!isAddMarker);
    if(document.getElementById('add-Marker-tv').classList.contains('make-tv-active')){
      document.getElementById('add-Marker-tv').classList.remove('make-tv-active');
    }else{
      document.getElementById('add-Marker-tv').classList.add('make-tv-active');
    }
  }

  function addBtnHandler(){
    setAddNewPoint(true);
  }

  function turnOffNewPointModal() {
    setAddNewPoint(false);
    console.log("asaddsadasdasdsa");
  }

  return (
    <div className="App">
      <TreeView turnOnIsMarker={turnOnIsMarker}></TreeView>
      <DataView></DataView>
      <MapComponent points={points} addPoint={addPoint} isAddMarker={isAddMarker}></MapComponent>
      <AddBtn AddBtn={addBtnHandler}/>
      {
        addNewPoint &&
        <NewPoint onDismiss={turnOffNewPointModal}>
          <form onSubmit={turnOffNewPointModal}>
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
          </form>
        </NewPoint>
      }
    </div>

  );
}

export default App;
