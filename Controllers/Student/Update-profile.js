const User = require('../../Models/UserSchema'); // adjust path if needed

// Update user profile controller
const updateUserProfile = async (req, res) => {
    try {
        const userEmail = req.query.email; // user ID from URL params
        // console.log(userEmail)

        const {
            username,
            description,
            location,
            github,
            linkedin,
            skills // assume array of strings
        } = req.body;
        // console.log(req.body);
        
        const isUserExists = await User.findOne({ email: userEmail });

        if (!isUserExists) {
            return res.status(404).json({
                message: "Changes denied: user not found.",
                success: false
            });
        }

        const userId = isUserExists._id;

        // Build update object
        const updateFields = {
            ...(username && { username }),
            ...(description && { description }),
            ...(location && { location }),
            ...(github && { github }),
            ...(linkedin && { linkedin }),
            ...(skills && { skills }),
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User profile updated successfully',
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = updateUserProfile
