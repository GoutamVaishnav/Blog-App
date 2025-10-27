import express from "express";
import dotenv from "dotenv";
import { sql } from "./utils/db";
dotenv.config();
const app = express();
const port = process.env.PORT;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS blogs(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    blogcontent TEXt NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    await sql`CREATE TABLE IF NOT EXISTS comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    blogid VARCHAR(255) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    await sql`CREATE TABLE IF NOT EXISTS savedblogs(
    id SERIAL PRIMARY KEY,
    userid VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    blogid VARCHAR(255) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    console.log("db initialize successfully");
  } catch (error) {
    console.log("Error initDB : ", error);
  }
}

initDB().then(() => {
  app.listen(port, () => {
    console.log(`server is running on localhost:5001 on port ${port}`);
  });
});
