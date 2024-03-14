require("dotenv").config();
const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errorMessages = require("../constants/errorConstants");
const validateRequest = require("../middlewares/validateRequest");
const { loginSchema, registerSchema } = require("../validators/authValidator");
const userController = require("../db/controllers/userController");

router.post("/login", validateRequest(loginSchema), async (req, res, next) => {  
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    // Check if email exists
    userController.findByEmail(email)
      .then(user => {
        // Compare the password entered and the hashed password found
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {}
        res.status(200).send({});
      })
      .catch(error => {
        next(createHttpError(400, JSON.stringify([errorMessages.AUTH_API_F_0005()])));
      });
    
  } catch (error) {
    next(error);
  }
});

router.post("/register", validateRequest(registerSchema), async (req, res, next) => {
  try {
    res.status(200).send({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
