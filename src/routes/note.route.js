import express from "express"
import isLoggedIn, { validateProjectPermission } from "../middlewares/auth.middleware.js"
import { AvailableUserRole, UserRoleEnum } from "../utils/constant.js"
import { createNote, deleteNote, getNoteById, getNotes, updateProjectNote } from "../controllers/note.controller.js"




const notesRouter = express.Router()
notesRouter.post("/:projectId/createNote",isLoggedIn,validateProjectPermission([UserRoleEnum.ADMIN]),createNote)
notesRouter.get("/:projectId/getNotes",isLoggedIn,validateProjectPermission(AvailableUserRole),getNotes)
notesRouter.get("/:projectId/getNoteById/:noteId",isLoggedIn,validateProjectPermission(AvailableUserRole),getNoteById)
notesRouter.patch("/:projectId/updateNote/:noteId",isLoggedIn,validateProjectPermission([UserRoleEnum.ADMIN]),updateProjectNote)

notesRouter.delete("/:projectId/deleteNote/:noteId",isLoggedIn,validateProjectPermission([UserRoleEnum.ADMIN]),deleteNote)

export default notesRouter