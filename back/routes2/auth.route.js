import express from "express";
import { getMe, login, logout, signup } from "../controller/authController.js";
// import { protect } from '../controller/authController.js' ;

const router = express.Router();

router.get("/me", getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;