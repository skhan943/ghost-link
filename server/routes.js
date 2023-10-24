const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("./db");

const router = express.Router();

// Route: GET api/test
// Desc: Test route
// Access: Public
router.get("/test", (req, res) => res.send("Test Route!"));

// Initialize Passport and set up LocalStrategy
passport.use(
  "local",
  new LocalStrategy(async (username, password, done) => {
    try {
      // Check if user exists in DB
      const user = await db.oneOrNone(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      // User not found in DB
      if (!user) {
        return done(null, false, { message: "User not found." });
      }

      // Check if the passwords match
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.one("SELECT * FROM users WHERE user_id = $1", [id]);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to protect secure routes
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
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
router.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ error: loginErr.message });
      }
      return res.status(200).json({ message: "User logged in successfully" });
    });
  })(req, res, next);
});

// Route: POST api/auth/logout
// Desc: Logout the current user
// Access: Secure
router.post("/auth/logout", isAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle any errors that occur during logout
      return res.status(500).json({ error: "Failed to log out" });
    }

    // Successful logout
    return res.status(200).json({ message: "User logged out successfully" });
  });
});

// Route: GET api/secure/user-info
// Desc: GET the current user
// Access: Secure

module.exports = router;
