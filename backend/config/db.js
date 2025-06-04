import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/NoteAppMockDB");
    console.log("Connected to db");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};
