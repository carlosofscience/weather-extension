import { fetchWeatherData } from "../utils/API";
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
})

chrome.alarms.create({
  periodInMinutes: 60,
})

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



// chrome.action.setBadgeBackgroundColor({
//   color: 'lightblue'
// })