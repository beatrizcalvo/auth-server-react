// Initialize database from File
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync("./database.json");
var db = low(adapter);

// Initialize Express app
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// Define a JWT secret key. This should be isolated by using env variables for security
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = "secretKey";

// Set up CORS and JSON middlewares
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server configuration
const server = app.listen(port, () => console.log(`Auth Server app listening on port ${port}!`));
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

// An endpoint to see if there's an existing account for a given email address
app.get("/check-account", (req, res) => res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication"));
