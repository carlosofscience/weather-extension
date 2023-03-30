import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto'
import './popup.css'
import WeatherCard from './WeatherCard'

import { Box, InputBase, Grid, IconButton, Paper, getTableSortLabelUtilityClass } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { setStoredCities, setStoredOptions, getStoredCities, getStoredOptions, LocalStorageOptions } from '../utils/storage'

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
      })
    }

    
    if(!options) return null //or use load instead

    return (<>
   <Box mx={'8px'} my={'16px'}>
      <Grid container justifyContent={'space-around'}>
        <Grid item>
          <Paper>
            <Box px={'15px'} py={'5px'}>
              <InputBase placeholder='Add a zipcode or city' value={zipcodeInput} onChange={(e)=> setZipcodeInput(e.target.value)}/>
              <IconButton onClick={handleZipcodeButtonOnClick}>
                <AddIcon/>
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="3px">
              <IconButton onClick={handleTempScaleBottonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {
        options.homeCity != '' && <WeatherCard zipcode={options.homeCity} options={options} />
      }
      
      { zipcodes.map( (zipcode, index )=> <WeatherCard zipcode={zipcode} options={options} key={index} onDelete={()=>{handleZipcodeDeleteButtonOnClick(index)}}></WeatherCard>) }
      <Box height={"16px"}></Box>
   </Box>
  </>)
}

root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
