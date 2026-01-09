import e from "express";
import { AuthenticatedRequest } from "../middleware.ts/isAuth";
import getBuffer from "../utils/dataUri";
import { sql } from "../utils/db";
import { TryCatch } from "../utils/TryCatch";
import { v2 as cloudinary } from "cloudinary";
import { invalidareCacheJob } from "../utils/rabbitmq";
import { GoogleGenAI } from "@google/genai";
import {GoogleGenerativeAI} from "@google/generative-ai"
export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
  console.log("CREATE BLOG API HIT");

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

  await invalidareCacheJob([`blogs:*`]);
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

  await invalidareCacheJob([`blogs:*`, `blog:${id}`]);
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
  await invalidareCacheJob([`blogs:*`, `blog:${id}`]);
  res.json({
    message: "Blog deleted successfully",
  });
});

export const aiTitleResponse = TryCatch(async (req, res) => {
  const { text } = req.body;
  const prompt = `Correct the grammar of the following blog title and return only the corrected
title without any additional text, formatting, or symbols: "${text}"`;
  let result;
  const genai = new GoogleGenAI({
    apiKey: process.env.Gemini_Api_Key as string,
  });

  async function main() {
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);
    let rawText = response.text;
    if (!rawText) {
      {
        res.status(400).json({
          message: "AI service error",
        });
        return;
      }
    }
    result = rawText
      .replace(/\*\*/g, "")
      .replace(/[\r\n]+/g, "")
      .replace(/[*_`~]/g, "")
      .trim();
  }

  await main();

  res.json(result);
});

/////ai description
export const aiDescriptionResponse = TryCatch(async (req, res) => {
  const { title, description } = req.body;

  const prompt =
    description === ""
      ? `Generate only one short blog description based on
this title: "${title}". Your response must be only one sentence, strictly under 30 words, with no options, no
greetings, and no extra text. Do not explain. Do not say 'here is'. Just return the description only.`
      : `Fix the
grammar in the following blog description and return only the corrected sentence. Do not add anything else:
"${description}"`;
  let result;

  const ai = new GoogleGenAI({
    apiKey: process.env.Gemini_Api_Key,
  });

  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let rawtext = response.text;

    if (!rawtext) {
      res.status(400).json({
        message: "Something went wrong",
      });
      return;
    }

    result = rawtext
      .replace(/\*\*/g, "")
      .replace(/[\r\n]+/g, "")
      .replace(/[*_`~]/g, "")
      .trim();
  }

  await main();

  res.json(result);
});


/////ai conteny

export const aiBlogResponse = TryCatch(async (req, res) => {
  const prompt = ` You will act as a grammar correction engine. I will provide you with blog content 
in rich HTML format (from Jodit Editor). Do not generate or rewrite the content with new ideas. Only correct 
grammatical, punctuation, and spelling errors while preserving all HTML tags and formatting. Maintain inline styles, 
image tags, line breaks, and structural tags exactly as they are. Return the full corrected HTML string as output. `;

  const { blog } = req.body;
  if (!blog) {
    res.status(400).json({
      message: "Please provide blog",
    });
    return;
  }

  const fullMessage = `${prompt}\n\n${blog}`;

  const ai = new GoogleGenerativeAI(process.env.Gemini_Api_Key as string);

  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: fullMessage,
          },
        ],
      },
    ],
  });

  const responseText = await result.response.text();

  const cleanedHtml = responseText
    .replace(/^(html|```html|```)\n?/i, "")
    .replace(/```$/i, "")
    .replace(/\*\*/g, "")
    .replace(/[\r\n]+/g, "")
    .replace(/[*_`~]/g, "")
    .trim();

  res.status(200).json({ html: cleanedHtml });
});