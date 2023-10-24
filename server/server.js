const express = require("express");
const https = require("https");
const fs = require("fs");
const routes = require("./routes");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const app = express();

// Configure session for passport.js
app.use(
  session({
    secret: "$3Cr3t_K3i",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data

app.use(passport.initialize());
app.use(passport.session());

// Configure CORS to allow requests from the same origin
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Configure routes
app.use("/api", routes);

// Self-signed HTTPS certificate ( because this is just a personal project :P )
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

// Start the HTTPS server
const port = process.env.PORT || 443; // Use the default HTTPS port (443)
https.createServer(options, app).listen(port, () => {
  console.log(`Server running on port ${port} (HTTPS).`);
});
