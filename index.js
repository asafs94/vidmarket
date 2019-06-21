const app = require('express')();


const {logger} =require("./startup/logger");
const initConfig = require('./startup/config');
const {initializeDB} =require("./startup/db");
const initRoutes = require("./startup/routes");
const initValidation = require('./startup/validation');

initValidation();
initConfig();
initializeDB();
initRoutes(app);



//SERVER
const port = process.env.PORT || 3000;
//Starting server
const server =app.listen(port, (req, resp) => {
  logger.info(`Listening on port ${port}`)
});

module.exports = server;
