const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const exists = await User.findOne({ email });
    if(exists) {
        return res.status(400).json({message: "Email Already Registered"});
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    });
} catch (err) {
    next(err);
  } 
};

exports.login = async (req, res, next) => {
    try{
        const { email , password } = req.body;
        const  user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({messsage: "Invalid Credentials"});
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
   } catch (err) {
        next(err);
    }
};