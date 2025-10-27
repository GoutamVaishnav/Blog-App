import { AuthenticatedRequest } from "../middleware.ts/isAuth";
import getBuffer from "../utils/dataUri";
import { sql } from "../utils/db";
import { TryCatch } from "../utils/TryCatch";
import { v2 as cloudinary } from "cloudinary";
export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { title, description, blogcontent, category } = req.body;
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      message: "No file to upload",
    });
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    return res.status(400).json({
      message: "Failed to generate buffer",
    });
  }

  const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
    folder: "blog",
  });

  const result =
    await sql`INSERT INTO blogs (title, description, image,blogcontent, category,author) VALUES (${title}, ${description}, ${cloud.secure_url}, ${blogcontent}, ${category}, ${req.user?._id}) RETURNING *`;

  res.json({
    messsage: "Blog create successfully",
    blog: result[0],
  });
});
