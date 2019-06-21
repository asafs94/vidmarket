const express = require('express');
const router= express.Router();
const bodyParser = require('body-parser');
const {Rental, validate} = require('./../models/rental');
const {Movie} = require('../models/movie');
const {Customer} =require('../models/customer');
const mongoose = require('mongoose')
const Fawn = require('fawn');


Fawn.init(mongoose);

router.use(bodyParser.json());

router.get('/', async (req,resp) =>{

    let rentals = await Rental.find().sort("-dateOut");

    return resp.send(rentals);
})

router.post('/', async (req,resp)=>{

    const {error} = validate(req.body);

    if(error) return resp.status(400).send(error.details[0].message);

    const {movieId, customerId} = req.body;

    let movie = await Movie.findById(movieId);

    if(!movie) return resp.status(404).send('Couldnt find movie.');

    let customer= await Customer.findById(customerId);

    if(!customer) return resp.status(404).send('Invalid customer account.');

    //Make sure enough movies exist in stock:
    if(movie.numberInStock <= 0) resp.status(400).send('No movies in stock.');

    
    let rental = new Rental({
        movie : {
            _id: movieId,
            name: movie.name,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer : {
            _id: customerId,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
    })

    try{
    new Fawn.Task()
    .save('rentals',rental)
    .update('movies',{_id: movie._id},{$inc: {numberInStock: -1}})
    .run();
    return resp.send(rental);
}
    catch(err){
        resp.status(500).send('Something failed. Please try again later.')
    }


})


module.exports = router;