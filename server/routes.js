const express = require("express");
const db = require("./db");
const router = express.Router();

// Route: GET api/test
// Desc: Test route
// Access: Public
router.get("/test", (req, res) => res.send("Test Route!"));

module.exports = router;
