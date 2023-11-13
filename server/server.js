const express = require("express");
const https = require("https");
const fs = require("fs");
const routes = require("./routes");
const cors = require("cors");

const app = express();

// Configure CORS to allow requests from the same origin
app.use(cors({ origin: "https://localhost:5173", credentials: true }));

app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data

// Configure routes
app.use("/api", routes);

// Self-signed HTTPS certificate ( because this is just a personal project :P )
const options = {
  key: fs.readFileSync("./cert/localhost.key"),
  cert: fs.readFileSync("./cert/localhost.crt"),
};

// Start the HTTPS server
const port = process.env.PORT || 443; // Use the default HTTPS port (443)
https.createServer(options, app).listen(port, () => {
  console.log(`Server running on port ${port} (HTTPS).`);
});
