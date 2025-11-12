import express from "express"
import isLoggedIn, { validateProjectPermission } from "../middlewares/auth.middleware.js"
import { AvailableUserRole, UserRoleEnum } from "../utils/constant.js"
import { createSubTask, createTask, getTaskById, getTasks } from "../controllers/task.controller.js"

const taskRouter = express.Router()


taskRouter.post("/create-task/:projectId",isLoggedIn, validateProjectPermission(
    [UserRoleEnum.ADMIN,
     UserRoleEnum.PROJECT_ADMIN
    ]
),createTask)

taskRouter.get("/getTasks/:projectId",isLoggedIn,validateProjectPermission(AvailableUserRole),getTasks)

taskRouter.get("/:projectId/getTaskbyId/:taskId",isLoggedIn,validateProjectPermission(AvailableUserRole),getTaskById)

taskRouter.post("/:projectId/create-subTask/:taskId",isLoggedIn,validateProjectPermission([
    UserRoleEnum.ADMIN,
    UserRoleEnum.PROJECT_ADMIN
]),createSubTask)


export default taskRouter