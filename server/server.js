const express = require("express");

const app = express();

// Define port and start server
const port = process.env.port || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
