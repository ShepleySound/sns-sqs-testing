require('dotenv').config();
const AWS = require('aws-sdk');
const sqs = new AWS.SQS({
  region: 'us-west-2'
});
const sns = new AWS.SNS({
  region: 'us-west-2'
});

const pickupArn = process.env.PICKUP_ARN;
const vendorName = process.env.VENDOR_NAME;
const vendorQueueUrl = process.env.VENDOR_QUEUE_URL;

async function publishPickup(orderId, customerName) {
  try {
    const newMessage = {
      vendorName: vendorName,
      orderId: orderId,
      customerName: customerName,
      vendorQueueUrl: vendorQueueUrl
    }
    const params = {
      Subject: `New order - ${vendorName}`,
      Message: JSON.stringify(newMessage),
      MessageGroupId: 'VendorPickupNotification',
      TopicArn: pickupArn,
    }
    const publishResponse = await sns.publish(params).promise();
    console.log(publishResponse)
  } catch (err) {
    console.error(err, err.stack)
  }
}

async function subscribeToMessages() {
  const messagesList = [];
  /**
   * Recursively gets messages from SQS and returns each one
   */
  const getMessage = async () => {
    try {
      const params = {
        QueueUrl: vendorQueueUrl,
        AttributeNames: ['All'],
        MaxNumberOfMessages: 1
      }
  
      const receiveResponse = await sqs.receiveMessage(params).promise();
  
      if (!receiveResponse.Messages || receiveResponse.Messages.length === 0) {
        return null;
      } else {
        let message = receiveResponse.Messages[0] 
        const deleteParams = {
          QueueUrl: vendorQueueUrl,
          ReceiptHandle: message.ReceiptHandle,
        }
        await sqs.deleteMessage(deleteParams).promise();
        // Parse the message body and log it to the vendor's console
        messagesList.push(message)
        await getMessage();
      }
    } catch (err) {
      console.error(err, err.stack)
    }
  }
  await getMessage();
  if (messagesList.length > 0) {
    return messagesList;
  } else {
    return null;
  }
}

module.exports = { publishPickup, subscribeToMessages }

