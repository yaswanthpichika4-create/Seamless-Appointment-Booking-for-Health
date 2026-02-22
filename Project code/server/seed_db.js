const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/userModel');
const Doctor = require('./models/doctorModel');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to MongoDB");

        // Clear existing data to ensure clean seed with new numbers
        console.log("Clearing existing data...");
        await User.deleteMany({ email: { $ne: "yaswanthpichika4@gmail.com" } });
        await Doctor.deleteMany({});

        const hashedPassword = await bcrypt.hash("password123", 12);

        // 1. Create Sample Users
        const usersData = [
            { name: "John Doe", email: "john@example.com", phoneNumber: "+919000000001", password: "password123", isAdmin: false, isDoctor: false },
            { name: "Jane Smith", email: "jane@example.com", phoneNumber: "+919000000002", password: "password123", isAdmin: false, isDoctor: true },
            { name: "Dr. Mike", email: "mike@example.com", phoneNumber: "+919000000003", password: "password123", isAdmin: false, isDoctor: true },
        ];

        console.log("Seeding users...");
        for (const u of usersData) {
            await User.create(u);
            console.log(`  - Created user: ${u.email}`);
        }

        // 2. Create Sample Doctors
        const janeUser = await User.findOne({ email: "jane@example.com" });
        const mikeUser = await User.findOne({ email: "mike@example.com" });

        const doctorsData = [
            {
                userId: janeUser._id,
                prefix: "Dr.",
                fullName: "Jane Smith",
                email: "jane@example.com",
                phoneNumber: "+919000000002",
                address: "123 Medical St",
                specialization: "Cardiology",
                experience: "10 years",
                feePerConsultation: 100,
                fromTime: "09:00",
                toTime: "17:00",
                status: "approved"
            },
            {
                userId: mikeUser._id,
                prefix: "Dr.",
                fullName: "Mike Horn",
                email: "mike@example.com",
                phoneNumber: "+919000000003",
                address: "456 Health Ave",
                specialization: "Dermatology",
                experience: "5 years",
                feePerConsultation: 80,
                fromTime: "10:00",
                toTime: "18:00",
                status: "approved"
            }
        ];

        console.log("Seeding doctors...");
        for (const d of doctorsData) {
            await Doctor.create(d);
            console.log(`  - Created doctor: ${d.email}`);
        }

        console.log("✅ Seeding complete!");

    } catch (error) {
        console.error("❌ Error seeding data:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seedData();
