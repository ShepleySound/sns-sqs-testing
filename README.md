# SQS/SNS Delivery

This repository contains two modules that work together to connect AWS SQS and SNS services to achieve an interactive vendor/driver focused delivery system.

## Documentation

Currently, the `vendor` and `driver` directories function as separate Node applications. After cloning the repository, you must run the command `npm install` in each of the directories. Additionally, they will each need a `.env` file with the following contents -

### driver/.env

  ```env
  PACKAGES_QUEUE_URL=< FIFO SQS URL >
  ```

### vendor/.env

```env
VENDOR_NAME=< Vendor Name >
PICKUP_ARN=< SNS ARN for pickup queue>
VENDOR_QUEUE_URL=< SQS URL for vendor delivery queue >
```

Once your `.env` files are set up, the code should function as long as the provided URL's are pointing to properly connected AWS SNS/SQS services. 

### Commands

- Subscribe a vendor to delivery messages - `node subscribe-script.js`  
- Publish a 'ready for pickup' message - `node publish-script.js`
- Have a driver grab a message from the pickup queue - `node driver.js`
