const mongoose = require("mongoose");

const enrroledSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  enrroledTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = enrroledSchema;
