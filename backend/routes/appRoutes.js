import express from "express";
import {
  createUser,
  createNote,
  getNotesByUser,
  loginUser,
} from "../controllers/appControllers.js";

const router = express.Router();

router.post("/users", createUser);
router.post("/notes", createNote);
router.get("/notes/user/:userId", getNotesByUser);  // param renamed to userId
router.post("/login", loginUser);

export default router;
