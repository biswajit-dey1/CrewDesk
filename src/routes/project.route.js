import express from "express"
import isLoggedIn from "../middlewares/auth.middleware.js"
import { createProject, getProjectsofloggedInUser } from "../controllers/project.controller.js"

const projectRoutes  = express.Router()

projectRoutes.post("/create-project",isLoggedIn,createProject)
projectRoutes.get("/getProjects",isLoggedIn,getProjectsofloggedInUser)

export default projectRoutes