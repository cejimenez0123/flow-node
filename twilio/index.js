require('dotenv')
// const accountSid="AC6aeee1707a1ae7468f1f1e1d15ca0e2d"
// const authToken="0f6fa3a81983b3369362d380c6c2c559"
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+18444223429',
        to: '+18777804236'
   })
  .then(message => console.log(message));

  module.exports = client