import React, {useEffect, useState} from 'react';

const StateContext = React.createContext({
    isAddMarker: false
});

export default StateContext;