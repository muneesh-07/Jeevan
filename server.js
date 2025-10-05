const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();
require("./db"); // Connect MongoDB

const Batch = require("./models/Batch");
const Phone = require("./models/Phone");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // For fetch POST requests
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// MongoDB connection status middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: "Database connection not ready", 
      status: mongoose.connection.readyState 
    });
  }
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMessages = {
    0: "disconnected",
    1: "connected", 
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({
    status: dbStatus === 1 ? "healthy" : "unhealthy",
    database: statusMessages[dbStatus],
    timestamp: new Date().toISOString()
  });
});

// Homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// Admin page route
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "public/admin.html"))
);

// Data page route
app.get("/datapage", (req, res) =>
  res.sendFile(path.join(__dirname, "public/datapage.html"))
);

// Submit batch number
app.post("/submit", async (req, res) => {
  try {
    const batchNo = req.body.batchno?.trim();
    if (!batchNo) {
      return res.send(`<h2>❌ Batch number is required!</h2><a href="/">Go back</a>`);
    }
    
    const data = await Batch.findOne({ batch_no: batchNo });
    if (data) {
      res.redirect(
        `/datapage?fat=${data.fat}&snf=${data.snf}&water=${data.water}&protein=${data.protein}`
      );
    } else {
      res.send(`<h2>❌ Batch number not found!</h2><a href="/">Go back</a>`);
    }
  } catch (error) {
    console.error("Error in /submit:", error);
    res.status(500).send(`<h2>❌ Server error occurred!</h2><a href="/">Go back</a>`);
  }
});

// Submit phone number
app.post("/submit-phone", async (req, res) => {
  try {
    const phone = req.body.phoneNumber?.trim();
    if (!phone) return res.status(400).json({ error: "Phone number is required" });
    
    await Phone.create({ phoneNumber: phone });
    res.redirect("/");
  } catch (error) {
    console.error("Error in /submit-phone:", error);
    res.status(500).json({ error: "Failed to save phone number" });
  }
});

// ✅ Admin add batch with date
app.post("/add-batch", async (req, res) => {
  try {
    const { batch_no, fat, snf, water, protein, date } = req.body;

    if (!batch_no) {
      return res.status(400).json({ error: "Batch number is required" });
    }

    const batchDate = date ? new Date(date) : new Date(); // convert string → Date

    await Batch.create({ batch_no, fat, snf, water, protein, date: batchDate });
    res.redirect("/admin");
  } catch (error) {
    console.error("Error in /add-batch:", error);
    res.status(500).json({ error: "Failed to create batch" });
  }
});

// Get all batches (for admin table)
app.get("/batches", async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (error) {
    console.error("Error in /batches:", error);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});

// Update batch
app.post("/update-batch/:id", async (req, res) => {
  try {
    const { fat, snf, water, protein, date } = req.body;

    const batchDate = date ? new Date(date) : undefined;

    await Batch.findByIdAndUpdate(req.params.id, {
      fat, snf, water, protein, ...(batchDate && { date: batchDate })
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error in /update-batch:", error);
    res.status(500).json({ error: "Failed to update batch" });
  }
});

// Delete a batch
app.post("/delete-batch/:id", async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error in /delete-batch:", error);
    res.status(500).json({ error: "Failed to delete batch" });
  }
});

// Get all phones
app.get("/phones", async (req, res) => {
  try {
    const phones = await Phone.find().sort({ date: -1 });
    res.json(phones);
  } catch (error) {
    console.error("Error in /phones:", error);
    res.status(500).json({ error: "Failed to fetch phones" });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`)
);
