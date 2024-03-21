const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

router.get("/me", (req, res, next) => {
  userController.findByIdComplete(req.currentUserId)
    .then((result) => {
      console.log(result);
      const responseBody = {
        id: result._id,
        firstName: result.profile.firstName,
        lastName: result.profile.lastName,
        fullName: result.profile.firstName + " " + result.profile.lastName,
        contactPoint: {
          electronicAddress: {
            emailAddress: result.email
          }
        }
      };
      console.log("GET /users/me || Response Status: 200 ## Response Body: " + JSON.stringify(responseBody));
      res.status(200).send(responseBody);
    })
    .catch(() => {
      next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0008()])));
    });
});

module.exports = router;
