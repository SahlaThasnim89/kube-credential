import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initializeDB } from "./db";
import verifyRouter from "./routes/verifyRoutes";

dotenv.config();

initializeDB();

const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Verification service is running" });
});

app.use("/verify", verifyRouter);

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
