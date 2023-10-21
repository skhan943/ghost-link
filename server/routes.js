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
      if (user) {
        return done(null, false, { message: "Username already taken" });
      }

      // Derive key pair from password
      const salt = crypto.randomBytes(16); // Generate a random salt
      const iterations = 10000;
      const keyLength = 32;
      const derivedKey = crypto
        .pbkdf2Sync(password, salt, iterations, keyLength, "sha256")
        .toString("hex");

      // Salt + Hash password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database, store the derived key as the public key
      const newUser = await db.one(
        "INSERT INTO users (username, password, public_key) VALUES ($1, $2, $3) RETURNING *",
        [username, hashedPassword, derivedKey]
      );

      return done(null, newUser);
    } catch (error) {
      return done(error);
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

// Route: POST api/auth/register
// Desc: Register a new user
// Access: Public
router.post("/auth/register", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    return res.status(200).json({ message: "User registered successfully" });
  })(req, res, next); // Call it as middleware with (req, res, next)
});

// Route: POST api/auth/login
// Desc: Login as existing user
// Access: Public

module.exports = router;
