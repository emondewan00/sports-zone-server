const express = require("express");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

//veryfyJwt middleware

const veryfyJwt = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "authorization faild" });
  }
  jwt.verify(token, secret, (err, decode) => {
    if (err) {
      return res.status(403).json({ error: "Failed to authenticate token" });
    }
    req.userId = decode.id;
    req.userEmail = decode.email;
    req.role = decode.role;
    next();
  });
};

module.exports = veryfyJwt;