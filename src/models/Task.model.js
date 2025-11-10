import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constant";

const taskSchema = new mongoose.Schema({

    title: {
        types: String,
        required: true,
        trim: true
    },
    description: {
        types: String
    },
    project: {
        types: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: {
        types: Schema.Types.ObjectId,
        ref: "User"
    },
    assignedBy: {
        types: Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        Types: String,
        enum: AvailableTaskStatus,
        default: TaskStatusEnum.TODO
    },
    attachments: {
        type: [
            {
                url: String,
                mimetype: String,
                size: Number,
            },
        ],
        default: [],
    },

},{timestamps:true})

const Task = mongoose.model("Task",taskSchema)
export default Task