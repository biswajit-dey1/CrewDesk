import mongoose from "mongoose"
import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"
import User from "../models/User.model.js"


const createTask = async (req, res) => {

    const { title, description, assignedTo, status } = req.body
    const { projectId } = req.params


    try {
        const project = await Project.findById(projectId)


        if (!project) {

            return res.status(404)
                .json({
                    success: false,
                    message: "Project not found"
                })
        }

        const assignedToUser = await User.findOne({
            email: assignedTo
        })


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
                    as: "assignedToUser",
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
                $unwind: "$assignedToUser"
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

export { createTask, getTasks }