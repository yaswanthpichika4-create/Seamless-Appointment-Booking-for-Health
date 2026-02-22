require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// Custom Imports
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  process.exit(1);
});

const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
  console.error("ERROR: MONGO_URL is not defined in environment variables.".red.bold);
  process.exit(1);
}

mongoose.connect(mongoURL, {
  family: 4,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Connection error:", error);
});

db.once("open", () => {
  console.log(`Connected to MongoDB`.cyan.underline.bold);
  console.log("Environment:", `${process.env.NODE_ENV}`.yellow);
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
