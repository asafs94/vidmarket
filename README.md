# vidmarket
A backend server for a video rental service.

##Description
A small project to demonstrate some of the actions of video rental store's backend server.

## Getting started
### Installation
```
npm install
set jwtPvtKey = your_Key
set DB_STRING = yourPath
```
* *your_Key* = the jwt private key for data encryption purposes. 
* *yourPath* = the path to your mongoDB server.

### Starting the app
```
node index.js
```

### API Paths
Path | Object | Request Types | Comments
------------ | ------------- | ----------- | -----------
"/api/genres"    | genre      | GET / ,GET /:id, PUT /:id, DELETE /:id, POST / 
"/api/customers" | customer   | GET / ,GET /:id, PUT /:id, DELETE /:id, POST /
"/api/movies"    | movie      | GET / ,GET /:id, PUT /:id, DELETE /:id, POST /
"/api/rentals"   | rental     | GET / ,POST /
"/api/users"     | user       | POST / | A sign up service
"/api/auth"      | auth       | POST / | A login service
"/api/returns"   |            |

## Built With
* [__Node.js__](https://nodejs.dev/)
  - [__Joi__](https://github.com/hapijs/joi) _v-15.0.3_ : Object schema validation.
  - [__bcrypt__](https://www.npmjs.com/package/bcrypt) _v-3.0.6_ : A library for hashing passwords.
  - [__config__](https://www.npmjs.com/package/config) _v-3.1.0_ : Organizes hierarchical configurations for app deployments.
  - [__express__](https://expressjs.com/) _v-4.16.4_ : web framework for Node.js.
  - [__fawn__](https://www.npmjs.com/package/fawn) _v-2.1.5_ : Promise based Library for transactions in MongoDB.
  - [__jsonwebtoken__](https://www.npmjs.com/package/jsonwebtoken) _v-8.5.1_ : An implementation of JSON Web Tokens.
  - [__lodash__](https://www.npmjs.com/package/lodash) _v-4.17.11_: The Lodash library exported as Node.js modules - a modern JavaScript utility library delivering modularity, performance & extras.
  - [__moment__](https://momentjs.com/) _v-2.24.0_ : Parse, validate, manipulate, and display dates and times in JavaScript.
  - [__mongoose__](https://mongoosejs.com/) v-5.5.9:  Mongodb object modeling for node.js
  - [__winston__](https://github.com/winstonjs/winston) _v-3.2.1_: A logging library.
  - __winston-mongodb__ _v-5.0.0_ : A MongoDB transport for winston. 
* [__MongoDB__](https://www.mongodb.com/)

## Acknowledgments
This Project is a project made during the course of *Mosh Hamedani*. ([Programming with Mosh](https://programmingwithmosh.com/))
