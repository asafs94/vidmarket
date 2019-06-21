const { logger } = require("../startup/logger");

module.exports = function (error, req, resp, next){
  
  logger.error({
    message: error.message,
    metadata: {error:error}
  });


resp.status(500).send("Something failed.");
}