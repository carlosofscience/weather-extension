export let REACT_APP_WEATHER_API_KEY:string  = '0f52057383af4a36b7b182759232503'

export interface WeatherData{
  location:{
    name: string,
    region: string,
    country: string,
    localtime: string,
  },
  current:{
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: {
      text: string,
      icon: string,
      code: number
    },
    wind_mph: number,
    wind_kph: number,
    wind_degree: number,
    wind_dir: string,
    pressure_mb: number,
    pressure_in: number,
    precip_mm: number,
    precip_in: number,
    humidity: number,
    cloud: number,
    feelslike_c: number,
    feelslike_f: number,
  }
}

export type WeatherTempScale = "metric" | 'imperial'


export async function fetchWeatherData(city: string): Promise<WeatherData>{
  const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${REACT_APP_WEATHER_API_KEY}&q=${city}&aqi=yes`)
  
  if(!res.ok){
    throw new Error('city no found')
  }

  const data = await res.json()
  return data
}