
import e from "express"
import User from "../models/User.model.js"
import bcrypt from "bcrypt"



const registerUser = async (req, res) => {

    try {

        const { fullName, email, password } = req.body
        console.log(fullName, email, password)

        if (!fullName || !email || !password) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: "All field are required"

                })
        }

        const userName = email.split('@')[0].toLowerCase()
        console.log(userName)
        const existedUser = await User.findOne({
            email
        })

        if (existedUser) {
            return res
                .status(409)
                .json({
                    success: false,
                    message: "Already existed User"
                })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            email,
            password: hashPassword,
            userName
        })

        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Error while creating User"
                })

        }


        return res
            .status(201)
            .json({
                success: true,
                message: "User register succesfully"
            })

    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({
                message: "Internal Server error",
                error,
                succes: false,
            });
    }

}


const login = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: "All field are required"

                })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "User not found"
                })
        }

        const isPasswordValid = await user.validatePassword(password)



        if (isPasswordValid) {
            const token = await user.getJwt()
            

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })

        }

        user.password = undefined

        res.
            status(201)
            .json({
                message: "LoggedIn sucessfully",
                data: user
            })

    } catch (error) {
        res
            .status(501)
            .json({
                message: error.message,
                succes: false

            })
    }
}

const logout = async (req,res) =>{
    res
      .clearCookie("token",{
          httpOnly: true,
    })
     .status(200)
     .json({
        succes:true,
        message:"Logout Succesfully"
     })
}

export { registerUser,login,logout }