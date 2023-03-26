const REACT_APP_WEATHER_API_KEY = '0f52057383af4a36b7b182759232503'

export async function fetchOpenWeatherData(city: string): Promise<any>{
  const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${REACT_APP_WEATHER_API_KEY}&q=${city}&aqi=yes`)
  
  if(!res.ok){
    throw new Error('city no found')
  }

  const data = await res.json()
  return data
}