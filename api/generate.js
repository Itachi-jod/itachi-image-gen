const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let prompt = '';

  if (req.method === 'POST') {
    prompt = req.body.prompt;
  } else if (req.method === 'GET') {
    prompt = req.query.prompt;
  }

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const apiUrl = 'https://al-api.magicstudio.com/api/al-art-generator';

    const response = await axios({
      method: 'POST',
      url: apiUrl,
      headers: { 'Content-Type': 'application/json' },
      data: { prompt },
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'image/jpeg');
    response.data.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
