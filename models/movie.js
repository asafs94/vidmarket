const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const {genreSchema} = require("./genre")

const movieSchema = mongoose.Schema({
    name: { 
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30
     },
     genre: {
         type: genreSchema,
         required: true,
     },
     numberInStock: {
         type: Number,
         min: 0,
         max: 255,
         required: true
        },
    dailyRentalRate:{
            type: Number,
            min: 0,
            max: 255,
            required: true
     }
  });
  

  function validateMovie(movie) {
    const validMovie = Joi.object().keys({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(12)
            .required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
  
    return Joi.validate(movie, validMovie);
  }

  const Movie = mongoose.model('Movie',movieSchema);

  exports.Movie = Movie;
  exports.validate = validateMovie;