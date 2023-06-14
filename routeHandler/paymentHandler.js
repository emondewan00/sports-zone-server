const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const veryfyJwt = require("../middleware/veryfyJwt");
const paymentSchema = require("../schemas/paymentSchema");
const enrroledSchema = require("../schemas/enrroledSchema");
const selectedClassSchema = require("../schemas/selectedSchema");
const userSchema = require("../schemas/userSchema");
const classSchema = require("../schemas/classSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const Payment = new mongoose.model("Payment", paymentSchema);
const Enrroled = new mongoose.model("Enrroled", enrroledSchema);
const SelectedClass = mongoose.model("SelectedClass", selectedClassSchema);
const User = new mongoose.model("User", userSchema);
const Class = new mongoose.model("Class", classSchema);

//get user payments details
router.get("/:userId", veryfyJwt, async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Payment.find({ userId })
      .populate("classId")
      .sort({ paymentTime: -1 });
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//post a payment intent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { price } = req.body;
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.send(error);
  }
});

router.post("/", veryfyJwt, async (req, res) => {
  const data = req.body;
  try {
    if (!data) {
      throw new Error("Invalid request data.");
    }

    const { selectedId, classId, userId, transactionId } = data;

    // Delete from selectedClass
    if (selectedId) {
      await SelectedClass.deleteOne({ _id: selectedId });
    }

    // Find class and update details
    if (classId) {
      await Class.updateOne(
        { _id: classId },
        {
          $inc: {
            totalStudent: 1,
            availableSeats: -1,
          },
          $push: { enrolledStudents: userId },
        }
      );
    }

    // Get class
    const cls = await Class.findOne({ _id: classId });

    // Get seller and update seller info
    await User.updateOne(
      { _id: cls.instructorId },
      {
        $inc: { totalSellMyClasses: 1 },
      }
    );

    // Update user details
    if (userId && classId) {
      await User.updateOne(
        { _id: userId },
        {
          $push: { enrolledClass: classId },
          $pull: { selectedClasses: selectedId },
        }
      );
    }

    // Create enrolled document
    if (classId && userId) {
      const newEnrolled = new Enrroled({ classId, userId });
      await newEnrolled.save();
    }

    // Create payment document
    const newPayment = new Payment({ userId, classId, transactionId });
    const result = await newPayment.save();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Payment request failed!" });
  }
});

module.exports = router;
