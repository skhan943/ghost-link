const pgp = require("pg-promise")();

const connectionString = "postgres://postgres:password@localhost:5432/postgres";
const db = pgp(connectionString);

// Print connection status
db.connect()
  .then((obj) => {
    obj.done();
    console.log("Database connection successful.");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

module.exports = db;
