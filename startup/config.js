const config = require("config");

module.exports = function(){
if (!config.get("jwtPrivateKey")) {
    throw new Error("Env Var - jwtPvtKey not defined.");
  }

if(!config.get("db")){
  throw new Error("Env Var - DB_STRING not defined")
}
}