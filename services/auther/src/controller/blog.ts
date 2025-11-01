import e from "express";
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

export const updateBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, blogcontent, category } = req.body;
  const blog = await sql`SELECT * from blogs WHERE id=${id}`;
  if (!blog.length) {
    return res.status(404).json({
      message: "Blog not found",
    });
    return;
  }
  if (blog[0].author != req.user?._id) {
    return res.status(401).json({
      message: "You are not authorized to update this blog",
    });
    return;
  }

  let imageUrl = blog[0].image;
  const file = req.file;
  if (file) {
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(400).json({
        message: "Failed to generate buffer",
      });
      return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "blog",
    });
    imageUrl = cloud.secure_url;
  }

  const updatedBlog = await sql`UPDATE blogs SET title=${
    title || blog[0].title
  }, description=${description || blog[0].description}, image=${
    imageUrl || blog[0].image
  }, blogcontent=${blogcontent || blog[0].blogcontent}, category=${
    category || blog[0].category
  } WHERE id=${id} RETURNING *`;
  res.json({
    message: "Blog updated successfully",
    blog: updatedBlog[0],
  });
});

export const deleteBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const blog = await sql`SELECT * from blogs WHERE id=${id}`;
  if (!blog.length) {
    return res.status(404).json({
      message: "Blog not found",
    });
    return;
  }
  if (blog[0].author != req.user?._id) {
    return res.status(401).json({
      message: "You are not authorized to delete this blog",
    });
  }
  await sql`DELETE FROM savedblogs WHERE blogid=${id}`;
  await sql`DELETE FROM comments WHERE blogid=${id}`;
  await sql`DELETE FROM blogs WHERE id=${id}`;
  res.json({
    message: "Blog deleted successfully",
  });
});
