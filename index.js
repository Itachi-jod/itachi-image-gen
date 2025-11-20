const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// POST endpoint for image generation
app.post('/api/generate', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const apiUrl = 'https://al-api.magicstudio.com/api/al-art-generator';
    
    // Call the backend API
    const response = await axios({
      method: 'POST',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        prompt
      },
      responseType: 'stream'
    });

    // Stream the image back to the client
    res.setHeader('Content-Type', 'image/jpeg');
    response.data.pipe(res);

  } catch (err) {
    console.error('❌ Error generating image:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
