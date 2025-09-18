const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const Lead = require("./models/Lead"); // import model

const app = express();
app.use(express.json());

// Setup Multer for file upload
const upload = multer({ dest: "uploads/" });

// POST /offer
app.post("/offer", (req, res) => {
  const offer = req.body;
  res.json({
    status: "OK",
    message: "Offer received",
    offer,
  });
});

// POST /leads/upload
app.post("/leads/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  const leads = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      leads.push(row);
    })
    .on("end", async () => {
      try {
        fs.unlinkSync(filePath); // cleanup uploaded file

        // ✅ Save leads into DB
        await Lead.bulkCreate(leads);

        res.json({
          status: "OK",
          message: "Leads uploaded & saved to DB successfully",
          total: leads.length,
          leads: leads.slice(0, 5), // preview first 5
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "ERROR", message: error.message });
      }
    });
});

// ✅ GET /leads - fetch all leads
app.get("/leads", async (req, res) => {
  try {
    const leads = await Lead.findAll();
    res.json({
      status: "OK",
      total: leads.length,
      leads,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "ERROR", message: error.message });
  }
});

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /score
app.post("/score", async (req, res) => {
  try {
    const leads = await Lead.findAll();
    const offer = {
      name: "AI Outreach Automation",
      value_props: ["24/7 outreach", "6x more meetings"],
      ideal_use_cases: ["B2B SaaS mid-market"],
    };

    const scoredLeads = leads.map(async (lead) => {
      let ruleScore = 0;

      // Rule-based scoring
      if (/head|chief|vp|director/i.test(lead.role)) ruleScore += 20;
      else if (/manager|lead/i.test(lead.role)) ruleScore += 10;

      if (/saas/i.test(lead.industry)) ruleScore += 20;
      else if (/tech|software/i.test(lead.industry)) ruleScore += 10;

      if (
        lead.name &&
        lead.role &&
        lead.company &&
        lead.industry &&
        lead.location &&
        lead.linkedin_bio
      ) {
        ruleScore += 10;
      }

      // AI scoring
      const prompt = `
      Offer: ${offer.name}
      Value Props: ${offer.value_props.join(", ")}
      Ideal Use Cases: ${offer.ideal_use_cases.join(", ")}

      Prospect:
      Name: ${lead.name}
      Role: ${lead.role}
      Company: ${lead.company}
      Industry: ${lead.industry}
      Location: ${lead.location}
      Bio: ${lead.linkedin_bio}

      Task:
      - Classify intent as High, Medium, or Low
      - Explain reasoning in 1–2 sentences
      `;

      let aiScore = 30;
      let intent = "Medium";
      let reasoning = "AI fallback reasoning.";

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        });

        const aiOutput = response.choices[0].message.content;
        if (/high/i.test(aiOutput)) aiScore = 50;
        else if (/medium/i.test(aiOutput)) aiScore = 30;
        else aiScore = 10;

        reasoning = aiOutput;
        intent =
          aiScore === 50 ? "High" : aiScore === 30 ? "Medium" : "Low";
      } catch (err) {
        console.error("AI scoring failed:", err.message);
      }

      const finalScore = ruleScore + aiScore;

      // Save to DB
      lead.score = finalScore;
      lead.intent = intent;
      lead.reasoning = reasoning;

      return lead.save();
    });

    await Promise.all(scoredLeads);

    res.json({
      status: "OK",
      message: "Scoring completed (rule + AI)",
      total: leads.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "ERROR", message: err.message });
  }
});



module.exports = app;
