// src/models/Lead.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Lead = sequelize.define("Lead", {
  name: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  industry: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  linkedin_bio: { type: DataTypes.TEXT },
  // New fields for scoring
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  intent: { type: DataTypes.STRING }, // High / Medium / Low
  reasoning: { type: DataTypes.TEXT },
});

module.exports = Lead;
