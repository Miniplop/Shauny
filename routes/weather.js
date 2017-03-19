var express = require('express');
var router = express.Router();

const
  weatherService = require('../server/weatherService'),
  parser = require('json-parser');

/* GET weather page. */
router.get('/', function(req, res, next) {
  weatherService.getGeolocalisation('Grenoble')
    .then(function (body) {
      var location = parser.parse(body).results[0].geometry.location;
      weatherService.getWeatherForecast(location.lat, location.lng)
        .then(function (body) {
          res.send(body);
        });
    })
    .catch(function (err) {
    })
  ;
});

module.exports = router;
