const express = require("express");
const router = express.Router();

const errorMessages = require("../constants/errorConstants");
const validateRequest = require("../middlewares/validateRequest");
const loginSchema = require("../validators/loginValidator");
const userController = require("../db/controllers/userController");

router.post("/login", validateRequest(loginSchema), async (req, res, next) => {  
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    userController.findByEmail(email)
      .then(user => {
        res.status(200).send({});
      })
      .catch(error => {
        
      });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
