const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

router.get("/me", (req, res, next) => {
  userController.findByIdWithProfile(req.currentUserId)
    .then((user) => {
      const responseBody = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: {
          id: user.profile._id
        }
      };
      console.log(responseBody);
      res.status(200).send({});
    })
    .catch(() => {
      next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0008()])));
    });
});

module.exports = router;
