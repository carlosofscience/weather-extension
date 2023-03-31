import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import '@fontsource/roboto'
import './options.css'
//importing material UI components
import { Card, CardContent, Typography, TextField, Grid, Box, Button } from '@mui/material'

import { getStoredOptions, setStoredOptions, LocalStorageOptions } from '../utils/storage'

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
  const handleSaveButtonOnClick = () =>{
    setFormState('saving')
    setStoredOptions(options).then(()=>{
      setTimeout(()=>{
        setFormState('ready')
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
            <Button onClick={handleSaveButtonOnClick} variant='contained' color='primary' disabled={isFieldDisabled}>{formState === 'ready' ? 'Save' : 'Saving...'}</Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
