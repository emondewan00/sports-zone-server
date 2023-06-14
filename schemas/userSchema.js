const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phone: {
    type: Number,
    minlength: 11,
    maxlength: 11,
    // unique: true,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  myClasses: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Class",
    },
  ],
  enrroledClass: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Enrroled",
    },
  ],
  totalSellMyClasses: {
    type: Number,
    default: 9,
  },
  selectedClasses: [
    {
      type: mongoose.Types.ObjectId,
      ref: "SelectedClass",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = userSchema;
