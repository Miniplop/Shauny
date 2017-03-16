var express = require('express');
var router = express.Router();

var VALIDATION_TOKEN = 'EAADfnKWUqqgBAB2qpOALrtmvxWuiHDsEW8aVUSRdOZChvtG2fpT5coT3GDl0taZBGWgybuHCcu23PqOMsjIzhB8TuATHjGihxb52glDTEO1tZCvSMP2bOccSXFgCkwQdh49aZCTOBSWV8vmIPgGhncjHEkreF6jRMuJaPTUrGQZDZD';

/* GET webhook auth. */
router.get('/', function(req, res, next) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

module.exports = router;
