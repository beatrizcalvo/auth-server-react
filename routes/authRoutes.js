const express = require("express");
const router = express.Router();

const validateRequest = require("../middlewares/validateRequest");

router.post("/login", validateRequest(null), async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  try {
    res.status(200).send({});
  } catch (error) {
    const responseBody = { errors: [errorMessages.AUTH_API_T_0001(error.message.replaceAll('"', "'"))] };
    console.error('POST /auth/login ## Request Body: {"email": "' + email + '" ...} || Response Status: 500 ## Response Body: ' + JSON.stringify(responseBody));
    res.status(500).send(responseBody);
  }
});

module.exports = router;
