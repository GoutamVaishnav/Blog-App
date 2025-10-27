import express from "express";
import {
  getUserProfile,
  loginUser,
  myProfile,
  updateProfilePic,
  userUpdate,
} from "../controllers/user.js";
import { isAuth } from "../middeware/isAuth.js";
import uploadfile from "../middeware/multer.js";

const router = express.Router();
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/user/:id", getUserProfile);
router.post("/user/update", isAuth, userUpdate);
router.post("/user/updatepic", isAuth, uploadfile, updateProfilePic);
export default router;
