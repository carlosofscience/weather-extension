import { fetchWeatherData, REACT_APP_WEATHER_API_KEY } from "../utils/API";
import { Messages } from "../utils/messages";
import { getStoredCities, getStoredOptions, setStoredCities, setStoredOptions } from "../utils/storage";


// TODO: background script
chrome.runtime.onInstalled.addListener(() => {
  //setting default values
  setStoredCities([])
  setStoredOptions({
    tempScale: 'metric',
    homeCity:'',
    hasAutoOverlay: false
  })

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: "Add city to weather extension",
    id: 'weatherExtension'
  })

  chrome.alarms.create({
    periodInMinutes: 60,
  })
})


chrome.runtime.onMessage.addListener(function({message, city}, sender, sendResponse) {
  if (message === Messages.FETCH_WEATHER_DATA_FROM_BG) {
    console.log("Received request for data from content script");
    // make an API call and return the data to the content script
    fetch(`https://api.weatherapi.com/v1/current.json?key=${REACT_APP_WEATHER_API_KEY}&q=${city}&aqi=yes`)
      .then(response => response.json())
      .then(data => {
        sendResponse(data);
      })
      .catch(error => {
        console.error("bgscript Error making API call:", error);
        sendResponse({error: error.message })
      });
    return true; // indicate that sendResponse will be called asynchronously
  }
});

//outside of onIntalled since context menu listeners should be install after service woker wakes up 
chrome.contextMenus.onClicked.addListener( e =>{
  getStoredCities().then( cities =>{
    setStoredCities([...cities, e.selectionText])
  })
})

chrome.alarms.onAlarm.addListener(()=>{

  getStoredOptions().then(options =>{
    if(options.homeCity === "") return;
      
    fetchWeatherData(options.homeCity).then(data =>{
      chrome.action.setBadgeText({
        text: options.tempScale === 'metric'? Math.round(data.current.temp_c) + '\u2103' : Math.round(data.current.temp_f) + '\u2109'
      })
    })
  })
})