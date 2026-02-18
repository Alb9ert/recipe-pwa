/* eslint-disable */
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// to run: npx tsx tests/createTestUser.ts

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI_TEST as string);
    console.log("Connected to test database");

    // Check if user already exists
    const existingUser = await User.findOne({ email: "test@test.com" });
    if (existingUser) {
      console.log("Test user already exists");
      await mongoose.connection.close();

      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("test123", 10);
    const testUser = await User.create({
      email: "test@test.com",
      password: hashedPassword,
      name: "Test User",
    });

    console.log("Test user created successfully:");
    console.log(`Email: ${testUser.email}`);
    console.log(`Name: ${testUser.name}`);
    console.log("Password: test123");

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error creating test user:", error);
    await mongoose.connection.close();
  }
};

createTestUser();
