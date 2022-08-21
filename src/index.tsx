import React from 'react';
import ReactDOM from 'react-dom/client';
import My3DView from './Components/view3d';
import './Styles/index.scss';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <My3DView/>
  </React.StrictMode>
);


