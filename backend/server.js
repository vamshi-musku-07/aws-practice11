require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const todoRoutes = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 5000;

const DB_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

connectDB();

// Allow comma-separated origins, or * for any (needed for Cloudflare tunnels)
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowAll = clientUrl.trim() === "*";
const allowedOrigins = clientUrl
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowAll || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running",
    health: "/api/health",
    todos: "/api/todos",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    db: DB_STATES[mongoose.connection.readyState] || "unknown",
  });
});

app.use("/api/todos", todoRoutes);

// Optional: serve built frontend from Express (production)
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV})`);
});
