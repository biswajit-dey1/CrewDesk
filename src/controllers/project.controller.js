import mongoose from "mongoose"
import Project from "../models/Project.model.js"
import ProjectMember from "../models/ProjectMember.model.js"
import { UserRoleEnum } from "../utils/constant.js"



const createProject = async (req, res) => {
    try {
        const { name, description } = req.body

        const { _id } = req.user

        const project = await Project.create({
            name,
            description,
            createdBy: _id
        })

        if (!project) {
            return res.status(409)
                .json({
                    succes: false,
                    message: "Project not found"
                })
        }


        await ProjectMember.create({
            user: _id,
            project: new mongoose.Types.ObjectId(project._id),
            role: UserRoleEnum.ADMIN
        })

        console.log("Project Member Created:", { user: _id, project: project._id });
        return res.status(201)
            .json({
                succes: true,
                message: "Project created successfully",
                data: project
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


const getProjectsofloggedInUser = async (req, res) => {

    try {



        const project = await ProjectMember.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "project",
                    foreignField: "_id",
                    as: "project",
                    pipeline: [
                        {
                            $lookup: {
                                from: "projectmembers",
                                localField: "_id",
                                foreignField: "project",
                                as: "projectmembers"
                            }
                        },
                        {
                            $addFields: {
                                members: {
                                    $size: "$projectmembers"
                                }
                            }
                        }
                    ],
                }

            },
            {
                $unwind: "$project"
            },

            {
                $project: {
                    project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        members: 1,
                        createdAt: 1,
                        createdBy: 1,
                    },
                    role: 1,
                    _id: 0
                }
            }

        ])

        res.status(200)
            .json({
                succes: true,
                message: "project fetched",
                data: project

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



const getProjectbyId = async (req, res) => {

    try {
        const { projectId } = req.params

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404)
                .json({
                    succes: false,
                    message: "Project not found"
                })
        }


        return res.status(201)
            .json({
                succes: true,
                message: "Project fetched Successfully",
                project
            })
    } catch (error) {
        res
            .status(501)
            .json({
                succes: false,
                message: error.message

            })
    }
}

const updateProject = async (req, res) => {

    try {

        const { name, description } = req.body
        const { projectId } = req.params


        const project = await Project.findByIdAndUpdate(
            projectId,
            {
                name,
                description,
            },
            { new: true },
        );



        if (!project) {
            return res.status(404)
                .json({
                    succes: false,
                    message: "Project not found"
                })
        }

        return res.status(201)
            .json({
                succes: true,
                project,
                message: "Project updated Sucessfully"
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


const deleteProject = async (req, res) => {

    try {

        const { projectId } = req.params

        const project = await Project.findByIdAndDelete(projectId)

        if (!project) {
            return res.status(404)
                .json({
                    succes: false,
                    message: "Project not found"
                })
        }

        return res.status(200)
            .json({
                succes: true,
                message: "Project deleted successfully"
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








export { createProject, getProjectsofloggedInUser, getProjectbyId, updateProject, deleteProject }