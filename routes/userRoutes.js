const express = require("express");
const router = express.Router();

router.get("/me", async (req, res, next) => {
  console.log("Enter /me endpoint");
  res.status(200).send({});
});

module.exports = router;
