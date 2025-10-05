const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();
require("./db"); // Connect MongoDB

const Batch = require("./models/Batch");
const Phone = require("./models/Phone");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // For fetch POST requests
// Redirect legacy admin path to clean route
app.get("/admin.html", (req, res) => res.redirect(301, "/admin"));
// Redirect legacy phones path to clean route
app.get("/phones.html", (req, res) => res.redirect(301, "/phonenum"));
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// Homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// Admin page without .html
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "public/admin.html"))
);

// Phone numbers page without .html
app.get("/phonenum", (req, res) =>
  res.sendFile(path.join(__dirname, "public/phones.html"))
);

// Submit batch number
app.post("/submit", async (req, res) => {
  const batchNo = req.body.batchno?.trim();
  const data = await Batch.findOne({ batch_no: batchNo });
  if (data) {
    res.redirect(
      `/datapage.html?fat=${data.fat}&snf=${data.snf}&water=${data.water}&protein=${data.protein}`
    );
  } else {
    res.send(`<h2>❌ Batch number not found!</h2><a href="/">Go back</a>`);
  }
});

// Submit phone number
app.post("/submit-phone", async (req, res) => {
  const phone = req.body.phoneNumber?.trim();
  if (!phone) return res.sendStatus(400);
  await Phone.create({ phoneNumber: phone });
  res.redirect("/");
});

// ✅ Admin add batch with date
app.post("/add-batch", async (req, res) => {
  const { batch_no, fat, snf, water, protein, date } = req.body;

  // Parse DD-MM-YYYY format
  let batchDate;
  if (date) {
    const [day, month, year] = date.split('-');
    batchDate = new Date(year, month - 1, day);
  } else {
    batchDate = new Date();
  }

  await Batch.create({ batch_no, fat, snf, water, protein, date: batchDate });
  res.redirect("/admin");
});

// Get all batches (for admin table)
app.get("/batches", async (req, res) => {
  const batches = await Batch.find().sort({ createdAt: -1 });
  res.json(batches);
});
// Admin add batch with date


// Update batch
app.post("/update-batch/:id", async (req, res) => {
  const { fat, snf, water, protein, date } = req.body;

  // Parse DD-MM-YYYY format
  let batchDate;
  if (date) {
    const [day, month, year] = date.split('-');
    batchDate = new Date(year, month - 1, day);
  }

  await Batch.findByIdAndUpdate(req.params.id, {
    fat, snf, water, protein, ...(batchDate && { date: batchDate })
  });

  res.json({ success: true });
});


// Delete a batch
app.post("/delete-batch/:id", async (req, res) => {
  await Batch.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Get all phones
app.get("/phones", async (req, res) => {
  const phones = await Phone.find().sort({ date: -1 });
  res.json(phones);
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`)
);
