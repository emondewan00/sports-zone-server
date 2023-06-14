const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
  transactionId: {
    type: String,
    required: true,
  },
  paymentTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = paymentSchema;
