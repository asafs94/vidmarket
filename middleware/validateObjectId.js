const mongoose=require('mongoose');

module.exports = function( req,resp,next){
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return resp.status(404).send(`Invalid id`);

    next();
}