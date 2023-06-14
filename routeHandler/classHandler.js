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

//get my classes
router.get("/myClasses/:email", async (req, res) => {
  const instructorEmail = req.params.email;
  try {
    const classes = await Class.find({instructorEmail});
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

//get populer classes

router.get("/popular", async (req, res) => {
  const sort = req.query.sort === "desc" ? -1 : 0;
  const limit = +req.query.limit || 6;
  try {
    const classes = await Class.find({})
      .sort({ totalStudent: sort })
      .limit(limit);
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});