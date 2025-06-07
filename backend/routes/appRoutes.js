import express from "express";
import {
  createUser,
  createNote,
  getNotesByUser,
  loginUser,
  updateNote,    
  deleteNote,   
} from "../controllers/appControllers.js";

const router = express.Router();

router.post("/users", createUser);
router.post("/notes", createNote);
router.get("/notes/user/:userId", getNotesByUser);
router.put("/notes/:id", updateNote);     
router.delete("/notes/:id", deleteNote);  
router.post("/login", loginUser);

export default router;
