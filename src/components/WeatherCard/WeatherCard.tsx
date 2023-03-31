import React, { useEffect, useState }from 'react'
import { fetchWeatherData, WeatherData} from '../../utils/API'
import { Card, CardContent, Typography, Box, CardActions, Button} from '@mui/material'
import'./WeatherCard.css' 

type weatherCardState = "loading" | "error" |  "ready"


const WeatherCardContainer: React.FC<{
  children: React.ReactNode
  onDelete?:()=> void
}> = ({children, onDelete})=>{
  return   <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          { onDelete && <Button color='secondary' onClick={onDelete}> <Typography className='weatherCard-body'>Delete</Typography> </Button> }
        </CardActions>
      </Card>
    </Box>
}

const WeatherCard: React.FC<{
  zipcode: string,
  tempScale: string,
  onDelete?: ()=>void
}> = ({zipcode, tempScale, onDelete})=>{

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherCardState, setweatherCardState] = useState<weatherCardState>("loading")

  useEffect(()=>{
    
    console.log('Fetching data for: ', zipcode);
    
    fetchWeatherData(zipcode)
    .then( data =>{      
      setWeatherData(data)
      setweatherCardState("ready")
    })
    .catch(err =>{
      setweatherCardState("error")
    })
  }, [zipcode])

  if(weatherCardState == "loading" || weatherCardState == "error"){
    return <WeatherCardContainer onDelete={onDelete}>

      <Typography className='weatherCard-title'>{zipcode}</Typography>
      <Typography className='weatherCard-body'>
        {
          weatherCardState == "loading" ? "Loading..." : "Error: Could not retrieve weather data for this zipcode: " + zipcode
        }
      </Typography>
      
    </WeatherCardContainer>
  }


  return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className='weatherCard-title'>
          {`${weatherData.location.name}, 
          ${weatherData.location.region}`}
        </Typography>
        <Typography className='weatherCard-body'>
          temp: {Math.round(tempScale === 'metric' ? weatherData.current.temp_c : weatherData.current.temp_f)}
        </Typography>
        <Typography className='weatherCard-body'>
          Feels like: {Math.round(tempScale === 'metric' ? weatherData.current.feelslike_c : weatherData.current.feelslike_f)}
        </Typography>
      </WeatherCardContainer>
  )
}

export default WeatherCard