const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 10,
        required: true,
    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        regex: /^[A-Za-z0-9.-_]{3,}[@][A-Za-z0-9.-_]{3,}[.][A-Za-z0-9.-_]{1,}$/
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin},config.get("jwtPrivateKey"));
    return token;
}

const User = mongoose.model('user', userSchema);


function validateUser(user){
    const validUser = Joi.object().keys({
        name: Joi
        .string()
          .alphanum()
          .min(3)
          .max(10)
          .required()
          .regex(/^([A-Za-z0-9]*)$/),
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

      return Joi.validate(user, validUser)

}


module.exports.User = User;
module.exports.validate = validateUser;