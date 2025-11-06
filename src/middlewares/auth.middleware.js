import User from "../models/User.model.js";

import jwt from "jsonwebtoken"

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("Token expired or not valid, Login again");
    }

    
    const decodedToken = jwt.verify(token,"RS256")
    

    const { _id } = decodedToken;

    const user = await User.findById(_id).select("-password");

    req.user = user;

    next();
  } catch (error) {
     res
     .status(404)
     .json({
      message:error.message
     })
  }
};

export default isLoggedIn
