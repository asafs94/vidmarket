const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, resp, next){
    const token = req.header('x-auth-token');
    if(!token) resp.status(401).send('Access denied. No token provided.');

    try{
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user= decoded;
    next();
    }
    catch(ex){
        return resp.status(400).send("Invalid Token");
    }
}