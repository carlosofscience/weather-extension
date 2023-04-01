import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto'
import './popup.css'
import WeatherCard from '../components/WeatherCard'

import { Box, InputBase, Grid, IconButton, Paper } from '@mui/material'
import {Add as AddIcon, PictureInPicture as PictureInPictureIcon} from '@mui/icons-material';
import { setStoredCities, setStoredOptions, getStoredCities, getStoredOptions, LocalStorageOptions } from '../utils/storage'
import { Messages } from '../utils/messages'
const rootElem = document.createElement('div')
rootElem.id = "root"
document.body.appendChild(rootElem)
const root = ReactDOM.createRoot(rootElem);
 
function App(){

  const [zipcodes, setZipcodes] = useState<string[]>([])
  const [zipcodeInput, setZipcodeInput] = useState<string>("")
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

    useEffect(()=>{
      //load data when popup opens
      getStoredCities().then(cities =>{
        setZipcodes(cities)
      })
      getStoredOptions().then((options)=>{
        console.log('got options: ', options);
        
        setOptions(options)
      })
    }, [])

    const handleZipcodeButtonOnClick = ()=>{

      if (zipcodeInput === ''){
        return
      }
      const updatedZipcodes = [...zipcodes, zipcodeInput]

      setStoredCities(updatedZipcodes).then(()=>{
        console.log("saved cities on local");
        setZipcodes(updatedZipcodes)
        setZipcodeInput('')
      })
    }
    
    const handleZipcodeDeleteButtonOnClick= (index: number)=>{
      zipcodes.splice(index, 1)      
      const updatedZipcodes = [...zipcodes]
      setStoredCities(updatedZipcodes).then(()=>{
        setZipcodes(updatedZipcodes)
      })
    }

    const handleTempScaleBottonClick = () =>{
      const updateOptions: LocalStorageOptions = {
        ...options,
        tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
      }
      setStoredOptions(updateOptions).then(()=>{
        setOptions(updateOptions)
        // updating content script (overlay)
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          var activeTab = tabs[0];
          console.log("trying to update tempscale overlay for ", activeTab);
          injectContentScript(activeTab, sendUpdateTempScaleMessage);
        });
      })
      //update badge
      chrome.runtime.sendMessage({message: Messages.UPDATE_BADGE}, response => {
        console.log(response);
      });
    }

    const handleOverlayButtonOnClick = ()=>{
      // Get the current active tab and inject content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        console.log("trying to toggle overlay for: ", activeTab);
        injectContentScript(activeTab, sendToggleMessage);
      });
    }

    
    if(!options) return null //or use load instead

    return (<>
   <Box px={'8px'} py={'16px'} className='popup-container' boxSizing={'border-box'}>
      <Grid container justifyContent={'space-around'}>
        <Grid item className='frosted'>
          <Paper>
            <Box px={'15px'} py={'5px'}>
              <InputBase placeholder='Add a zipcode or city' value={zipcodeInput} onChange={(e)=> setZipcodeInput(e.target.value)}/>
              <IconButton onClick={handleZipcodeButtonOnClick}>
                <AddIcon/>
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item className='frosted'>
          <Paper>
            <Box py="3px">
              <IconButton onClick={handleTempScaleBottonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item className='frosted'>
          <Paper>
            <Box py="5px">
              <IconButton onClick={handleOverlayButtonOnClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {
        options.homeCity != '' && <WeatherCard zipcode={options.homeCity} tempScale={options.tempScale} />
      }
      
      { zipcodes.map( (zipcode, index )=> <WeatherCard zipcode={zipcode} tempScale={options.tempScale} key={index} onDelete={()=>{handleZipcodeDeleteButtonOnClick(index)}}></WeatherCard>) }
      <Box height={"16px"}></Box>
   </Box>
  </>)
}

root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);

// Inject content script and send a message to it
function injectContentScript(tab, callback) {

  let CONTENT_SCRIPT_ENABLED: boolean;
  console.log("executeScript to tab.id: ", tab.id);

  // Check if the content script is already present
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        return window && typeof window['CONTENT_SCRIPT_ENABLED'] !== 'undefined'
      },
    },
    function (results) {
      console.log("got results: ", results);
      
      if (chrome.runtime.lastError) {
        // Handle errors
        console.log(chrome.runtime.lastError);
        
      } else {
        var isAlreadyPresent = results[0].result === true;
        if (!isAlreadyPresent) {
          // Inject the content script
          console.log("Injecting the content script to tab: ", tab);
          
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              files: ["contentScript.js"],
            },
            function () {
              // Send a message to the content script
              callback(tab.id)
            }
          );
        } else {
          // Send a message to the content script
          callback(tab.id)
        }
      }
    }
  );
}

// Inject content script and send a message to it
function sendToggleMessage(tabId) {
  chrome.tabs.sendMessage(
    tabId,
    Messages.TOGGLE_OVERLAY,
    function (response) {
      console.log(response);
    }
  );
}

function sendUpdateTempScaleMessage(tabId) {
  chrome.tabs.sendMessage(
    tabId,
    Messages.UPDATE_TEMPSCALE,
    function (response) {
      console.log(response);
    }
  );
}


