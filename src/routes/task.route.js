import express from "express"
import isLoggedIn, { validateProjectPermission } from "../middlewares/auth.middleware.js"
import { AvailableUserRole, UserRoleEnum } from "../utils/constant.js"
import { createTask, getTasks } from "../controllers/task.controller.js"

const taskRouter = express.Router()


taskRouter.post("/create-task/:projectId",isLoggedIn, validateProjectPermission(
    [UserRoleEnum.ADMIN,
     UserRoleEnum.PROJECT_ADMIN
    ]
),createTask)

taskRouter.get("/getProjects/:projectId",isLoggedIn,validateProjectPermission(AvailableUserRole),getTasks)


export default taskRouter