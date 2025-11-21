import mongoose from "mongoose"
import ProjectNote from "../models/Note.model.js"
import Project from "../models/Project.model.js"

const createNote = async (req, res) => {

    const { content } = req.body

    const { projectId } = req.params

    try {

        const project = await Project.findById(projectId)
        console.log(project)

        if (!project) {
            return res.status(404)
                .json({
                    succes: false,
                    message: "Project not found "
                })
        }

        const projectNote = await ProjectNote.create({
            project: new mongoose.Types.ObjectId(projectId),
            createdBy: new mongoose.Types.ObjectId(req.user._id),
            content
        })
  
        console.log(projectNote)
        const populateProjectNote = await ProjectNote.findById(projectNote._id)
            .populate("createdB690ef7548a261a29b2660fe1y",
                "userName fullName avatar"
            )

     console.log(populateProjectNote)

        return res.status(201)
            .json({
                succes: true,
                message: "ProjectNote created Succesfully",
                populateProjectNote
            })

    } catch (error) {
        return res.status(501)
            .json({
                succes: false,
                message: error.message
            })
    }

}

export {
    createNote
}