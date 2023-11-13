const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const db = require("./db");

const router = express.Router();

// Route: GET api/test
// Desc: Test route
// Access: Public
router.get("/test", (req, res) => res.send("Test Route!"));

// Middleware to protect secure routes
const isAuthenticated = (req, res, next) => {};

// Password validation function
const isStrongPassword = (password) => {
  // Minimum length: 15, Maximum length: 20
  // At least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{15,30}$/;
  return passwordRegex.test(password);
};

// Route: POST api/auth/register
// Desc: Register a new user
// Access: Public
router.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await db.oneOrNone(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // Check if the user entered a strong password
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Password not valid." });
    }

    // Generate a random salt
    const salt = crypto.randomBytes(16);

    // Use the KDF to derive the key pair
    const keyMaterial = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");

    // Separate the key material into the public and private key parts
    const publicKey = keyMaterial.slice(0, 32);
    const privateKey = keyMaterial.slice(32);

    // Convert to base64 for easier storage
    const saltBase64 = salt.toString("base64");
    const publicKeyBase64 = publicKey.toString("base64");
    const privateKeyBase64 = privateKey.toString("base64");

    // Salt + Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database, store the derived key as the public key
    await db.one(
      "INSERT INTO users (username, password, public_key, salt) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, hashedPassword, publicKeyBase64, saltBase64]
    );

    // Create JWT (expires in 3 days)
    // Secret is exposed here on github, of course this would never be shown in a prod environment
    token = jwt.sign({ username }, "e%RP-So%#0Qjrp$", {
      expiresIn: 259200,
    });

    // Assign cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 259200,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed." });
  }
});

// Route: POST api/auth/login
// Desc: Login as existing user
// Access: Public
router.post("/auth/login", (req, res, next) => {});

// Route: POST api/auth/logout
// Desc: Logout the current user
// Access: Secure
router.post("/auth/logout", isAuthenticated, (req, res) => {});

// Route: GET api/secure/user-info
// Desc: GET the current user
// Access: Secure

module.exports = router;
