import './App.css';
import React, { useState } from 'react';
import MapComponent from './component/MapComponent.js';
import AddBtn from './component/AddBtn.js';
import NewPoint from './component/NewPoint.js';
import './component/form.css'
import TreeView from './component/TreeView.js';

let samplePoints = [
  {Latitude: 35.73546050156551, Longitude: 51.16163671486197},
  {Latitude: 35.53546050156551, Longitude: 51.46163671486197}
  
];




function App() {
  const [addNewPoint, setAddNewPoint] = useState(false);
  const [points, setPoints] = useState(samplePoints);

  function addBtnHandler(){
    setAddNewPoint(true);
  }

  function turnOffNewPointModal() {
    setAddNewPoint(false);
    console.log("asaddsadasdasdsa");
  }

  return (
    <div className="App">

      <TreeView></TreeView>
      
      <MapComponent points={points}></MapComponent>

      <AddBtn AddBtn={addBtnHandler}/>
      {
        addNewPoint &&
        <NewPoint onDismiss={turnOffNewPointModal}>

          <div className="testbox">
            
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
                <button type="submit" href="/">Submit</button>
              </div>

            </form>
          </div>

        </NewPoint>
      }
      
    </div>
  );
}

export default App;
