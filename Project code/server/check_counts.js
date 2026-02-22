const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/userModel');
const Doctor = require('./models/doctorModel');

const checkCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const userCount = await User.countDocuments();
        const doctorCount = await Doctor.countDocuments();

        console.log(`- Total Users: ${userCount}`);
        console.log(`- Total Doctors: ${doctorCount}`);

        if (doctorCount > 0) {
            const doctors = await Doctor.find().limit(5);
            console.log("✅ Sample Doctors:");
            doctors.forEach(d => console.log(`  - ${d.fullName} (${d.specialization}) - Status: ${d.status}`));
        }

        if (userCount > 0) {
            const users = await User.find().limit(5);
            console.log("✅ Sample Users:");
            users.forEach(u => console.log(`  - ${u.name} (${u.email}) - Admin: ${u.isAdmin}`));
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

checkCounts();
