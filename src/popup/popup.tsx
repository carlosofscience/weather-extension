import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto'
import './popup.css'
import WeatherCard from './WeatherCard'

import { Box, InputBase, Grid, IconButton, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { Cipher } from 'crypto'

const rootElem = document.createElement('div')
rootElem.id = "root"
document.body.appendChild(rootElem)
const root = ReactDOM.createRoot(rootElem);
 
function App(){

  const [zipcodes, setZipcodes] = useState<string[]>([
    '03053',
    '20171',
    '10001',
  ])

  const [zipcodeInput, setZipcodeInput] = useState<string>("")

    const handleZipcodeButtonOnClick = ()=>{

      if (zipcodeInput === ''){
        return
      }
      setZipcodes([...zipcodes, zipcodeInput])
      setZipcodeInput('')
      console.log(zipcodes);
    }
    
    const handleZipcodeDeleteButtonOnClick= (index: number)=>{
      zipcodes.splice(index, 1)
      setZipcodes([...zipcodes])
    }
    
    return (<>
   <Box mx={'8px'} my={'16px'}>
      <Grid>
        <Grid>
          <Paper>
            <Box px={'15px'} py={'5px'}>
              <InputBase placeholder='Add a zipcode or city' value={zipcodeInput} onChange={(e)=> setZipcodeInput(e.target.value)}/>
              <IconButton onClick={handleZipcodeButtonOnClick}>
                <AddIcon/>
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      { zipcodes.map( (zipcode, index )=> <WeatherCard zipcode={zipcode} key={index} onDelete={()=>{handleZipcodeDeleteButtonOnClick(index)}}></WeatherCard>) }
      <Box height={"16px"}></Box>
   </Box>
  </>)
}

root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
