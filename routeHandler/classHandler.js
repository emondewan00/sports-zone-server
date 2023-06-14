const express = require("express");
const classSchema = require("../schemas/classSchema");
const userSchema = require("../schemas/userSchema");
const mongoose = require("mongoose");
const router = express.Router();
const veryfyJwt = require("../middleware/veryfyJwt");

//class model

const Class = new mongoose.model("Class", classSchema);
const User = new mongoose.model("User", userSchema);

//get all classes and aprove pending reject classes
router.get("/", async (req, res) => {
  const status = req.query.status || { $in: ["pending", "aprove", "reject"] };
  try {
    const classes = await Class.find({ status });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});