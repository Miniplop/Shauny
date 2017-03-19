var express = require('express');
var router = express.Router();

const
  chatService = require('../server/chatService'),
  weatherService = require('../server/weatherService'),
  userService = require('../server/userService'),
  parser = require('json-parser');

/* GET webhook auth. */
router.get('/', function(req, res, next) {
  chatService.authenticate(req, res);
});

/* POST route for receiving message */
router.post('/', function (req, res) {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var timeOfEvent = entry.time;
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          var senderId = event.sender.id;
          if (!userService.isUserKnown(senderId)) {
            userService.addUser(senderId, {
              id: senderId,
              createdAt: timeOfEvent,
              status: 'station'
            });
            chatService.sendTextMessage(senderId, 'Hello, my name is Shauny️️ nice to meet you ! \nI\'m here to help you to find the best spot ❄️️❄️️❄️️️ \nTo do so, send me a station name');
          } else {
            var user = userService.getUser(senderId);
            var message = event.message;
            switch(user.status) {
              case 'station':
                weatherService.getGeolocalisation(message.text)
                  .then(function (body) {
                    var response = parser.parse(body).results;
                    if (response.length <= 0) {
                      chatService.sendTextMessage(senderId, 'I don\'t find any city with this name 😢, can you verify the typo or try something else 🙂');
                    } else {
                      var location = response[0].geometry.location;
                      chatService.sendTextMessage(senderId, 'You ask for ' + message.text + '\n Lattitude : ' + location.lat + '\n Longitude : ' + location.lng);
                      weatherService.getWeatherForecast(location.lat, location.lng)
                        .then(function (body) {
                            chatService.sendCarouselReply(senderId, [
                              {
                                "title":"Welcome to Peter\'s Hats",
                                "image_url":"https://petersfancybrownhats.com/company_image.png",
                                "subtitle":"We\'ve got the right hat for everyone.",
                                "default_action": {
                                  "type": "web_url",
                                  "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
                                  "messenger_extensions": true,
                                  "webview_height_ratio": "tall",
                                  "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                },
                                "buttons":[
                                  {
                                    "type":"web_url",
                                    "url":"https://petersfancybrownhats.com",
                                    "title":"View Website"
                                  },{
                                    "type":"postback",
                                    "title":"Start Chatting",
                                    "payload":"DEVELOPER_DEFINED_PAYLOAD"
                                  }
                                ]
                              }
                            ]);
                          userService.changeUserStatus(senderId, 'weather');
                        })
                        .catch(function (err) {
                          chatService.sendTextMessage(senderId, 'I have weather data for french city 🇫🇷, can you try something else 🙂');
                        })
                    }
                  })
                  .catch(function (err) {
                    console.log(err);
                    chatService.sendTextMessage(senderId, 'Internal error 🤒');
                  })
                break;
              default:
                chatService.sendTextMessage(senderId, 'Your status : ' + user.status);
            }
          }
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

module.exports = router;
