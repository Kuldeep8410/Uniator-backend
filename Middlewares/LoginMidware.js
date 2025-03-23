const joi = require('joi');
const jwt = require('jsonwebtoken');

const LoginValid = (req, res, next) => {
    const token = req.cookies.Myjwt;
    console.log("here",token)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized login" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRETE);
      req.user = decoded; // Attach user data to request

      next(); // Continue to next middleware/route
    } catch (error) {
        console.log("error",error);
      return res.status(403).json({ message: "Invalid token" });
    }
  };

  module.exports = LoginValid;