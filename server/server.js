const express = require("express");
const routes = require("./routes");

const app = express();

// Configure routes
app.use("/api", routes);

// Configure CORS to allow requests from the same origin
app.use(cors({ origin: "http://localhost:5173" }));

// Define port and start server
const port = process.env.port || 8082;
app.listen(port, () => console.log(`Server running on port ${port}.`));
