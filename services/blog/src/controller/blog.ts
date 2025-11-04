
import axios from "axios";
import { sql } from "../utils/db.js";
import { TryCatch } from "../utils/TryCatch.js";
import { redisClient} from "../server.js";
export const getAllBlogs = TryCatch(async (req, res) => {
  const {searchQuery="", category=""} = req.query;

  const cacheKey = `blogs:${searchQuery}:${category}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return res.json({
      "message": "All Blogs fetched successfully from cache",
      blogs: JSON.parse(cached),
    });
    return;
  }

  let blogs;
  if(searchQuery && category){
     blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) AND (category = ${category}) ORDER BY create_at DESC`;
  } else if (searchQuery) {
     blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) ORDER BY create_at DESC`;
  } else if (category) {
     blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%" + category + "%"} OR description ILIKE ${"%" + category + "%"}) ORDER BY create_at DESC`;
  } else {
     blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC`;
  }
  console.log("serving from DB");
  await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3600 }); // Cache for 1 hour
  res.json({
    "message": "All Blogs fetched successfully",
    blogs,
  });
});


export const getSingleBlog = TryCatch(async (req, res) => {
  const blogid = req.params.id;
  const cacheKey= `blog:${blogid}`;
  const cached = await redisClient.get(cacheKey);
    if (cached) {
    return res.json({
      "message": "single Blog fetched successfully from redis cache",
      blogs: JSON.parse(cached),
    });
    return;
  }
  const blog = await sql`SELECT * FROM blogs WHERE id = ${blogid}`;
  if (blog.length === 0) {
    return res.status(404).json({
      "message": "Blog not found",
    });
    return;
  }

  const {data}= await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0].author}`); 
  const responseData={blog: blog[0], author:data};
  await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 }); // Cache for 1 hour
  console.log("serving from DB");
  res.json({
    "message": "Blog fetched successfully",
    blog: responseData,
  });
});
