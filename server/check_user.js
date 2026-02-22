const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const user = await User.findOne({ email: "yaswanthpichika4@gmail.com" });
        if (user) {
            console.log("✅ User found:");
            console.log("- Name:", user.name);
            console.log("- Email:", user.email);
            console.log("- Password (hashed):", user.password);
            console.log("- IsAdmin:", user.isAdmin);
        } else {
            console.log("❌ User NOT found");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

checkUser();
