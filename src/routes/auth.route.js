import express from "express"
import { login, logout, registerUser } from "../controllers/auth.controller.js"
import isLoggedIn from "../middlewares/auth.middleware.js"


const authRoute = express.Router()

authRoute.post("/register",registerUser)
authRoute.post("/login",login)
authRoute.post("/logout",isLoggedIn,logout)

export default authRoute