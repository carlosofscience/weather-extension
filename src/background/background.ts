import { setStoredCities, setStoredOptions } from "../utils/storage";

// TODO: background script
chrome.runtime.onInstalled.addListener(() => {
  //setting default values
  setStoredCities([])
  setStoredOptions({
    tempScale: 'metric',
    homeCity:''
  })
})
