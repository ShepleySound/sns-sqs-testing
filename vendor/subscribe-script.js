const { subscribeToMessages } = require('./vendor.js');


async function retrieve() {
  const messages = await subscribeToMessages();
  if (messages) {
    messages.forEach(message => {
      console.log(message.Body)
    }) 
  }
}

console.log('Welcome! Retrieving messages from queue.')
retrieve() 

setInterval(() => {
  retrieve();
}, 5000)