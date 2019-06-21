const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        validate: {
          validator: function(n) {
            return /^([A-Za-z])*$/.test(n);
          },
          message:
            "A Customer name can only contain characters from A-Z or a-z."
        },
        minlength: 3,
        maxlength: 15
      },
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function(n) {
            return /^([+]{0,1}[0-9]{1,4}[\s]{0,1}[0-9]{4,})$/.test(n);
          },
          message: "Not a Valid phone number."
        }
      },
      isGold: {
        type: Boolean,
        required: true,
        default: false
      }
    }),
    required: true
  },

  movie: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now()
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId
  });
};

rentalSchema.methods.return = async function() {
  const { dateOut, dateReturned } = this;
  this.dateReturned = new Date();
  let days = moment(dateReturned).diff(dateOut, "days");
  days = days===0? 1: days;
  this.rentalFee = days * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

const validateRental = rental => {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
};

exports.validate = validateRental;
exports.Rental = Rental;
