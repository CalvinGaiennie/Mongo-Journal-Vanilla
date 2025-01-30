const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3001;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error", err));

// Document Schema
const DocumentSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Document = mongoose.model("Document", DocumentSchema);

app.post("/documents", async (req, res) => {
  try {
    const doc = new Document(req.body);
    await doc.save();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/documents", async (req, res) => {
  try {
    const documents = await Document.find().sort({ timestamp: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/documents/:id", async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
