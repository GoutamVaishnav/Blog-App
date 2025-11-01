import express from "express";
import { isAuth } from "../middleware.ts/isAuth";
import { createBlog, deleteBlog, updateBlog } from "../controller/blog";
import uploadfile from "../middleware.ts/multer";
const router = express.Router();
router.post("/blog/new", isAuth, uploadfile, createBlog);
router.post("/blog/update/:id", isAuth, uploadfile, updateBlog);
router.delete("/blog/delete/:id", isAuth, deleteBlog);
export default router;
