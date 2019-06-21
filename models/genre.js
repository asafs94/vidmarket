const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const genreSchema = mongoose.Schema({
    name: { 
      type: String,
      required: true,
      validate: {
        validator: function(n){
          return (/^([A-Za-z])*$/.test(n))
        },
        message: "A Genre Name can only contain characters from A-Z or a-z."
      },
      minlength: 3,
      maxlength: 15
     }
  });
  

  function validateGenre(genre) {
    const validGenre = Joi.object().keys({
      name: Joi.string()
        .alphanum()
        .regex(/^([A-Za-z])*$/)
        .min(3)
        .max(12)
        .required()
    });
  
    return Joi.validate(genre, validGenre);
  }

  const Genre = mongoose.model('Genre',genreSchema);

  exports.Genre = Genre;
  exports.validate = validateGenre;
  exports.genreSchema= genreSchema;