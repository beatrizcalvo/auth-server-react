const express = require("express");

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Set up CORS and JSON middlewares
var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server configuration
const server = app.listen(port, () => console.log(`Auth Server app listening on port ${port}!`));
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

// Basic home route for the API
app.get("/", (req, res) => res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication"));
