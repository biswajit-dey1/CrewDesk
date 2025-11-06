import mongoose from "mongoose";
import { AvailableUserRole, UserRoleEnum } from "../utils/constant.js";

const projectMember = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project",
        required:true
    },
    role:{
        type:String,
        enum:AvailableUserRole,
        default:UserRoleEnum.MEMBER
    }
})

const ProjectMember = mongoose.model("ProjectMember",projectMember)
export default ProjectMember