import { getStoredCities, setStoredCities, setStoredOptions } from "../utils/storage";

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
//outside of onIntalled since context menu listeners should be install after service woker wakes up 
chrome.contextMenus.onClicked.addListener( e =>{
  getStoredCities().then( cities =>{
    setStoredCities([...cities, e.selectionText])
  })
})