const express = require("express")
const bcrypt = require("bcrypt")
var cors = require('cors')

// Initialize Express app
const app = express()

// Set up CORS and JSON middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic home route for the API
app.get("/", (_req, res) => {
    res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication")
})
