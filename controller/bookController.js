const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const elasticsearch = require('elasticsearch');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

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
        if (err) return res.status(500).send("Error adding information to DB");
        res.status(200).send(book);
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
        console.log('Elasticsearch: ' + JSON.stringify(response));
    });
    
});

router.get('/search',(req,res) => {
    let tagElements = [];
    if(typeof(req.query.tag) == 'undefined') {tagElements = null;}
    if (typeof(req.query.tag) !== 'string'){
        for(let i in req.query.tag) {
            console.log('object: '+req.query.tag[i]);
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
        res.status(200).send(resp);
    }, (err) => {
        res.status(500).send(err)
    })
});

module.exports = router;