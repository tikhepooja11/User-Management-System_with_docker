const jwt = require("jsonwebtoken");
const config = require("../config/config");
const auth = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Token not provided" });
  }
  try {
    token = token.split(" ")[1];
    let user = jwt.verify(token, config.token.TOKEN_KEY);
    req.userId = user.id;
    req.token = token;
  } catch (error) {
    res.status(401).json({ message: "Not Authorised...! Invalid Token" });
    return;
  }
  next();
};

module.exports = auth;
