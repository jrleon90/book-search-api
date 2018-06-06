require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const elasticsearch = require('elasticsearch');
const jwt = require('jsonwebtoken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//Middleware to verify token inside request header
router.use((req, res, next) => {
    //request token from the header
    let token = req.headers['x-access-token'];

    //validate that there is a token
    if (token){
        //Verify token
        jwt.verify(token, process.env.JWT_ENCRYPTION, (err, decoded) => {
            if (err) {
                return res.status(401).json({"Message":"Invalid Token"});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({"Message":"Add a token to the header"})
    }
});

let Book = require('../models/book');

//Create instance for Elasticsearch
let es_client = new elasticsearch.Client({
    host: 'https://paas:02c1862d80bb264a93750c2c1ace49a7@thorin-us-east-1.searchly.com'
});

//Function to create a book
router.post('/', (req,res) => {
    //Create book object
    let book = new Book({
        _id: uuid(),
        name: req.body.name,
        tags: req.body.tags
    })
    //Create and save book inside MongoDB
    Book.create(book, (err, book) => {
        if (err) return res.status(500).json({'Error':err});
        //Save book inside Elasticsearch
        es_client.index({
            index:'book',
            type: 'document',
            id: uuid(),
            body: {
                name: req.body.name,
                tags: req.body.tags
            }
        },(err, response) => {
            if (err) return res.status(500).json({'Error':err});
        });
        return res.status(200).json({'response':'Book added!'});
    });    
});

//Get all book save inside Elasticsearch
router.get('/', (req,res)=> {
    es_client.search({
        index: 'book',
        type: 'document'
    }).then((resp) => {
        return res.status(200).json({'Response': resp});
    },(err) => {
        return res.status(500).json({'Error': err});
    })
});

//Query books inside Elasticsearch
router.get('/search',(req,res) => {
    let tagElements = [];
    //If there is no tag, set array null
    if(typeof(req.query.tag) == 'undefined') {tagElements = null;}
    //If there is one tag is retrieve as a string, if there is more than one is retrieve as an object
    if (typeof(req.query.tag) !== 'string'){
        for(let i in req.query.tag) {
            //Push elements to query partial tag names
            tagElements.push({regexp: {tags: '.*'+req.query.tag[i]+'.*'}})
        }
    } else {
        tagElements.push({regexp: {tags: '.*'+req.query.tag+'.*'}})
    }
    es_client.search({
        index: 'book',
        type: 'document',
        body: {
            query: {
                bool: {
                    should: [
                        tagElements,
                        {regexp: {name: '.*'+req.query.name+'.*'}}
                    ]
                }
            }
        }
    }).then((resp) => {
        return res.status(200).json({'response':resp});
    }, (err) => {
        return res.status(500).json({'error':err})
    })
});

module.exports = router;