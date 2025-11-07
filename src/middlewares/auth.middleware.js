
import ProjectMember from "../models/ProjectMember.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

import jwt from "jsonwebtoken"


const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("Token expired or not valid, Login again");
    }


    const decodedToken = jwt.verify(token, "RS256")


    const { _id } = decodedToken;

    const user = await User.findById(_id).select("-password");

    req.user = user;

    next();
  } catch (error) {
    res
      .status(404)
      .json({
        message: error.message
      })
  }
};

const validateProjectPermission = (roles = []) =>

  async (req, res, next) => {
    try {

      const { projectId } = req.params
    

      if (!projectId) {
        return res.status(404)
          .json({
            success: false,
            message: "Project Id is missing"

          })
      }

      const project = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(projectId)

      })

      if (!project) {
        return res.status(404)
          .json({
            success: false,
            message: "Project not found"

          })
      }
 

      const givenRole = project?.role
    

      req.user.role = givenRole

      if (!roles.includes(givenRole)) {

        return res.status(403)
          .json({
            success: false,
            message: "You do not have permission to perform this action"

          })
      }

      next()

    } catch (error) {
      res
        .status(501)
        .json({
          succes: false,
          message: error.message

        })
    }
  }



export default isLoggedIn
export { validateProjectPermission }
