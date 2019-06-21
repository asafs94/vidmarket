const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const bodyParser = require("body-parser");
const validateObjectId = require("../middleware/validateObjectId");
const { Genre, validate } = require("../models/genre");
const validator = require("../middleware/validate")(validate); 

//Json Parser
router.use(bodyParser.json());

//HTTP

//GET Genres
router.get("/", async (req, resp, next) => {
  let genres = await Genre.find();
  resp.send(genres);
});

router.get("/:id", validateObjectId, async (req, resp) => {
  //Make sure genre exists by id:
  let genre = await Genre.findById(req.params.id);
  //If it doesnt exist, send an error:
  if (!genre) return resp.status(404).send(`Genre not found.`);
  resp.send(genre);
});

//Post Genres
router.post("/",[auth,validator] , async (req, resp) => {
  const genre = new Genre(req.body);
  //Make Sure doesnt exist by name:
  let genreExists = await Genre.findOne({ name: genre.name });
  //If exists - send an error:
  if (genreExists)
    return resp.status(400).send(`Genre \"${genre.name}\" already exists`);
  //if valid, add genre:
  await genre.save();

  return resp.send(genre);
});

//Put Genres
router.put("/:id", [auth,validator,validateObjectId], async (req, resp) => {
  let genre = req.body;
  //Make Sure doesnt exist by name:
  let genreExists = await Genre.findOne({
    name: genre.name,
    _id: { $ne: req.params.id }
  });
  if (genreExists)
    return resp.status(400).send(`Genre \"${genre.name}\" already exists}`);
  //Make sure genre exists by id:
  let genreCurrent = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: genre.name },
    { new: true }
  );
  //If it doesnt exist, send an error:
  if (!genreCurrent)
    return resp.status(404).send(`Genre id: ${req.params.id} doesn't exist`);

  return resp.send(genreCurrent);
});

//Delete Genres
router.delete("/:id", [validateObjectId,auth, admin], validateObjectId, async (req, resp) => {
  let genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return resp.status(404).send(`Genre with id ${req.params.id} not found.`);

  return resp.send(genre);
});

module.exports = router;
