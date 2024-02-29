import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import './NewPoint.css';

const Backdrop = (props) => {
    return <div className='backdrop' onClick={props.onClick} />;
};
  
const ModalOverlay = (props) => {
  return (
    <div className={'modal'}>
      <div className={'content'}>{props.children}</div>
    </div>
  );
};
  
const portalElement = document.getElementById('overlays');
  
const NewPoint = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop onClick={props.onDismiss} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};
  

export default NewPoint;