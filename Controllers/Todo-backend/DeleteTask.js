const UserModel = require("../models/UserModel");

const deleteTasks = async (req, res) => {
    try {
        const { email, taskbody } = req.body;
        const user = await UserModel.findOne({ email: email });
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        const updateData = await UserModel.findByIdAndUpdate(user._id, {
            $pull: { tasks: taskbody }
        }, { new: true });

        if (!updateData) {
            return res.status(404).send("Task not found or already deleted");
        }

        res.status(200).send(updateData);
    } catch (error) {
        console.error("Error while deleting task:", error);
        res.status(500).send("Error while deleting a task");
    }
};

module.exports = deleteTasks;
