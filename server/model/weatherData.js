const parser = require('json-parser');

function WeatherData(openWeatherMapRawData) {
  openWeatherMapData = parser.parse(openWeatherMapRawData)
  this.city = openWeatherMapData.city;
  this.forecast = readForecastdata(openWeatherMapData);

  function readForecastdata(openWeatherMapData) {
    var result = [];
    openWeatherMapData.list.forEach(function (element) {
      result.push(
        {
          date: new Date(element.dt * 1000),
          temp: {
            day: convertKelvinToCelsius(element.temp.day),
            min: convertKelvinToCelsius(element.temp.min),
            max: convertKelvinToCelsius(element.temp.max)
          },
          weather : {
            main: element.weather[0].main,
            description: element.weather[0].description
          }
        }
      );
    })

    return result;
  }

  function convertKelvinToCelsius(temp) {
    return Math.round(temp - 273.15);
  }
};

// Export the model
module.exports = WeatherData;