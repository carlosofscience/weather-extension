import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto'
import './options.css'
//importing material UI components
import { Card, CardContent, Typography, TextField, Grid, Box, Button, Switch} from '@mui/material'

import { getStoredOptions, setStoredOptions, LocalStorageOptions } from '../utils/storage'

const rootElem = document.createElement('div')
rootElem.id = "root"
document.body.appendChild(rootElem)
const root = ReactDOM.createRoot(rootElem);


type FormState = 'ready' | 'saving'

const App: React.FC<{}> = () => {

  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [formState, setFormState] = useState<FormState>('ready')

  useEffect(() => {
    getStoredOptions().then(options => setOptions(options))
  }, [])
  
  const handleHomeCityOnChange = (homeCity) =>{
    setOptions({...options, homeCity})
  }

  const handleAutoOverlayOnChange= (hasAutoOverlay: boolean) =>{
    setOptions({...options, hasAutoOverlay})
  }
  
  const handleSaveButtonOnClick = () =>{
    setFormState('saving')
    setStoredOptions(options).then(()=>{
      setTimeout(()=>{
        setFormState('ready')
        console.log('options updated to: ', options);
        
      }, 1000)
    })
  }

  const isFieldDisabled = formState === 'saving'


  if(!options){
    return null
  }

  return (
    <Box mx={'10%'} my={'2%'}>
      <Card>
      <CardContent>
        <Grid container flexDirection={'column'} spacing={4}>
          <Grid item>
            <Typography variant='h4'>Weather Extension Options</Typography>
          </Grid>
          <Grid item>
            <Typography variant='body1'>Home City name</Typography>
            <TextField fullWidth placeholder='Enter a home city name' value={options.homeCity} onChange={e => handleHomeCityOnChange(e.target.value)} disabled={isFieldDisabled}></TextField>
          </Grid>
          <Grid item>
            <Typography variant='body1'>Auto toggle overlay on webpage load</Typography>
            <Switch color='primary' checked={options.hasAutoOverlay} onChange={ (e, checked)=> handleAutoOverlayOnChange(checked) } disabled={isFieldDisabled}/>
          </Grid>
          <Grid item>
            <Button onClick={handleSaveButtonOnClick} variant='contained' color='primary' disabled={isFieldDisabled}>{formState === 'ready' ? 'Save' : 'Saving...'}</Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    </Box>
  )
}


root.render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
