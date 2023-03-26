import React, { useEffect }from 'react'
import ReactDOM from 'react-dom/client'
import './popup.css'
import { fetchWeatherData } from '../utils/API'


const rootElem = document.createElement('div')
rootElem.id = "root"
document.body.appendChild(rootElem)
const root = ReactDOM.createRoot(rootElem);

function App(){

  useEffect(()=>{
    fetchWeatherData("03053")
    .then( data =>{
      console.log(data.location.name);
      console.log(data.current.temp_f);
    })
    .catch(err =>{
      console.log(err);
    })
  }, [])

   return (<>
    <img src="icon.png" alt="Weather icon" />
  </>)
}



root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
