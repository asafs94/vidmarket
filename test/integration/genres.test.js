let server;
const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const path = "/api/genres";

describe(path, () => {
  beforeEach(() => {
    server = require("../../index"); //init server
  });

  afterEach(async () => {
    await Genre.deleteMany({}); //erase all data of genres in db after each test
    await server.close(); //close server
  });

  describe("[GET] /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" }
      ]);

      const response = await request(server).get(path);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.some(g => g.name === "genre1")).toBeTruthy();
      expect(response.body.some(g => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("[GET] /:id", () => {
    it("should return a genre with :id", async () => {
      const genre = new Genre({
        name: "testGenre"
      });

      await genre.save();

      const response = await request(server).get(path + `/${genre._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "testGenre");
    });

    it("should return a status 404 for invalid id", async () => {
      const response = await request(server).get(path + `/1`);

      expect(response.status).toBe(404);
    });

    it("should return a status 404 for genre not found", async () => {
      const _id = new mongoose.Types.ObjectId().toHexString();

      const response = await request(server).get(path + `/${_id}`);

      expect(response.status).toBe(404);
    });
  });

  describe("[POST] /", () => {
    let token; //Auth token
    let name; //genre-name

    //Init params
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "Action";
    });

    const exec = async () => {
      return await request(server)
        .post(path)
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should save the genre if valid", async () => {
      await exec();

      //make sure genre is saved:
      const genreInDB = await Genre.find({ name });

      expect(genreInDB).not.toBeNull();
    });

    it("should return the genre if valid", async () => {
      const response = await exec();

      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("name", name);
    });

    it("should return a status of 401 if user is not logged in", async () => {
      token = "";

      const response = await exec();

      expect(response.status).toBe(401);
    });

    //Genre name checks:
    it.each`
      param                      | case                             | status
      ${"a"}                     | ${"has less than 3 characters"}  | ${400}
      ${new Array(14).join("a")} | ${"has more than 12 characters"} | ${400}
      ${"111$"}                  | ${"contains illegal chaacters"}  | ${400}
    `(
      "should return a status $status if genre name $case",
      async ({ param, status }) => {
        name = param;

        const response = await exec();
        expect(response.status).toBe(status);
      }
    );

    it("should return 400 if the genre with the given name exists in the db", async () => {
      const genre = new Genre({ name });
      await genre.save();

      const response = await exec();

      expect(response.status).toBe(400);
    });
  });

  describe("[PUT] /:id", () => {
    let genre;
    let token;
    let newName;
    let id;

    beforeEach(async () => {
      newName = "newName";
      genre = new Genre({ name: "oldName" });
      await genre.save();
      id = genre._id;
      token = new User().generateAuthToken();
    });

    const exec = () => {
      return request(server)
        .put(`${path}/${id}`)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    //Success paths:

    it("should return the updated genre if update is valid", async () => {
      const response = await exec();

      expect(response.body).toHaveProperty("name", "newName");
    });

    it("should update a genre inside the db if update is valid", async () => {
      await exec();

      let genreInDB = await Genre.find({ _id: genre._id });

      expect(genreInDB[0]).toHaveProperty("_id", genre._id);
      expect(genreInDB[0]).toHaveProperty("name", newName);
    });

    //Error Paths:

    it("should return a status of 401 if user is not logged in", async () => {
      token = "";

      const response = await exec();

      expect(response.status).toBe(401);
    });

    it("should return a status 404 for invalid id", async () => {
      id = "1";
      const response = await exec();
      expect(response.status).toBe(404);
    });

    it("should return status 400 if genre passed is not a valid genre", async () => {
      newName = "a534";

      const response = await exec();

      expect(response.status).toBe(400);
    });

    it("should return status 400 if genre name passed already exists", async () => {
      const newGenre = new Genre({ name: newName });
      await newGenre.save();

      const response = await exec();

      expect(response.status).toBe(400);
    });

    it("should return status 404 if genre with given id doesnt exist in the db", async () => {
      await Genre.deleteOne({ _id: genre._id });

      const response = await exec();

      expect(response.status).toBe(404);
    });
  });

  describe("[DELETE] /:id", () => {
    let genre;
    let token;
    let id;

    beforeEach(async () => {
      genre = new Genre({ name: "test" });
      await genre.save();
      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    const exec = () => {
      return request(server)
        .delete(`${path}/${id}`)
        .set("x-auth-token", token);
    };

    //Success:

    it("should return deleted genre when successful", async () => {
      const response = await exec();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", genre._id.toHexString());
      expect(response.body).toHaveProperty("name", genre.name);
    });

    it("should delete genre when successful", async () => {
      await exec();

      let deletedGenre = await Genre.find({ _id: genre._id });

      expect(deletedGenre).toEqual([]);
    });

    //Errors:
    it("should return a status of 401 when user is not logged in", async () => {
      token = "";

      const response = await exec();

      expect(response.status).toBe(401);
    });

    it("should return a status of 403 when user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const response = await exec();

      expect(response.status).toBe(403);
    });

    it("should return a status of 404 if genre is not found", async () => {
      await Genre.deleteMany({});

      const response = await exec();

      expect(response.status).toBe(404);
    });
    it("should return a status of 404 if genre id is invalid", async () => {
      await Genre.deleteMany({});

      const response = await exec();

      expect(response.status).toBe(404);
    });
  });
});
