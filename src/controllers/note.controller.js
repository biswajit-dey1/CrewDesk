import mongoose from "mongoose";
import ProjectNote from "../models/Note.model.js";
import Project from "../models/Project.model.js";

const createNote = async (req, res) => {
    const { content } = req.body;

    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);


        if (!project) {
            return res.status(404).json({
                succes: false,
                message: "Project not found ",
            });
        }

        const projectNote = await ProjectNote.create({
            project: new mongoose.Types.ObjectId(projectId),
            createdBy: new mongoose.Types.ObjectId(req.user._id),
            content,
        });

        const populateProjectNote = await ProjectNote.findById(
            projectNote._id
        ).populate("createdBy", "userName fullName avatar");

        return res.status(201).json({
            succes: true,
            message: "ProjectNote created Succesfully",
            populateProjectNote,
        });
    } catch (error) {
        return res.status(501).json({
            succes: false,
            message: error.message,
        });
    }
};

const getNotes = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                succes: false,
                message: "Project not found",
            });
        }

        const projectNote = await ProjectNote.find({
            project: new mongoose.Types.ObjectId(projectId),
        }).populate("createdBy", "userName fullName avatar");

        if (!projectNote) {
            return res.status(404).json({
                succes: false,
                message: "ProjectNote not found",
            });
        }

        return res.status(200).json({
            succes: true,
            message: "ProjectNote Fetched Succesfully",
            projectNote,
        });

    } catch (error) {
        console.log(error);
        return res.status(501).json({
            succes: false,
            message: error.message,
        });
    }
};

const getNoteById = async (req, res) => {
    const { noteId } = req.params;


    try {
        const projectNote = await ProjectNote.findById(noteId).populate(
            "createdBy",
            "userName fullName avatar"
        );


        if (!projectNote) {
            return res.status(404).json({
                succes: false,
                message: "ProjectNote not found",
            });
        }

        return res.status(200).json({
            succes: true,
            message: "ProjectNote Fetched Succesfully",
            projectNote,
        });

    } catch (error) {
        return res.status(501).json({
            succes: false,
            message: error.message,
        });
    }
};

const updateProjectNote = async (req, res) => {
    const { noteId } = req.params
    const { content } = req.body

    try {
        const existingNote = await ProjectNote.findById(noteId)

        if (!existingNote) {
            return res.status(404)
                .json({
                    succes: false,
                    message: "Note not found"

                })
        }

        const updatedNote = await ProjectNote.findByIdAndUpdate(
            noteId,
            {
                content
            },
            { new: true }
        ).populate(
            "createdBy",
            "userName fullName avatar"
        )

        return res.status(201)
            .json({
                succes: true,
                message: "Note updated succesfully",
                updatedNote

            })
    } catch (error) {
        return res.status(501).json({
            succes: false,
            message: error.message,
        });
    }

}

const deleteNote = async (req, res) => {
    const { noteId } = req.params
    try {
        const note = await ProjectNote.findByIdAndDelete(noteId)

        if (!note) {
            return res.status(404)
                .json({
                    succes: false,
                    message: "Note not found"
                })

        }


        return res.status(200)
            .json({
                succes: true,
                message: "Note deleted Succesfully",
                note
            })



    } catch (error) {
        return res.status(501).json({
            succes: false,
            message: error.message,
        });
    }
}
export {
    createNote,
    getNotes,
    getNoteById,
    updateProjectNote,
    deleteNote
};
