const pgp = require("pg-promise")();

const connectionString =
  "postgres://postgres:password@localhost:5432/database_name";
const db = pgp(connectionString);

module.exports = db;
