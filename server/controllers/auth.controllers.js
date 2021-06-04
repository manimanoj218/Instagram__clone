const Users = require("../models/user.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
    });
  }

  await Users(req.body).save((err, user) => {
    if (err) {
      return res.status(400).json({
        message: "Not able to save user in DB",
      });
    }
    if (user) {
       return res.status(200).json({success:true})
    }
  });
};

const signin = async(req,res) => {
  const errors = validationResult(req);
  const { emailOrUsername,password } = req.body;
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
    });
  }

  const user = await Users.findOne({$or:[ {email: emailOrUsername},{username: emailOrUsername} ]});

  // authenticate user
  if(!user.authenticate(password)){
      return res.status(401).json({ message:"Sorry, your password was incorrect. Please double-check your password"})
  }
  const { _id,pic,username,fullname,private,website,bio } = user;

  // create token
  const token = jwt.sign({ _id,pic,username,fullname,private,website,bio },process.env.SECRET_KEY,{ expiresIn:"30d" });
  // send response to frontend
  return res.status(200).json({token,login:true,user:{ _id,pic,username,fullname,private,website,bio }})
}

module.exports = { signup,signin };