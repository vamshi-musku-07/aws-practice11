require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const todoRoutes = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.use("/api/todos", todoRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV})`);
});
