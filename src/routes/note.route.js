import express from "express"
import isLoggedIn, { validateProjectPermission } from "../middlewares/auth.middleware.js"
import { UserRoleEnum } from "../utils/constant.js"
import { createNote } from "../controllers/note.controller.js"




const notesRouter = express.Router()
notesRouter.post("/:projectId/createNote",isLoggedIn,validateProjectPermission([UserRoleEnum.ADMIN]),createNote)

export default notesRouter