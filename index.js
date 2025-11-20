const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON body
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt, style, size } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Call Magic Studio API
    const response = await axios.post(
      "https://al-api.magicstudio.com/api/al-art-generator",
      {
        prompt,
        style: style || "default",
        size: size || "1024x1024"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://magicstudio.com",
          "Referer": "https://magicstudio.com/al-art-generator/"
        }
      }
    );

    // Return the API response directly
    res.json(response.data);

  } catch (err) {
    console.error("Error generating image:", err.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(PORT, () => {
  console.log(`AI Art Generator API running on port ${PORT}`);
});
