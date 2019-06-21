const mongoose = require("mongoose");
const Joi = require("@hapi/joi");


const customerSchema = mongoose.Schema({
    name: { 
      type: String,
      required: true,
      validate: {
        validator: function(n){
          return (/^([A-Za-z])*$/.test(n))
        },
        message: "A Customer name can only contain characters from A-Z or a-z."
      },
      minlength: 3,
      maxlength: 15
     },
     phone:{
         type: String,
         required: true,
         validate:{
             validator: function(n){
                 return (/^([+]{0,1}[0-9]{1,4}[\s]{0,1}[0-9]{4,})$/.test(n))
             },
             message: "Not a Valid phone number."
         }
     },
     isGold: {
         type: Boolean,
         required: true
     }
  });


  function validateCustomer(customer) {
    const validCustomer = Joi.object().keys({
      name: Joi.string()
        .alphanum()
        .min(3)
        .max(12)
        .required()
        .regex(/^([A-Za-z]*)$/),
        
      phone: Joi.string().regex(/^([+]{0,1}[0-9]{1,4}[\s]{0,1}[0-9]{4,})$/).required(),
  
      isGold: Joi.boolean().required()
    });
  
    return Joi.validate(customer, validCustomer);
  }

  const Customer = mongoose.model('Customer',customerSchema);

  module.exports.Customer=Customer;
  module.exports.validate= validateCustomer;