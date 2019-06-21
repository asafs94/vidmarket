const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bodyParser = require("body-parser");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("@hapi/joi");
const validate = require("./../middleware/validate")(validateReturn);
//Json Parser
router.use(bodyParser.json());

//HTTP

//GET Genres
router.post("/", [auth, validate], async (req, resp, next) => {
  const { movieId, customerId } = req.body;
  const rental = await Rental.lookup(customerId, movieId);

  if (!rental) return resp.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return resp.status(400).send("Rental already returned.");

  rental.return();
  await rental.save();
  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });
  
  return resp.send(rental);
});



function validateReturn(request) {
  const validReq = Joi.object().keys({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });

  return Joi.validate(request, validReq);
}

module.exports = router;
