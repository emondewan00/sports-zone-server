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
    const classes = await Class.find({ instructorEmail });
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
    const classes = await Class.find({ status: "aprove" })
      .sort({ totalStudent: sort })
      .limit(limit);
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

//post a new class

router.post("/", veryfyJwt, async (req, res) => {
  if (req.role !== "instructor") {
    return res.send({ message: " You can not add a class" });
  }
  try {
    const newClass = new Class({ ...req.body, instructorId: req.userId });
    const sevedClass = await newClass.save();

    await User.updateOne(
      { _id: req.userId },
      {
        $push: { myClasses: sevedClass._id },
      }
    );
    res.send({ message: "class added successfully!" });
  } catch (err) {
    res.status(500).send({ message: "server side error " });
  }
});

//edit a class

router.patch("/:id", async (req, res) => {
  const _id = req.params.id;
  const editedClass = req.body;
  try {
    const result = await Class.updateOne({ _id }, editedClass);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

//delete a class

router.delete("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedClass = await Class.deleteOne({
      _id,
    });
    res.send(deletedClass);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "server side error " });
  }
});

module.exports = router;
