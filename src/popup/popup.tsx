import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto'
import './popup.css'
import WeatherCard from './WeatherCard'

const rootElem = document.createElement('div')
rootElem.id = "root"
document.body.appendChild(rootElem)
const root = ReactDOM.createRoot(rootElem);

function App(){

   return (<>
      <WeatherCard zipcode='03053'/>
      <WeatherCard zipcode='10001'/>
      <WeatherCard zipcode='51'/>
  </>)
}



root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
