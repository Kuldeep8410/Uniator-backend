const UserModel = require("../../models/UserModel");

const Alltasks = async (req, res) => {
    try {
        const { email } = req.params;
        const dataFetched = await UserModel.findOne({ email: email });
        console.log(dataFetched)

        if (!dataFetched) {
            return res.status(404).send({ message: "User not found" });
        }

        const TaskSend = dataFetched.tasks;
        const Completetask = dataFetched.completedTasks;

        res.status(200).send({
            meassage:"hello ok",
            TaskSend,
            Completetask
        });
        
    } catch (error) {
        console.error("Error while fetching tasks:", error);
        res.status(500).send({
            message: "Error occurred while sending data"
        });
    }
};

module.exports = Alltasks;
