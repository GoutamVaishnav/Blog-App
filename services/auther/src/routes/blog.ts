import express from "express";
import { isAuth } from "../middleware.ts/isAuth";
import { createBlog } from "../controller/blog";
import uploadfile from "../middleware.ts/multer";
const router = express.Router();
router.post("/blog/new", isAuth, uploadfile,createBlog);
export default router;
