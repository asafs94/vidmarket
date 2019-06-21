

module.exports = (validator) =>{
    return (req,resp,next)=>{
        const { error } = validator(req.body);
        if (error) return resp.status(400).send(error.details.message);
        next();
    }
}