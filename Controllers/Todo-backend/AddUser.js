const UserModel = require('../models/UserModel');

const AddUser = async (req, res) => {
    try {
        const TaskDatasRecevied = req.body;
        const doc = new UserModel(TaskDatasRecevied);
        await doc.save();
        res.status(200).send("Successfully added to database");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in AddUser");
    }
}

module.exports = AddUser;
