const express = require("express");
const routes = require("./routes");

const app = express();

app.use("/api", routes);

// Define port and start server
const port = process.env.port || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
