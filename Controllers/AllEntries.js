const UserModel = require('../Models/UserSchema');
const GpassModel = require('../Models/GatepassModel');

async function AllEntries(req, res) {
    try {
        const { email } = req.query;

        if (!email) {
            const allEntriesData = await GpassModel.find()
                .populate("userId", "email") // Fetch user emails
                .select("userId exitTime entryTime");


            // Transform data into the required format
            const formattedData = allEntriesData.map(entry => ({
                email: entry.userId?.email || "Unknown",
                exitTime: entry.exitTime,
                entryTime: entry.entryTime
            }));

            return res.status(200).json({
                success: true,
                data: formattedData
            });
        }

        // Case 2: If email is provided, fetch specific user's entries
        const userData = await UserModel.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                message: "User does not exist",
                success: false
            });
        }

        // Fetch user's gate pass entries
        const userEntries = await GpassModel.find({ userId: userData._id })
            .select("exitTime entryTime");

        return res.status(200).json({
            success: true,
            email: email,
            data: userEntries
        });

    } catch (error) {
        console.error("Error while fetching log", error);
        return res.status(500).json({
            message: "Server-side error in AllEntries controller",
            success: false
        });
    }
}

module.exports = AllEntries;
