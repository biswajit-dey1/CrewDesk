import mongoose, { Schema } from "mongoose";

const subTaskSchema = new mongoose.Schema({
    title: {
        types: String,
        required: true,
        trim: true
    },

    task: {
        types: Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    isCompleted: {
        types: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },


}, { timestamps: true })

const Subtask = mongoose.model("Subtask",subTaskSchema)

export default Subtask