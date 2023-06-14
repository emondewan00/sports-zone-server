const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  instructorEmail: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalStudent: {
    type: Number,
    default: 0,
  },
  enrroledStudents: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    default: "pending",
  },
  feedback: {
    type: String,
  },
  instructorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports = classSchema;
