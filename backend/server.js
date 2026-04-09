require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Groq = require('groq-sdk');

const app = express();
app.use(cors()); // Allows any frontend to connect during deployment
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const filename = req.file.originalname.toLowerCase();
    const fileBytes = req.file.buffer;
    let resumeText = '';

    if (filename.endsWith('.pdf')) {
      const data = await pdfParse.default ? await pdfParse.default(fileBytes) : await pdfParse(fileBytes); 
      resumeText = data.text;
    } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      const result = await mammoth.extractRawText({ buffer: fileBytes });
      resumeText = result.value;
    } else {
      return res.status(400).json({ success: false, error: 'Use .pdf or .docx' });
    }

    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({ success: false, error: 'Text extraction failed' });
    }

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

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. You must output only a JSON object strictly matching the user's requested structure.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const aiOutput = chatCompletion.choices[0].message.content.trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(aiOutput);
    } catch(e) {
      throw new Error("Failed to parse AI response: " + e.message + " Raw Output: " + aiOutput.substring(0, 50));
    }

    return res.json({ success: true, data: parsedData });
  } catch (err) {
    console.error("Analysis Error:", err);
    return res.status(500).json({ success: false, error: err.message || 'AI processing failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
