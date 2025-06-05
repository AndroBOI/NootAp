import User from "../models/User.js";
import Note from "../models/Note.js";

// Create a new user
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "User already exists" });

    user = await User.create({ name, email, password });
    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new note for a user
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

// Get all notes for a user
export const getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params; // matches router param
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes by user:", err);
    res.status(500).json({ error: err.message });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const notes = await Note.find({ userId: user._id });

    res.json({
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
