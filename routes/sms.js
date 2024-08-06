

// const twilioClient = require("twilio")




// module.exports = function(authMiddleware){




// function sendMorningNotification(toNumber, message) {
//   twilioClient.messages
//     .create({
//       body: message,
//       from: '+18444223429', // Your Twilio phone number
//       to: toNumber,
//     })
//     .then((message) => console.log(message.sid))
//     .catch((error) => console.error(error));
// }

// // Schedule notification for weekdays (Monday-Friday)
// const today = new Date();
// const dayOfWeek = today.getDay(); // 0 (Sunday) - 6 (Saturday)

// if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Check if it's a weekday
//   const notificationTime = '09:00:00'; // Set your desired notification time (e.g., 9:00 AM)
//   const notificationHour = parseInt(notificationTime.split(':')[0]);
//   const notificationMinute = parseInt(notificationTime.split(':')[1]);

//   today.setHours(notificationHour, notificationMinute, 0, 0); // Set notification time

//   // Check if notification time has already passed for today
//   if (today < new Date()) {
//     today.setDate(today.getDate() + 1); // Schedule for tomorrow if time has passed
//   }

//   setTimeout(() => {
//     const message = 'Your morning notification!'; // Your notification message
//     sendMorningNotification('RECIPIENT_PHONE_NUMBER', message); // Replace with recipient's phone number
//   }, today.getTime() - Date.now());
// } else {
//   console.log('Notification is only sent on weekdays.');
// }
// }