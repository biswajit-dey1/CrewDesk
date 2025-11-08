import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    inLength: 4,
    maxLength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true, "Password is required"],

    trim: true,
  },
  userName: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    sparse:true
  },
  avatar: {
    type: {
      url: String,
      localPath: String,
    },
    default: {
      url: `https://via.placeholder.com/200x200.png`,
      localPath: "",
    },
  },
}, { timestamps: true })

userSchema.methods.validatePassword = async function (passwordInput) {
  const user = this
  const isPasswordValid = await bcrypt.compare(passwordInput, user.password)

  return isPasswordValid
}

userSchema.methods.getJwt = async function () {
  const user = this
  const token = jwt.sign({
    _id: user._id
  },
    "RS256",
    { expiresIn: "3d" }
  )

  return token
}

const User = mongoose.model("User", userSchema)

export default User