const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const errorMessages = require("../constants/errorConstants");
const userController = require("../db/controllers/userController");

router.get("/me", (req, res, next) => {
  userController.findByIdPopulated(req.currentUserId)
    .then((result) => {
      const responseBody = {
        id: result._id,
        firstName: result.profile.firstName,
        lastName: result.profile.lastName,
        fullName: result.profile.firstName + " " + result.profile.lastName,
        typeDescription: result.profile.role.description,
        contactPoint: {
          electronicAddress: {
            emailAddress: result.email
          }
        },
        audit: {
          creationDate: result.createdAt,
          modificationDate: (result.updatedAt >= result.profile.updatedAt) ? result.updatedAt : result.profile.updatedAt
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
