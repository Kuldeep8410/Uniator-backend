const UserModel = require("../models/UserModel");

const AddTask = async (req, res) => {
    try {
        const { email, taskbody } = req.body;
        const user = await UserModel.findOne({ email: email });
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        const updateData = await UserModel.findByIdAndUpdate(user._id, {
            $push: { tasks: taskbody }
        }, { new: true });

        res.status(200).send(updateData);
    } catch (error) {
        console.error("Error while adding task:", error);
        res.status(500).send("Error while adding a task");
    }
};

module.exports = AddTask;
