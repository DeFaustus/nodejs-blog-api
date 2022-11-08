const jwt = require("jsonwebtoken");
module.exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({
      message: "silahkan login",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.auth = decoded;
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
  return next();
};
