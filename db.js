const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection options
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  retryWrites: true, // Enable retryable writes
  w: 'majority', // Write concern
};

const uri = process.env.MONGODB_URI || "mongodb+srv://Muneesh:Shiro07@cluster0.jhyiz9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log("✅ MongoDB connected successfully");
  console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
});

mongoose.connection.on('error', (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on('disconnected', () => {
  console.log("⚠️ MongoDB disconnected");
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during MongoDB disconnection:", err);
    process.exit(1);
  }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(uri, options);
    console.log("🚀 MongoDB connection established");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

// Initialize connection
connectDB();

module.exports = mongoose;
