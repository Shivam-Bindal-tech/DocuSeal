const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in environment variables!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------------------------------------
// 🔍 Route: List available models
// ---------------------------------------------
router.get('/list-models', async (req, res) => {
  try {
    const response = await genAI.models.list();
    const models = response.models.map(model => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      inputTokenLimit: model.inputTokenLimit,
      outputTokenLimit: model.outputTokenLimit
    }));

    res.status(200).json({ success: true, models });
  } catch (error) {
    console.error("Error listing models:", error);
    res.status(500).json({ success: false, message: "Error listing models.", error: error.message });
  }
});

// ---------------------------------------------
// 🤖 Route: Generate AI response
// ---------------------------------------------
router.post('/', async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({
      success: false,
      message: 'GEMINI_API_KEY not configured. Add it in backend .env.local'
    });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }

  try {
    const prompt = `
You are a helpful assistant for DocuSeal, a blockchain-based document verification system.
Your answers MUST stay strictly within these topics:
- DocuSeal website
- Document verification
- Hashing
- Simulated blockchain concept
- Security, integrity, immutability

Do NOT answer anything outside these domains.

Here is system context:

"DocuSeal combats document fraud using cryptographic hashing. Admin uploads document → SHA-256 hash is generated → stored in simulated blockchain. User uploads document → hash is computed → matched with blockchain entry. Any tiny change in file produces a completely different hash. Blockchain entries are immutable."

User: ${message}
Assistant:
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ success: true, answer: text });

  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      success: false,
      message: "Error communicating with Gemini API.",
      error: error.message
    });
  }
});

module.exports = router;
