require('dotenv').config();
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({
  region: 'us-west-2'
});

const packagesQueueURL = process.env.PACKAGES_QUEUE_URL;

async function getPackage() {
  try {
    const params = {
      QueueUrl: packagesQueueURL,
      AttributeNames: ['All'],
      MaxNumberOfMessages: 1,
    }

    const receiveResponse = await sqs.receiveMessage(params).promise();
    // Not receiving messages does not necessarily result in an error
    if (receiveResponse.Messages) {
      // The array should only ever be length = 1, 
      // but use the loop for consistency
      for (let message of receiveResponse.Messages) {
        const deleteParams = {
          QueueUrl: packagesQueueURL,
          ReceiptHandle: message.ReceiptHandle,
        }
        // Delete the message from the packages queue
        await sqs.deleteMessage(deleteParams).promise();
        // Parse the message body and log it to the driver's console
        const messageBody = JSON.parse(message.Body);
        const parsedMessage = JSON.parse(messageBody.Message)
        console.log(messageBody.Subject)
        console.log(parsedMessage);
        postDeliveryToVendorQueue(parsedMessage.vendorQueueUrl, parsedMessage.orderId)
      }
    } else {
      console.log(receiveResponse)
      console.log('No messages available.')
    }
  } catch (err) {
    console.error(err, err.stack)
  }
}

async function postDeliveryToVendorQueue(vendorQueueUrl, orderId) {
  try {
    const params = {
      QueueUrl: vendorQueueUrl,
      MessageBody: `Order ${orderId} has been successfully delivered`,
    }
    
    const postResponse = await sqs.sendMessage(params).promise();
    console.log(postResponse);
  } catch (err) {
    console.error(err, err.stack);
    
  }
}

getPackage();