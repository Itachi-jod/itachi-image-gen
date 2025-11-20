const axios = require("axios");

module.exports = async (req, res) => {
  try {
    // Get prompt from query or POST body
    const prompt = req.query.prompt || (req.body && req.body.prompt);
    if (!prompt) return res.status(400).send("Prompt is required");

    // Call Magic Studio API
    const response = await axios({
      method: "POST",
      url: "https://al-api.magicstudio.com/api/al-art-generator",
      data: { prompt }, // JSON payload
      responseType: "stream", // important to get image as stream
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://magicstudio.com",
        "Referer": "https://magicstudio.com/al-art-generator/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    // Forward content-type from API to client
    res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");

    // Pipe image stream directly to client
    response.data.pipe(res);

  } catch (err) {
    console.error("❌ Image generation error:", err.message || err);
    res.status(500).send("Internal server error");
  }
};
