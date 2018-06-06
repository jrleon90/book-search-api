require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/db');
const elasticsearch = require('elasticsearch');

const app = express();

let Book = require('./models/book');

let es_client = new elasticsearch.Client({
    host: 'https://paas:02c1862d80bb264a93750c2c1ace49a7@thorin-us-east-1.searchly.com'
});

const loginController = require('./controller/loginController');
const bookController = require('./controller/bookController');
const userController = require('./controller/userController');

app.use('/book', bookController);
app.use('/login', loginController);
app.use('/user', userController);

app.use('/',(req,res)=>{
   res.json({'Message': 'Welcome to the book search API!'})
});



module.exports = app;