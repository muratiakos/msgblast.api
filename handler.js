'use strict';

var AWS = require('aws-sdk');  
AWS.config.region = 'us-east-1';


module.exports.ping = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'It\'s alive!!',
      // input: event,
    }),
  };

  callback(null, response);
};


module.exports.send = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: event.message,
      input: event,
    }),
  };

  console.log(" --- Events received ----");
  console.log(event);
  if (!event.message) {
    console.log('Cancelled - empty message');
    return;
  }

  var sns = new AWS.SNS();

  //TODO: add params to context
  //TODO: auto create SNS topic
  //TODO: create SMS subscriber
  var TopicArn = 'arn:aws:sns:us-east-1:137173381341:sms-test';

  for (var index = 0; index < event.numbers.length; ++index) {
    var target = event.numbers[index];
    try {
      console.log(target);
      //TODO: check phone format
      var params = {
        Protocol: 'sms',
        TopicArn: TopicArn,
        Endpoint: target
      };

      console.log(" --- subscribe ----");
      console.log(params);
      sns.subscribe(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
      });
    } finally {
        console.log("Skipped");
    }
  }
  
  console.log(" --- publish message ----");
  sns.publish({
      Message: event.message,
      TopicArn: TopicArn
  }, function(err, data) {
      if (err) {
          console.log(err.stack);
          return;
      }
      console.log('push sent');
      console.log(data);
      context.done(null, 'Function Finished!');  
  });

  callback(null, response);
};