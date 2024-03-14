const express = require("express");
const router = express.Router();

const validateRequest = require("../middlewares/validateRequest");
const loginSchema = require("../validators/loginValidator");

router.post("/login", validateRequest(loginSchema), async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  try {
    throw Error("Prueba error");
    res.status(200).send({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
