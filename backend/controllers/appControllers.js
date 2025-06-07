import User from "../models/User.js";
import Note from "../models/Note.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here"; // Use 

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the note fields
    note.title = title ?? note.title;
    note.body = body ?? note.body;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a note by ID
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Note.deleteOne({ _id: id });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "User already exists" });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createNote = async (req, res) => {
  const { title, body, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const note = await Note.create({ title, body, userId });
    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes by user:", err);
    res.status(500).json({ error: err.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const notes = await Note.find({ userId: user._id });

    res.json({
      token, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      notes,
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: err.message });
  }
};
