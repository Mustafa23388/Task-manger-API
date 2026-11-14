const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
    try{
        const header = req.headers.authorization;
        if(!header || !header.startsWith("Bearer")){
            return res.status(401).json({message: "Not Authorized"});
        }
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);
      if(!req.user){
        return res.status(401).json({message: "User No Longer Exists"});
      }
      next();
    } catch(err){
        res.status(401).json({message: "Not Authorized"});
    }
};