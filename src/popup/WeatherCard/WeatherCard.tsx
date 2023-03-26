import React, { useEffect, useState }from 'react'
import { fetchWeatherData, WeatherData} from '../../utils/API'
import { Card, CardContent, Typography, Box } from '@mui/material'

type weatherCardState = "loading" | "error" |  "ready"


const WeatherCardContainer: React.FC<{
  children: React.ReactNode
}> = ({children})=>{
  return   <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </Box>
}

const WeatherCard: React.FC<{
  zipcode: string
}> = ({zipcode})=>{

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
    return <WeatherCardContainer>
      <Typography variant='body1'>
        {
          weatherCardState == "loading" ? "Loading..." : "Error: Could not retrieve weather data for this zipcode: " + zipcode
        }
      </Typography>
      
    </WeatherCardContainer>
  }


  return (
      <WeatherCardContainer>
        <Typography variant='h6'>
          {`${weatherData.location.name}, 
          ${weatherData.location.region}`}
        </Typography>
        <Typography variant='body1'>
          temp: {Math.round(weatherData.current.temp_f)}
        </Typography>
        <Typography variant='body1'>
          Feels like: {Math.round(weatherData.current.feelslike_f)}
        </Typography>
      </WeatherCardContainer>
  )
}

export default WeatherCard