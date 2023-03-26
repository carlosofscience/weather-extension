const REACT_APP_WEATHER_API_KEY = '0f52057383af4a36b7b182759232503'

export interface WeatherData{
  location:{
    name: string,
    region: string,
    country: string,
    localtime: string,
  },
  current:{
    temp_c: Number,
    temp_f: Number,
    is_day: Number,
    condition: {
      text: string,
      icon: string,
      code: Number
    },
    wind_mph: Number,
    wind_kph: Number,
    wind_degree: Number,
    wind_dir: string,
    pressure_mb: Number,
    pressure_in: Number,
    precip_mm: Number,
    precip_in: Number,
    humidity: Number,
    cloud: Number,
    feelslike_c: Number,
    feelslike_f: Number,
  }
}

export async function fetchWeatherData(city: string): Promise<WeatherData>{
  const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${REACT_APP_WEATHER_API_KEY}&q=${city}&aqi=yes`)
  
  if(!res.ok){
    throw new Error('city no found')
  }

  const data = await res.json()
  return data
}