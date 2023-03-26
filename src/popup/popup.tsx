import React from 'react'
import ReactDOM from 'react-dom/client'
import './popup.css'

const rootElem = document.createElement('div')
rootElem.id = "root"
document.body.appendChild(rootElem)


const root = ReactDOM.createRoot(rootElem);

root.render(
  <React.StrictMode>
    <img src="icon.png" alt="Weather icon" />
    <p>API key: { process.env.REACT_APP_WEATHER_API_KEY } </p>
  </React.StrictMode>
);
