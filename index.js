import express from 'express'
import connectDb from './src/db/db.js'
import authRoute from './src/routes/auth.route.js'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import projectRoutes from './src/routes/project.route.js'

dotenv.config()

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/project",projectRoutes)

connectDb()
           .then(() =>{
             console.log("Database connection established...")

             app.listen(port,() =>{
                console.log("Server is listening on port: ",port)
             })
             
           })
            .catch((err) =>{
                console.log("Error in connecting in database", err)
            })