import express from "express";
import { 
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser 
} from "../controller/profileController.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/suggested", getSuggestedUsers);
router.post("/follow/:id", followUnfollowUser);
router.post("/update", updateUser);

export default router;