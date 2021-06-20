const express = require('express');
const router = express.Router(); 
const User = require("../Schemas/User.model.js") ; 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');

const { registerValidation, loginValidation } = require('../validation.js'); 


router.post('/auth/signup', async (req, res) => {
    // //Let's validate the data before we add a admin
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if admin is already in the database
    const mailExist = await User.findOne({mail: req.body.mail});
    if(mailExist) return res.status(400).send('mail already exists');

    //Hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.pwd, salt);


    //create a new admin
    const admin = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mail: req.body.mail,
        pwd: hashedPassword
    });
    try{
        const savedAdmin = await admin.save();
        res.send({admin: admin._id});
    }catch(err){
        res.status(400).send(err);
    }
});

//Login
router.post('/auth/login', async (req, res) => {
    // //Let's validate the data before we add a admin
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if mail exists
    const admin = await User.findOne({ mail: req.body.mail });
    if(!admin) return res.status(400).send('mail is not found');
    //password is correct
    const validPass = await bcrypt.compare(req.body.pwd, admin.pwd);
    if(!validPass) return res.status(400).send('Invalid password')

    //Create & assign a token
    const token = jwt.sign({_id: admin._id}, process.env.TOKEN_SECRET);
    res.header('auth-token, token').send(token);
});


module.exports = router;