"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const issueRoutes_1 = __importDefault(require("./routes/issueRoutes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
dotenv_1.default.config();
(0, db_1.initializeDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const limiter = (0, express_rate_limit_1.default)({
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
app.use("/issue", issueRoutes_1.default);
app.use((req, res) => {
    console.log("404 - Route not found:", req.method, req.url);
    res.status(404).json({ error: "Route not found" });
});
app.use((err, req, res, next) => {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
});
exports.default = app;
