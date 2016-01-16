'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.load();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendfile('public/index.html');
});

const port = process.env.PORT || 8000;

http.createServer(app).listen(port, (err) => {
  console.log(`Listening at port ${port}`);
});