let server;
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const path = "/api/returns";

describe(path, () => {
  let rental;
  let customerId;
  let movieId;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post(path)
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index"); //init server

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      name: "Predator",
      numberInStock: 10,
      genre: { _id: mongoose.Types.ObjectId(), name: "Horror" },
      dailyRentalRate: 2
    });

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "Asaf",
        phone: "0526400600"
      },
      movie: {
        _id: movieId,
        name: movie.name,
        dailyRentalRate: movie.dailyRentalRate
      }
    });

    await movie.save();
    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await server.close(); //close server
  });

  it("should return 401 in case the client is not logged in", async () => {
    token = "";

    const response = await exec();

    expect(response.status).toBe(401);
  });

  it("should return 400 in case customerID is not provided", async () => {
    customerId = "";

    const response = await exec();

    expect(response.status).toBe(400);
  });

  it("should return 400 in case movieID is not provided", async () => {
    movieId = "";

    const response = await exec();

    expect(response.status).toBe(400);
  });

  it("should return 404 if no rental found for this movie-customer combo", async () => {
    await Rental.deleteMany({});

    const response = await exec();

    expect(response.status).toBe(404);
  });

  it("should return 400 if rental already returned", async () => {
    rental.dateReturned = Date.now();
    await rental.save();

    const response = await exec();

    expect(response.status).toBe(400);
    expect(response.text).toMatch(/^.*return.*$/);
  });

  it("should return 200 if request is valid", async () => {
    const response = await exec();

    expect(response.status).toBe(200);
  });

  it("should set return date if request is valid", async () => {
    const response = await exec();

    const rentalInDB = await Rental.findOne({ _id: rental._id });

    const now = new Date();

    expect(now - rentalInDB.dateReturned).toBeLessThan(10 * 1000);
  });

  it("should calculate rentalFee if request is valid", async () => {
    await exec();

    const rentalInDB = await Rental.findOne({ _id: rental._id });

    expect(rentalInDB.rentalFee).toBeCloseTo(2);
  });
 
  it("should increase number of movies in stock if request is valid", async () => {
    await exec();

    const movieInDB = await Movie.findOne({ _id: movie._id });

    expect(movieInDB.numberInStock).toBe(movie.numberInStock+1);

  });
  
  it("should return the rental if request is valid", async () => {
    
    
    
    const response =await exec();

    expect(Object.keys(response.body)).toEqual(expect.arrayContaining(["movie","rentalFee","dateOut","dateReturned"]))

  });
});
