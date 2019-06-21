const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("./../models/genre");

//Json Parser
router.use(bodyParser.json());

//HTTP

//GET Movie
router.get("/", async (req, resp) => {
  let movies = await Movie.find();
  resp.send(movies);
});

router.get("/:id", async (req, resp) => {
  //Make sure movie exists by id:
  let movie = await Movie.findById(req.params.id);
  //If it doesnt exist, send an error:
  if (!movie) return resp.status(404).send(`Movie not found.`);
  resp.send(movie);
});

//Post Movies
router.post("/", async (req, resp) => {
  //Validate:
  let { error } = validate(req.body);
  //if not valid return bad request 400:
  if (error) return resp.status(400).send(error.details);

  //Make Sure genre exists
  let genre = await Genre.findById(req.body.genreId);
  if (!genre) return resp.status(400).send("Genre doesnt exist");

  const movie = new Movie({
    name: req.body.name,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  //Make Sure doesnt exist by name:
  let movieExists = await Movie.findOne({ name: movie.name });
  //If exists - send an error:
  if (movieExists)
    return resp.status(400).send(`Movie by the name \"${movie.name}\" already exists`);

  //if valid, add genre:
  await movie.save();

  return resp.send(movie);
});

//Put Movies
router.put("/:id", async (req, resp) => {
  let movie = req.body;
  //Validate
  let { error } = validate(movie);
  if (error) return resp.status(400).send(error.details.message);
  //Make Sure doesnt exist by name:
  let movieExists = await Movie.findOne({ name: movie.name, _id: { $ne: req.params.id } });
  if (movieExists)
    return resp.status(400).send(`Movie \"${movie.name}\" already exists}`);

    //Check If genre exists:
    let genre = await Genre.findById(movie.genreId);
    if (!genre) return resp.status(400).send(`Genre not found`);
  //Make sure movie exists by id:
  let movieCurrent = await Movie.findByIdAndUpdate(
    req.params.id,
    { name: movie.name, genre: genre, numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate },
    { new: true }
  );
  //If it doesnt exist, send an error:
  if (!movieCurrent)
    return resp.status(404).send(`Movie id: ${req.params.id} doesn't exist`);

  return resp.send(movieCurrent);
});

//Delete Movies
router.delete("/:id", async (req, resp) => {
  let movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return resp.status(404).send(`Movie with id ${req.params.id} not found.`);

  return resp.send(movie);
});

module.exports = router;
