'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('express-jwt');
const dotenv = require('dotenv');

const auth0Adapter = require('./auth0Adapter');

dotenv.load();

const app = express();

const authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getRuleCategories', authenticate, (req, res) => {
  return auth0Adapter.getCategorizedRules()
    .then((categorizedRules) => {
      res.json(categorizedRules);
    })
    .catch((err) => {
      res.status(500).send({ error: 'Failed to get data from Auth0' });
    });
});

app.get('/', (req, res) => {
  res.sendfile('public/index.html');
});

const port = process.env.PORT || 8000;

http.createServer(app).listen(port, (err) => {
  console.log(`Listening at port ${port}`);
});
