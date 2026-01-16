import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';



import { CommentRouter } from "./modules/comment/comment.router";
import { notFound } from "./middleware/notFound";
import errorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000", // client side url
    credentials: true
}))

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);
app.use("/comments", CommentRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use(notFound)
app.use(errorHandler)

export default app;