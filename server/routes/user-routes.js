const router = require('express').Router();
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-2' });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';

// Get all users and their thoughts
router.get('/users', (req, res) => {
  const params = {
    TableName: table,
  };

  dynamodb.scan(params, (err, data) => {
    if (err) res.status(500).json(err);
    else {
      res.json(data.Items);
    }
  });
});

// GET all thoughts from a single user
router.get('/users/:username', (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}`);

  const params = {
    TableName: table,
    ExpressionAttributeNames: {
      // Assigns aliases for keys with #
      '#un': 'username',
      '#ca': 'createdAt',
      '#th': 'thought',
    },
    ExpressionAttributeValues: {
      // Assigns aliases for values with :
      ':user': req.params.username,
    },
    KeyConditionExpression: '#un = :user', // Query parameters (similar to WHERE in SQL)
    ProjectionExpression: '#th, #ca', // Columns to be return (similar to SELECT in SQL)
    ScanIndexForward: false,
  };

  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error('Unable to query. Error: ', JSON.stringify(err, null, 2));
      res.status(500).json(err);
    } else {
      console.log('Query succeeded');
      res.json(data.Items);
    }
  });
});

// CREATE new thought for a user
router.post('/users', (req, res) => {
  const params = {
    TableName: table,
    Item: {
      username: req.body.username,
      createdAt: Date.now(),
      thought: req.body.thought,
    },
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error('Unable to add item. Error JSON: ', JSON.stringify(err, null, 2));
      res.status(500).json(err);
    } else {
      console.log('Added item: ', JSON.stringify(params.Item, null, 2));
      res.json({ Added: JSON.stringify(params.Item, null, 2) });
    }
  });
});

module.exports = router;
