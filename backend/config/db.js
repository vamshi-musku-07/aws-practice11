const mongoose = require("mongoose");

const connectDB = async (retries = 10, delayMs = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`
      );
      if (attempt === retries) {
        console.error("Could not connect to MongoDB. Server will keep running; API calls will fail until DB is up.");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

module.exports = connectDB;
