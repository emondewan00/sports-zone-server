const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userHandler = require("./routeHandler/userHandler");
const classHandler = require("./routeHandler/classHandler");
const paymentHandler = require("./routeHandler/paymentHandler");
const enrroledHandler = require("./routeHandler/enrroledHandler");
const selectedClassHandler = require("./routeHandler/selectedClassHandler");
const port = process.env.PORT || 4999;

// express app initialization
const app = express();
app.use(express.json());
app.use(cors());
//mongodb user and pass
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

// database connection with mongoose
mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.jmqwkqq.mongodb.net/summerCamp`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

//route handler


//root path
app.get("/", (req, res) => {
  res.send("hallo summer camp school");
});

app.listen(port, () => {
  console.log("summer camp school is running");
});
