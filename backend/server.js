require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'] }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_api_key');

app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const filename = req.file.originalname.toLowerCase();
    const fileBytes = req.file.buffer;
    let resumeText = '';

    if (filename.endsWith('.pdf')) {
const data = await pdfParse.default ? await pdfParse.default(fileBytes) : await pdfParse(fileBytes);      resumeText = data.text;
    } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      const result = await mammoth.extractRawText({ buffer: fileBytes });
      resumeText = result.value;
    } else {
      return res.status(400).json({ success: false, error: 'Use .pdf or .docx' });
    }

    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({ success: false, error: 'Text extraction failed' });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
    Analyze the resume text and return ONLY a valid JSON object with this exact structure:

    {
      "name": "string",
      "role": "string",
      "overall_score": 0,
      "ats_score": 0,
      "readability_score": 0,
      "grade": "string",
      "skills_detected": [],
      "missing_keywords": [],
      "section_breakdown": [
        {"label": "Experience", "score": 0},
        {"label": "Education", "score": 0},
        {"label": "Skills", "score": 0},
        {"label": "Formatting", "score": 0},
        {"label": "Summary", "score": 0},
        {"label": "Keywords", "score": 0}
      ],
      "suggestions": [
        {"type": "error", "text": "string"}
      ]
    }

    Resume Text:
    ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    let rawText = responseText.trim();
    if (rawText.startsWith('\`\`\`')) {
      rawText = rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }

    let parsedData;
    try {
        parsedData = JSON.parse(rawText);
    } catch(e) {
        throw new Error("Failed to parse AI response");
    }

    return res.json({ success: true, data: parsedData });
  } catch (err) {
    console.error("Analysis Error:", err);
    return res.status(500).json({ success: false, error: err.message || 'AI processing failed' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
