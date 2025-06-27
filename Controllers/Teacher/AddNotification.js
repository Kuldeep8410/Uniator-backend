const classModel = require('../../Models/ClassModel');

// Delete a specific notification by message and classId
async function deletionNoti(message, courseCode, res) {
  try {
    
    const _id  = message
    const updated = await classModel.findOneAndUpdate(
      { courseCode: courseCode },
      { $pull: { Notification: { _id } } },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({
        message: "Notification not found or unable to delete",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Notification deleted successfully",
      success: true,
    });

  } catch (error) {
    console.log("error in deletionNoti:", error);
    return res.status(500).json({
      message: "Server error during deletion",
      success: false,
    });
  }
}

// View all notifications for a class
async function viewNoti(courseCode, res) {
  try {
   
    const classData = await classModel.findOne({ courseCode });

    if (!classData || !classData.Notification || classData.Notification.length === 0) {
      return res.status(200).json({
        message: "No notifications found",
        success: false,
      });
    }
    const sendData = classData.Notification
    return res.status(200).json({
      notifications: classData.Notification,
      success: true,
      message : "hello"
    });
  } catch (error) {
    console.log("error in viewNoti:", error);
    return res.status(500).json({
      message: "Server error during view",
      success: false,
    });
  }
}

// Main handler
async function AddNotification(req, res) {
  try {
    const { message, email, classId, actions } = req.body;
    const courseCode = classId;
    console.log(req.body)

    if (actions === "delete" && message && courseCode) {
      console.log ("hi1")
      return deletionNoti(message, courseCode, res);
    }

    if (actions === "view" && courseCode) {
      console.log("hi")
      return viewNoti(courseCode, res);
    }

    if (!message || !email || !courseCode) {
      return res.status(400).json({
        message: "Missing data",
        success: false
      });
    }

    const isClass = await classModel.findOne({ courseCode });

    if (!isClass) {
      return res.status(400).json({
        message: "Wrong class ID",
        success: false
      });
    }

    await classModel.findByIdAndUpdate(
      isClass._id,
      { $push: { Notification: { message } } },
      { new: true }
    );

    return res.status(200).json({
      message: "Notification added successfully",
      success: true
    });

  } catch (error) {
    console.log("Error occurred:", error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
}

module.exports = AddNotification;
