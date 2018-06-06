require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let User = require('../models/user');

//Login route, validate information and token creation
router.get('/', (req,res) => {

    //Separate data and extract username and password from the request header
    let header=req.headers['authorization']||'', 
    token=header.split(/\s+/).pop()||'',        
    auth=new Buffer.from(token, 'base64').toString(),
    parts=auth.split(/:/),                          
   
    //Query the DB to find the user with the credentials given
    user = User.findOne({username: parts[0]},(err, docs) => {
        //Error message
        if (err) return res.status(401).json({"Message":"Error during authentication"});
        //Validate if there is a user
        if (docs !== null) { 
            //Validate password given with password stored
            if (bcrypt.compareSync(parts[1],docs.password)){
                let token = jwt.sign({_id:docs._id, exp: Math.floor(Date.now() / 1000) + (60 * 60),},process.env.JWT_ENCRYPTION);
                return res.status(200).json({"token": token});
            }else {
               return res.status(401).json({"Message":"Invalid password"});
            }
        } else {
           return res.status(401).json({"Message":"User not found"});
        }
    });
    
});




module.exports = router;