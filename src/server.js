// src/server.js
const app = require("./app");
const sequelize = require("./db");
require("./models/Lead"); // import model so Sequelize knows it

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true }) // ✅ auto-updates schema with new columns
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
