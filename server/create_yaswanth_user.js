const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const userData = {
            name: "yaswanth",
            email: "yaswanthpichika4@gmail.com",
            phoneNumber: "+919440242999",
            password: "Yash@4444",
            isAdmin: true // Making them admin since they are the owner
        };

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            console.log("ℹ️ User already exists. Updating password...");
            existingUser.password = userData.password;
            await existingUser.save();
            console.log("✅ User updated successfully.");
        } else {
            await User.create(userData);
            console.log("✅ User created successfully.");
        }

    } catch (error) {
        console.error("❌ Error creating user:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createUser();
