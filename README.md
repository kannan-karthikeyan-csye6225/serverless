# Lambda function
The index.js file is responsible for sending an email verification to the user created in webapp.

## How it works
When a user is created in the Webapp, an Amazon SNS message (JSON format) is published and this lambda function is subscribed to the SNS publisher. Code is ran when a message enters the queue in SNS.