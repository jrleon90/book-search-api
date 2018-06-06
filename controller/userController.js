const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let User = require('../models/user');

//User creation
router.post('/', (req, res) => {
    //Validate there is an username and a password
    if (!req.body.username || !req.body.password) return res.status(500).json({'Error':'No username or Password'})
    //Create user object with the information given
    let user = new User({
        _id:uuid(),
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password,10)
    });
    //Create user and stored it in the DB
    User.create(user, (err, user) =>{
        if (err) return res.status(500).json({'Error': err});
        return res.status(200).json({'response':user});
    })
});

module.exports = router;