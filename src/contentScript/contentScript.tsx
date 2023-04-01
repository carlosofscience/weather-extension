import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
// import '@fontsource/roboto'
import { Card } from '@mui/material'
import WeatherCard from '../components/WeatherCard'
import './contentScript.css'
import { getStoredOptions, LocalStorageOptions } from '../utils/storage'
import { Messages } from '../utils/messages'

window['CONTENT_SCRIPT_ENABLED'] = true;

const rootElem = document.createElement('div')
rootElem.id = "root"
document.body.appendChild(rootElem)
const root = ReactDOM.createRoot(rootElem);
 
const App: React.FC<{}> = ()=>{

  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [isActive, setIsActive] = useState<boolean>(false);


  useEffect(()=>{
    getStoredOptions().then(options => {
      setOptions(options)
      setIsActive(options.hasAutoOverlay)
    })
  }, [])

  //Listening for messages
  useEffect(()=>{
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) =>{
      if(msg === Messages.TOGGLE_OVERLAY){
        setIsActive(!isActive)
        sendResponse('overlay has been toggled!')
      }else if(msg === Messages.UPDATE_TEMPSCALE){
         getStoredOptions().then(options => {
          setOptions(options)
          setIsActive(options.hasAutoOverlay)
        })
        sendResponse('overlay has been Updated!')
      }
    })
  }, [isActive])

  if(!options) return null;
  
  return <>
    {
      isActive && <Card className='overlayCard'>
        <WeatherCard zipcode={options.homeCity} tempScale={options.tempScale} onDelete={()=>{setIsActive(false)}} />
      </Card>
    }
  </>
}

root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
