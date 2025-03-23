const mongoose = require('mongoose');

const DB_connect = async (URL) => {
    try {
        const res = await mongoose.connect(URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

module.exports = DB_connect;
