const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const {User, validate} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.use(bodyParser.json())

router.post('/', async (req,resp)=>{

    const {error} = validate(req.body);

    if(error) return resp.status(400).send(error.details[0].message);

    const userExistsByEmail = await User.findOne({email: req.body.email});
    
    if(userExistsByEmail) return resp.status(400).send("A user with this email address already exists.");
    
    const user = new User(_.pick(req.body, ['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();

    const token = user.generateAuthToken();

    return resp.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));

})


module.exports = router;