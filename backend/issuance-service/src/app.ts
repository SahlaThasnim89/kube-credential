import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initializeDB } from "./db";
import issueRouter from "./routes/issueRoutes";
import rateLimit from "express-rate-limit";

dotenv.config();

initializeDB();

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 20, // limit each IP to 20 requests per minute
  message: { error: "Too many requests, please try again later." },
});

app.use("/issue", limiter);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Issuance service is running" });
});

app.use("/issue", issueRouter);

app.use((req, res) => {
  console.log("404 - Route not found:", req.method, req.url);
  res.status(404).json({ error: "Route not found" });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

export default app;
