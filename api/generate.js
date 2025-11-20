import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
  try {
    const prompt = req.query.prompt || "A girl in pink dress flying with Luffy";

    // Build the form exactly like Chrome DevTools showed
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", "bytes");
    form.append("user_profile_id", "null");
    form.append("anonymous_user_id", "5e5a78d0-7d91-4936-94a2-ec6f0350135a");
    form.append("request_timestamp", `${Math.floor(Date.now() / 1000)}`);
    form.append("user_is_subscribed", "false");
    form.append("client_id", "pSgX7WgjikXCBoYwDM8G8GLnRRkvAoJ1qa5eAVvj95o");

    // Send to MagicStudio upstream API
    const result = await axios.post(
      "https://ai-api.magicstudio.com/api/ai-art-generator",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Accept: "application/json, text/plain, */*",
          Origin: "https://magicstudio.com",
          Referer: "https://magicstudio.com/ai-art-generator/",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/137 Safari/537.36",
        },
        responseType: "arraybuffer",
      }
    );

    // Return image directly
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(Buffer.from(result.data));
  } catch (error) {
    console.error("AI Error:", error?.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
}
