import axios from "axios";
import { sql } from "../utils/db.js";
import { TryCatch } from "../utils/TryCatch.js";
import { redisClient } from "../server.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
export const getAllBlogs = TryCatch(async (req, res) => {
  const { searchQuery = "", category = "" } = req.query;

  const cacheKey = `blogs:${searchQuery}:${category}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res.json({
      message: "All Blogs fetched successfully from cache",
      blogs: JSON.parse(cached),
    });
    return;
  }

  let blogs;
  if (searchQuery && category) {
    blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${
      "%" + searchQuery + "%"
    } OR description ILIKE ${
      "%" + searchQuery + "%"
    }) AND (category = ${category} OR title ILIKE ${
      "%" + category + "%"
    } OR description ILIKE ${"%" + category + "%"}) ORDER BY create_at DESC`;
  } else if (searchQuery) {
    blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${
      "%" + searchQuery + "%"
    } OR description ILIKE ${"%" + searchQuery + "%"}) ORDER BY create_at DESC`;
  } else if (category) {
    blogs =
      await sql`SELECT * FROM blogs WHERE (category = ${category} OR title ILIKE ${
        "%" + category + "%"
      } OR description ILIKE ${"%" + category + "%"}) ORDER BY create_at DESC`;
  } else {
    blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC`;
  }
  console.log("serving from DB");
  await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3600 }); // Cache for 1 hour
  res.json({
    message: "All Blogs fetched successfully",
    blogs,
  });
});

export const getSingleBlog = TryCatch(async (req, res) => {
  const blogid = req.params.id;
  const cacheKey = `blog:${blogid}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res.json({
      message: "single Blog fetched successfully from redis cache",
      blogs: JSON.parse(cached),
    });
    return;
  }
  const blog = await sql`SELECT * FROM blogs WHERE id = ${blogid}`;
  if (blog.length === 0) {
    return res.status(404).json({
      message: "Blog not found",
    });
    return;
  }

  const { data } = await axios.get(
    `${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0].author}`,
  );
  const responseData = { blog: blog[0], author: data };
  await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 }); // Cache for 1 hour
  console.log("serving from DB");
  res.json({
    message: "Blog fetched successfully",
    blog: responseData,
  });
});

export const addComment = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { id: blogid } = req.params;
  const { comment } = req.body;

  await sql`INSERT INTO comments (comment, blogid, userid, username) VALUES (${comment}, ${blogid}, ${req.user?._id}, ${req.user?.name}) RETURNING *`;

  res.json({
    message: "Comment Added",
  });
});

export const getAllComments = TryCatch(async (req, res) => {
  const { id } = req.params;

  const comments =
    await sql`SELECT * FROM comments WHERE blogid = ${id} ORDER BY create_at DESC`;

  res.json(comments);
});

export const deleteComment = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { commentid } = req.params;

    const comment = await sql`SELECT * FROM comments WHERE id = ${commentid}`;

    console.log(comment);

    if (comment[0].userid !== req.user?._id) {
      res.status(401).json({
        message: "You are not owner of this comment",
      });
      return;
    }

    await sql`DELETE FROM comments WHERE id = ${commentid}`;

    res.json({
      message: "Comment Deleted",
    });
  },
);
export const saveBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { blogid } = req.params;
  const userid = req.user?._id;
  const username = req.user?.name;

  if (!blogid || !userid || !username) {
    return res.status(400).json({
      message: "Missing blog id or user data",
    });
  }

  const existing =
    await sql`SELECT * FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}`;

  if (existing.length === 0) {
    await sql`
      INSERT INTO savedblogs (blogid, userid, username)
      VALUES (${blogid}, ${userid}, ${username})
    `;

    return res.json({ message: "Blog Saved" });
  } else {
    await sql`
      DELETE FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}
    `;

    return res.json({ message: "Blog Unsaved" });
  }
});

export const getSavedBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  const blogs =
    await sql`SELECT * FROM savedblogs WHERE userid = ${req.user?._id}`;

  res.json(blogs);
});
