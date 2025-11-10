import express from "express"
import isLoggedIn, { validateProjectPermission } from "../middlewares/auth.middleware.js"
import { UserRoleEnum } from "../utils/constant.js"
import { createTask } from "../controllers/task.controller.js"

const taskRouter = express.Router()


taskRouter.post("/create-task/:projectId",isLoggedIn, validateProjectPermission(
    [UserRoleEnum.ADMIN,
     UserRoleEnum.PROJECT_ADMIN
    ]
),createTask)


export default taskRouter