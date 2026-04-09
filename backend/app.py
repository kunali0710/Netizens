import os
import json
import pdfplumber
import docx
from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from io import BytesIO

load_dotenv()

app = Flask(__name__)

CORS(app, origins="*")

# Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_text_from_pdf(file_bytes):
    text = ""
    try:
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("PDF extraction error:", e)
    return text.strip()


def extract_text_from_docx(file_bytes):
    try:
        doc = docx.Document(BytesIO(file_bytes))
        return "\n".join([
            para.text for para in doc.paragraphs if para.text.strip()
        ])
    except Exception as e:
        print("DOCX extraction error:", e)
        return ""


def analyze_resume(resume_text):
    prompt = f"""
    Analyze the resume text and return ONLY a valid JSON object with this structure:

    {{
      "name": "string",
      "role": "string",
      "overall_score": 0,
      "ats_score": 0,
      "readability_score": 0,
      "grade": "string",
      "skills_detected": [],
      "missing_keywords": [],
      "section_breakdown": [
        {{"label": "Experience", "score": 0}},
        {{"label": "Education", "score": 0}},
        {{"label": "Skills", "score": 0}},
        {{"label": "Formatting", "score": 0}},
        {{"label": "Summary", "score": 0}},
        {{"label": "Keywords", "score": 0}}
      ],
      "suggestions": [
        {{"type": "error", "text": "string"}}
      ]
    }}

    Resume Text:
    {resume_text}
    """

    try:
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
        )

        raw_text = completion.choices[0].message.content.strip()

        # clean markdown if present
        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        return json.loads(raw_text)

    except Exception as e:
        print("Groq error:", e)
        return {"error": "AI processing failed", "details": str(e)}


@app.route("/upload", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]
    filename = file.filename.lower()
    file_bytes = file.read()

    try:
        if filename.endswith(".pdf"):
            resume_text = extract_text_from_pdf(file_bytes)
        elif filename.endswith(".docx"):
            resume_text = extract_text_from_docx(file_bytes)
        else:
            return jsonify({"error": "Use .pdf or .docx"}), 400

        if len(resume_text) < 20:
            return jsonify({"error": "Text extraction failed"}), 400

        result = analyze_resume(resume_text)

        if "error" in result:
            return jsonify({
                "success": False,
                "error": result["error"]
            }), 500

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))