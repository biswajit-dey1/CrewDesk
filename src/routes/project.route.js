import express from "express"

import { createProject, getProjectbyId, getProjectsofloggedInUser } from "../controllers/project.controller.js"
import isLoggedIn, { validateProjectPermission } from "../middlewares/auth.middleware.js"
import { AvailableUserRole } from "../utils/constant.js"


const projectRoutes  = express.Router()


projectRoutes.post("/create-project",isLoggedIn,createProject)
projectRoutes.get("/getProjects",isLoggedIn,getProjectsofloggedInUser)
projectRoutes.get("/getProjectById/:projectId",isLoggedIn,validateProjectPermission(AvailableUserRole),getProjectbyId)

export default projectRoutes