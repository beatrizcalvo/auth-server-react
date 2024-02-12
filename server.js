const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Initialize DB from file
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync("./database.json");
var db = low(adapter);

// Initialize Express app
const app = express()

// Set up CORS and JSON middlewares
var cors = require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic home route for the API
app.get("/", (_req, res) => {
    res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication")
})

app.post('/check-account', (req, res) => {
    const { email } = req.body
    console.log("POST /check-account || Email: " + req.body)    

    return res.status(401).json({ status: "invalid auth", message: "error" });
})
