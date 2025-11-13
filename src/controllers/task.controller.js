import mongoose from "mongoose"
import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"
import User from "../models/User.model.js"
import ProjectMember from "../models/ProjectMember.model.js"
import Subtask from "../models/Subtask.model.js"


const createTask = async (req, res) => {

    const { title, description, assignedTo, status } = req.body
    const { projectId } = req.params


    try {
        const project = await Project.findById(projectId)



        if (!project) {

            return res.status(404)
                .json({
                    success: false,
                    message: "User is not a member of project"
                })
        }

        const assignedToUser = await User.findOne({
            email: assignedTo
        })


        const projectMember = await ProjectMember.find({
            user: assignedToUser._id
        })

        console.log(projectMember)

        if (projectMember.length == 0) {

            return res.status(404)
                .json({
                    success: false,
                    message: "User is not member to project"
                })
        }


        if (!assignedToUser) {
            return res.status(404)
                .json({
                    success: false,
                    message: "No User found"
                })
        }



        const task = await Task.create({
            title,
            description,
            project: new mongoose.Types.ObjectId(projectId),
            assignedBy: new mongoose.Types.ObjectId(req.user._id),
            assignedTo: new mongoose.Types.ObjectId(assignedToUser._id),
            status
        })



        if (!task) {
            return res.status(500)
                .json({
                    success: false,
                    message: "Failure in creating task"
                })
        }

        return res.status(201)
            .json({
                success: true,
                message: "Task created succesully",
                task
            })

    } catch (error) {
        return res.status(501)
            .json({
                success: false,
                message: error.message
            })
    }
}


const getTasks = async (req, res) => {

    const { projectId } = req.params

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit

    try {
        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Project not found"
                })
        }

        const tasks = await Task.aggregate([
            {
                $match: {
                    project: new mongoose.Types.ObjectId(projectId)
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedTo",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {

                    assignedTo: {
                        $arrayElemAt: ["$assignedTo", 0]
                    }
                }
            },

            {
                $skip: skip
            },

            {
                $limit: 10
            },

        ])

        if (!tasks) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Task not found"
                })
        }

        return res.status(200)
            .json({
                success: true,
                message: "Tasks fetched succesfully",
                tasks
            })

    } catch (error) {

        return res.status(501)
            .json({
                success: false,
                message: error.message
            })
    }

}


const getTaskById = async (req, res) => {

    const { taskId } = req.params

    try {

        const task = await Task.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(taskId)
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "assignedTo",
                    foreignField: "_id",
                    as: "assignedTo",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }

                    ]
                }
            },

            {
                $lookup: {
                    from: "subtasks",
                    localField: "_id",
                    foreignField: "task",
                    as: "subtasks"

                }
            },

            {
                $addFields: {

                    assignedTo: {
                        $arrayElemAt: ["$assignedTo", 0]
                    },
                    subtasks: {
                        $arrayElemAt: ["$subtasks", 0]
                    }

                }
            },
        ])

        if (!task || task.length == 0) {

            return res.status(404)
                .json({
                    success: false,
                    message: "Task not found"
                })
        }
        return res.status(201)
            .json({
                success: true,
                message: "Task fetched succesfully",
                task: task[0]
            })


    } catch (error) {
        return res.status(501)
            .json({
                success: false,
                message: error.message
            })
    }

}


const updateTask = async (req, res) => {

    const { title, description, assignedTo, status } = req.body
    const { taskId } = req.params

    try {

        const existingTask = await Task.findById(taskId)

        if (!existingTask) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Task not found"
                })
        }


        const assignedToUser = await User.findOne({
            email: assignedTo
        })


        const projectMember = await ProjectMember.find({
            user: assignedToUser._id
        })



        if (projectMember.length == 0) {

            return res.status(404)
                .json({
                    success: false,
                    message: "User is not member to project"
                })
        }


        if (!assignedToUser) {
            return res.status(404)
                .json({
                    success: false,
                    message: "No User found"
                })
        }


        const updateField = {
            assignedBy: new mongoose.Types.ObjectId(req.user._id),

        }

        if (title !== undefined) updateField.title = title
        if (description !== undefined) updateField.description = description
        if (status !== undefined) updateField.status = status

        if (assignedToUser !== undefined) {

            updateField.assignedTo = new mongoose.Types.ObjectId(assignedToUser._id)

        } else if (existingTask.assignedTo) {

            updateField.assignedTo = new mongoose.Types.ObjectId(existingTask.assignedTo)
        }


        const updatedtask = await Task.findByIdAndUpdate(taskId,
            updateField,
            {
                new: true
            }
        ).populate("assignedTo", "userName fullName avatar")
            .populate("assignedBy", "userName fullName avatar")

        if (!updatedtask) {

            return res.status(404)
                .json({
                    success: false,
                    message: "Failure in updating task"
                })
        }

        return res.status(201)
            .json({
                success: true,
                message: "Task updated succesfully",
                updatedtask

            })

    } catch (error) {
        return res.status(501)
            .json({
                success: false,
                message: error.message
            })
    }


}




const createSubTask = async (req, res) => {

    const { taskId } = req.params

    const { title } = req.body

    try {

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Task not found"
                })
        }

        const subtask = await Subtask.create({
            title,
            task: new mongoose.Types.ObjectId(taskId),
            createdBy: new mongoose.Types.ObjectId(req.user._id)
        })

        return res.status(201)
            .json({
                success: true,
                message: "SubTask created Successfully",
                subtask
            })

    } catch (error) {
        return res.status(501)
            .json({
                success: false,
                message: error.message
            })
    }
}
export { createTask, getTasks, getTaskById, updateTask, createSubTask }