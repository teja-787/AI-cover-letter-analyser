from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

PORT = int(os.environ.get("PORT", 8002))
app = FastAPI(title="AI Cover Letter Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    resume: str
    job_description: str
    tone: str = "professional"

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

TONE_INSTRUCTIONS = {
    "professional": "Write in a formal, professional tone.",
    "enthusiastic": "Write in an enthusiastic and energetic tone showing genuine excitement.",
    "concise": "Write in a concise, to-the-point tone. Keep it under 200 words."
}

@app.get("/")
def root():
    return {"status": "AI Cover Letter Generator is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate")
async def generate_cover_letter(request: GenerateRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not set")

    tone_instruction = TONE_INSTRUCTIONS.get(request.tone, TONE_INSTRUCTIONS["professional"])

    prompt = f"""You are an expert career coach and professional cover letter writer.

{tone_instruction}

Based on the resume and job description below, write a compelling, personalized cover letter.

Rules:
- Address it to "Hiring Manager"
- Start with a strong opening hook
- Match skills from resume to job requirements
- Show genuine enthusiasm for the role
- End with a confident call to action
- Do NOT include placeholders like [Company Name]
- Output ONLY the cover letter, no explanations

RESUME:
{request.resume}

JOB DESCRIPTION:
{request.job_description}

Cover Letter:"""

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama3-8b-8192",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 1024,
                    "temperature": 0.7
                }
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"Groq error: {response.text}")

            result = response.json()
            cover_letter = result["choices"][0]["message"]["content"].strip()

            return {
                "cover_letter": cover_letter,
                "tone": request.tone,
                "word_count": len(cover_letter.split())
            }

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
