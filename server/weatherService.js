const
  config = require('config'),
  request = require('request-promise');

// Get the config const
const GOOGLE_API_TOKEN = (process.env.GOOGLE_API_TOKEN) ?
  (process.env.GOOGLE_API_TOKEN) :
  config.get('googleApiToken');

const WEATHER_API_TOKEN = (process.env.WEATHER_API_TOKEN) ?
  (process.env.WEATHER_API_TOKEN) :
  config.get('weatherApiToken');

const WEATHER_API_KEY = (process.env.WEATHER_API_KEY) ?
  (process.env.WEATHER_API_KEY) :
  config.get('weatherApiKey');

function getGeolocalisation(cityName) {
  return request({
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      key: GOOGLE_API_TOKEN,
      address: cityName
    },
    method: 'GET'
  });
}

function getWeatherForecast(lat, lng) {
  return request({
    uri: 'http://www.infoclimat.fr/public-api/gfs/json',
    qs: {
      _auth: WEATHER_API_TOKEN,
      _c: WEATHER_API_KEY,
      _ll: lat + ',' + lng
    },
    method: 'GET'
  });
}

module.exports =  {
  getGeolocalisation: getGeolocalisation,
  getWeatherForecast: getWeatherForecast
}