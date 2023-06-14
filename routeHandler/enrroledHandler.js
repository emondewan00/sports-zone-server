const express = require("express");
const mongoose = require("mongoose");
const veryfyJwt = require("../middleware/veryfyJwt");
const enrroledSchema = require("../schemas/enrroledSchema");
const router = express.Router();

const Enrroled = new mongoose.model("Enrroled", enrroledSchema);

// get enrroled class

router.get("/:userId", veryfyJwt, async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Enrroled.find({ userId }).populate("classId");
    res.send(result);
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});

module.exports = router;