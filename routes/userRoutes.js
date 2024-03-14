const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const userController = require("../db/controllers/userController");

router.get("/me", (req, res, next) => {
  userController.findByIdWithProfile(req.currentUserId)
    .then((user) => {
      console.log(user);
      res.status(200).send({});
    })
    .catch(() => {
      next();
    });
});

module.exports = router;
