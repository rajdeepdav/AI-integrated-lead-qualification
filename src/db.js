// db.js
const { Sequelize } = require("sequelize");

// Change these values if needed
const sequelize = new Sequelize("leadsdb", "postgres", "rajdeep419", {
  host: "localhost",
  dialect: "postgres",
  port: 5432, // default Postgres port
  logging: false,
});

module.exports = sequelize;
