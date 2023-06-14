const express = require("express");
const classSchema = require("../schemas/classSchema");
const userSchema = require("../schemas/userSchema");
const mongoose = require("mongoose");
const router = express.Router();
const veryfyJwt = require("../middleware/veryfyJwt");

//class model

const Class = new mongoose.model("Class", classSchema);
const User = new mongoose.model("User", userSchema);
