const express = require("express");
const CourseModel = require("../../Models/ClassModel");

async function ToggleAttendance (req, res){
    try {
        console.log("function initiated")
        const { id } = req.params; 
        console.log("id jk", id)
        const { isActive } = req.body;

        const xyz = isActive

        const updatedCourse = await CourseModel.findByIdAndUpdate(
            id,
            {$set : {isActive : xyz} },
            { new: true, runValidators: true } 
        );

        if (!updatedCourse) {
            return res.status(404).json({
                message: "Course not found",
                success: false,
            });
        }
        

        res.status(200).json({
            message: "Course updated successfully",
            success: true,
            data: updatedCourse,
        });

    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
};

module.exports = ToggleAttendance;
