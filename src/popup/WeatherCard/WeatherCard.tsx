import React, { useEffect, useState }from 'react'
import { fetchWeatherData, WeatherData} from '../../utils/API'
import { Card, CardContent, Typography, Box, CardActions, Button} from '@mui/material'
import { LocalStorageOptions } from '../../utils/storage'

type weatherCardState = "loading" | "error" |  "ready"


const WeatherCardContainer: React.FC<{
  children: React.ReactNode
  onDelete?:()=> void
}> = ({children, onDelete})=>{
  return   <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          { onDelete && <Button color='secondary' onClick={onDelete}>Delete</Button> }
        </CardActions>
      </Card>
    </Box>
}

const WeatherCard: React.FC<{
  zipcode: string,
  options: LocalStorageOptions,
  onDelete?: ()=>void
}> = ({zipcode, options, onDelete})=>{

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherCardState, setweatherCardState] = useState<weatherCardState>("loading")

  useEffect(()=>{
    fetchWeatherData(zipcode)
    .then( data =>{
      setWeatherData(data)
      setweatherCardState("ready")
    })
    .catch(err =>{
      setweatherCardState("error")
    })
  }, [{zipcode}])

  if(weatherCardState == "loading" || weatherCardState == "error"){
    return <WeatherCardContainer onDelete={onDelete}>
      <Typography variant='body1'>
        {
          weatherCardState == "loading" ? "Loading..." : "Error: Could not retrieve weather data for this zipcode: " + zipcode
        }
      </Typography>
      
    </WeatherCardContainer>
  }


  return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography variant='h6'>
          {`${weatherData.location.name}, 
          ${weatherData.location.region}`}
        </Typography>
        <Typography variant='body1'>
          temp: {Math.round(options.tempScale === 'metric' ? weatherData.current.temp_c : weatherData.current.temp_f)}
        </Typography>
        <Typography variant='body1'>
          Feels like: {Math.round(options.tempScale === 'metric' ? weatherData.current.feelslike_c : weatherData.current.feelslike_f)}
        </Typography>
      </WeatherCardContainer>
  )
}

export default WeatherCard