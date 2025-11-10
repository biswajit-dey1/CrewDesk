import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constant.js";

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required:true,
        trim: true
    },
    description:String,

    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: AvailableTaskStatus,
        default: TaskStatusEnum.TODO
    },
  
},{timestamps:true})

const Task = mongoose.model("Task",taskSchema)
export default Task