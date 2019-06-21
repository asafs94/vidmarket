module.exports = function middlewareFunction(func){

    return async function(req,resp,next){
      try{
        await func(req,resp,next);
      }catch(ex){
        next(ex);
      }
    }
  
  }