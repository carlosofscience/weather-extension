import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto'
import './popup.css'
import WeatherCard from './WeatherCard'

import { Box, InputBase, Grid, IconButton, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

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

   return (<>
   <Box mx={'8px'} my={'16px'}>
      <Grid>
        <Grid>
          <Paper>
            <Box px={'15px'} py={'5px'}>
              <InputBase placeholder='Add a zipcode or city'/>
              <IconButton>
                <AddIcon/>
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      { zipcodes.map( (zipcode, index )=> <WeatherCard zipcode={zipcode} key={index}></WeatherCard>) }
   </Box>
  </>)
}

root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
