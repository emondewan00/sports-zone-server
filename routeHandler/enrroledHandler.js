const express = require("express");
const mongoose = require("mongoose");
const veryfyJwt = require("../middleware/veryfyJwt");
const enrroledSchema = require("../schemas/enrroledSchema");
const router = express.Router();

const Enrroled = new mongoose.model("Enrroled", enrroledSchema);