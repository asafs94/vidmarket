const mongoose = require("mongoose");
const { logger } = require("./logger");
const config = require('config')

//DATABASE
const dbURI = config.get('db');

function initializeDB() {
  mongoose.connect(dbURI, { useNewUrlParser: true }, () => {
    logger.info({
      message: `Connected succesfully to ${dbURI}`,
      metadata: { dbURI: dbURI }
    });
  });
  
}

module.exports.initializeDB = initializeDB;
module.exports.DB_URI = dbURI;
