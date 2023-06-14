const express = require("express");
const mongoose = require("mongoose");
const selectedClassSchema = require("../schemas/selectedSchema");
const userSchema = require("../schemas/userSchema");
const veryfyJwt = require("../middleware/veryfyJwt");
const router = express.Router();

const SelectedClass = mongoose.model("SelectedClass", selectedClassSchema);
const User = new mongoose.model("User", userSchema);

//get all selected class
router.get("/:id", veryfyJwt, async (req, res) => {
  const quary = req.params.id;
  try {
    const selectedClasses = await SelectedClass.find({
      userId: quary,
    }).populate("classId");
    res.send(selectedClasses);
  } catch (error) {
    res.status(404).send(error);
  }
});

//get a single class
router.get("/single/:id",veryfyJwt, async (req, res) => {
  const quary = req.params.id;
  try {
    const selectedClasses = await SelectedClass.find({
      _id: quary,
    }).populate("classId");
    res.send(selectedClasses);
  } catch (error) {
    res.status(404).send(error);
  }
});

//add class as selected
router.post("/", veryfyJwt, async (req, res) => {
  if (req.role === "instructor" || req.role === "admin") {
    return res.send({ message: "Admin and instructor cann't select class" });
  }
  try {
    const newSelectedClass = new SelectedClass({
      ...req.body,
      userId: req.userId,
    });

    const savedSelectedClass = await newSelectedClass.save();
    await User.updateOne(
      { _id: req.userId },
      {
        $push: { selectedClasses: savedSelectedClass._id },
      }
    );
    res.send(savedSelectedClass);
  } catch (error) {
    res.send(error);
  }
});

//delete class from selected
router.delete("/:id", veryfyJwt, async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedClass = await SelectedClass.deleteOne({ _id });
    res.send(deletedClass);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
