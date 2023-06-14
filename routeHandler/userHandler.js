const express = require("express");
const userSchema = require("../schemas/userSchema");
const mongoose = require("mongoose");
const router = express.Router();
const veryfyJwt = require("../middleware/veryfyJwt");
const jwt = require("jsonwebtoken");
const User = new mongoose.model("User", userSchema);

const JWT_SECRET = process.env.JWT_SECRET;

//get all users
router.get("/", veryfyJwt, async (req, res) => {
  if (req.role !== "admin") {
    return res.send({ message: "only admin can get all user" });
  }
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "server side error" });
  }
});

//get a single user
router.get("/single/:email", veryfyJwt, async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.find({ email });
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "server side error" });
  }
});

//get all instructor
router.get("/instructors", async (req, res) => {
  try {
    const user = await User.find({ role: "instructor" });
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "server side error" });
  }
});

//get popular instructor
router.get("/popularInstructor", async (req, res) => {
  const sort = req.query.sort === "desc" ? -1 : 0;
  const limit = +req.query.limit || 6;
  try {
    const users = await User.find({ role: "instructor" })
      .sort({ totalSellMyClasses: sort })
      .limit(limit);
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "server side error" });
  }
});

function jwtToken(result) {
  const access_token = jwt.sign(
    {
      id: result._id,
      email: result.email,
      role: result.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return access_token;
}
//add or login  user
router.post("/", async (req, res) => {
  const query = req.body.email;
  try {
    const existing = await User.findOne({ email: query });
    if (existing) {
      const access_token = jwtToken(existing);
      res.send({ access_token, message: "account login succefully!" });
    } else {
      const newUser = new User(req.body);
      const result = await newUser.save();
      const access_token = jwtToken(result);
      res.send({ access_token, message: "account created succefully!" });
    }
  } catch (error) {
    res.status(500).send({ message: "server error " });
  }
});

//edit user
router.patch("/:id", veryfyJwt, async (req, res) => {
  const _id = req.params.id;
  try {
    const updatedUser = await User.updateOne({ _id }, { $set: req.body });
    res.send(updatedUser);
  } catch (error) {
    res.send({ message: "faild of update user" });
  }
});

//delete a user
router.delete("/:id", veryfyJwt, (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((deleteRes) => res.send(deleteRes))
    .catch((err) => res.send("failed to delete"));
});

module.exports = router;
