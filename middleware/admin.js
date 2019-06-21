
module.exports = function admin(req, resp, next) {
  if (!req.user.isAdmin) return resp.status(403).send("Access Denied.");

  next();
  
};
