const jsonDB = require('node-json-db');
const db = new jsonDB("MyDatabase", true, false);

function isUserKnown(senderId) {
  try {
    db.getData('/users/' + senderId);
    return true;
  } catch(error) {
    return false;
  }
}

function addUser(senderId, userData) {
  db.push('/users/' + senderId, userData)
}

module.exports = {
  isUserKnown: isUserKnown,
  addUser: addUser
}
