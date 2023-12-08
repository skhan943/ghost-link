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
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check JWT exists and is verified
  if (token) {
    // Secret is exposed here on github, would obviously never be revealed in a production environment
    jwt.verify(token, "e%RP-So%#0Qjrp$", async (err, decodedToken) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Authorization Error." });
      }
      next();
    });
  } else {
    return res.status(403).json({ message: "Not authorized." });
  }
};

// Private key to be used on server
let privKey = "";

// Current user object
let currentUser = {};

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
    privKey = keyMaterial.slice(32);

    // Convert to base64 for easier storage
    const saltBase64 = salt.toString("base64");
    const publicKeyBase64 = publicKey.toString("base64");

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
router.post("/auth/login", async (req, res, next) => {
  const { username, password } = req.body;

  // Check if the user exists
  const existingUser = await db.oneOrNone(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (!existingUser) {
    return res.status(400).json({ message: "Username not found." });
  }

  const auth = await bcrypt.compare(password, existingUser.password);
  if (auth) {
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

    currentUser = existingUser;

    salt = atob(existingUser.salt);
    privKey = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").slice(32);

    return res.status(200).json({ message: "Signed in successfully!" });
  } else {
    return res.status(400).json({ message: "Incorrect password." });
  }
});

// Route: GET api/auth/logout
// Desc: Logout the current user
// Access: Secure
router.get("/auth/logout", isAuthenticated, (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  currentUser = {};
  privKey = "";
  return res.status(200).json({ message: "Signed out successfully!" });
});

// Route: DELETE api/delete
// Desc: Delete the current user
// Access: Secure
router.delete("/delete", isAuthenticated, async (req, res) => {
  try {
    // Get the current user's ID from the current user
    const userId = currentUser.user_id;

    // Delete the user from the database
    await db.none("DELETE FROM users WHERE user_id = $1", [userId]);

    // Logout the user
    res.cookie("jwt", "", { maxAge: 1 });
    currentUser = {};
    privKey = "";

    return res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete user." });
  }
});

// Route: POST api/chat/create
// Desc: Create a new chat given username and message text
// Access: Secure
router.post("/chat/create", isAuthenticated, async (req, res) => {
  try {
    const { username, messageText } = req.body;

    // Find the user_id for the given username
    const user = await db.oneOrNone(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create a new chat with the default chat name as the username
    const chat = await db.one(
      "INSERT INTO chat (chat_name) VALUES ($1) RETURNING chat_id",
      [username]
    );

    // Add the current user and the user associated with the given username to the UserChat table
    await db.none(
      "INSERT INTO userchat (user_id, chat_id) VALUES ($1, $2), ($3, $2)",
      [currentUser.user_id, chat.chat_id, user.user_id]
    );

    // Create a new message for the chat
    await db.none(
      "INSERT INTO messages (user_id, chat_id, text) VALUES ($1, $2, $3)",
      [currentUser.user_id, chat.chat_id, messageText]
    );

    return res.status(201).json({ message: "Chat created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create chat." });
  }
});

// Route: GET api/chat/all
// Desc: Get all the chats of a user given the user_id
// Access: Secure
router.get("/chat/all", isAuthenticated, async (req, res) => {
  try {
    // Get all chats for the current user
    const userChats = await db.any(
      "SELECT c.chat_id, c.chat_name FROM chat c INNER JOIN userchat uc ON c.chat_id = uc.chat_id WHERE uc.user_id = $1",
      [currentUser.user_id]
    );

    return res.status(200).json({ chats: userChats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to retrieve chats." });
  }
});

// Route: GET api/chat/:id
// Desc: Get all the messages of a specific chat
// Access: Secure
router.get("/chat/:id", isAuthenticated, async (req, res) => {
  try {
    const chatId = req.params.id;

    // Check if the current user is a member of the specified chat
    const isMember = await db.oneOrNone(
      "SELECT * FROM userchat WHERE user_id = $1 AND chat_id = $2",
      [currentUser.user_id, chatId]
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this chat." });
    }

    // Get all messages for the specified chat
    const messages = await db.any(
      "SELECT m.message_id, m.text, m.timestamp, u.username FROM messages m INNER JOIN users u ON m.user_id = u.user_id WHERE m.chat_id = $1 ORDER BY m.timestamp",
      [chatId]
    );

    return res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to retrieve messages." });
  }
});

// Route: DELETE api/chat/delete
// Desc: Delete a chat given chat_id
// Access: Secure
router.delete("/chat/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const chatId = req.params.id;

    // Delete the chat and related entries from UserChat and Messages tables
    await db.tx(async (t) => {
      await t.none("DELETE FROM userchat WHERE chat_id = $1", [chatId]);
      await t.none("DELETE FROM messages WHERE chat_id = $1", [chatId]);
      await t.none("DELETE FROM chat WHERE chat_id = $1", [chatId]);
    });

    return res.status(200).json({ message: "Chat deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete chat." });
  }
});

// Route: POST api/messages/create
// Desc: Create a new message given chat_id and message text
// Access: Secure
router.post("/message/create", isAuthenticated, async (req, res) => {
  try {
    const { chatId, messageText } = req.body;

    // Check if the current user is a member of the specified chat
    const isMember = await db.oneOrNone(
      "SELECT * FROM userchat WHERE user_id = $1 AND chat_id = $2",
      [currentUser.user_id, chatId]
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to send messages to this chat." });
    }

    // Create a new message
    await db.none(
      "INSERT INTO messages (user_id, chat_id, text) VALUES ($1, $2, $3)",
      [currentUser.user_id, chatId, messageText]
    );

    return res.status(201).json({ message: "Message sent successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send message." });
  }
});

module.exports = router;
