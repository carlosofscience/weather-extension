import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto'
import { Card } from '@mui/material'
import WeatherCard from '../components/WeatherCard'
import './contentScript.css'
import { getStoredOptions, LocalStorageOptions } from '../utils/storage'

const rootElem = document.createElement('div')
rootElem.id = "root"
document.body.appendChild(rootElem)
const root = ReactDOM.createRoot(rootElem);
 
const App: React.FC<{}> = ()=>{

  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

  useEffect(()=>{
    getStoredOptions().then(options => setOptions(options))
  }, [])

  if(!options) return null;

  return <Card className='overlayCard'>
    <WeatherCard zipcode={options.homeCity} tempScale={options.tempScale}/>
  </Card>
}

root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
