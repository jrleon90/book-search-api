require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const elasticsearch = require('elasticsearch');
const jwt = require('jsonwebtoken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use((req, res, next) => {
    let token = req.headers['x-access-token'];

    if (token){
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

let es_client = new elasticsearch.Client({
    host: 'https://paas:02c1862d80bb264a93750c2c1ace49a7@thorin-us-east-1.searchly.com'
});

router.post('/', (req,res) => {
    let book = new Book({
        _id: uuid(),
        name: req.body.name,
        tags: req.body.tags
    })
    Book.create(book, (err, book) => {
        if (err) return res.status(500).json({'Error':err});
        return tus(200).json({'response':'Book added!'});
    });
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
    
});

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

router.get('/search',(req,res) => {
    let tagElements = [];
    if(typeof(req.query.tag) == 'undefined') {tagElements = null;}
    if (typeof(req.query.tag) !== 'string'){
        for(let i in req.query.tag) {
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