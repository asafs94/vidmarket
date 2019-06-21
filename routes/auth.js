const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

router.use(bodyParser.json())

router.post('/', async (req,resp)=>{

    const {error} = validate(req.body);

    if(error) return resp.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    
    if(!user) return resp.status(400).send("Invalid email or password.");
    
    const validPassword =  await bcrypt.compare(req.body.password, user.password);

    if(!validPassword) return resp.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();

    return resp.send(token);

})


function validate(req){
    const validUser = Joi.object().keys({
        email: Joi
        .string()
        .min(3)
        .email()
        .required(),
        password: Joi
        .string()
        .min(3)
        .max(15)
        .required()
      });

      return Joi.validate(req, validUser)

}



module.exports = router;