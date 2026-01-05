import express, { Application, Request, Response, NextFunction } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';
import { CommentRouter } from "./modules/comment/comment.router";

const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials:true
}))

app.use(express.json());

app.use("/posts", postRouter);
app.use("/comments", CommentRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;