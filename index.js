const express = require('express');
const app = express();
const db = require('./library/dbconnection');
const userModel = require('./app/model/User.model');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http').Server(app);
const cors = require('cors');

app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-genesys-token']
  };
app.use(cors(corsOption));

app.listen('3000', () => {
    console.log('listening on port 3000');
});