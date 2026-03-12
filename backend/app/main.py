from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

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
    tone: str = "professional"  # professional | enthusiastic | concise

OLLAMA_URL = "http://localhost:11434/api/generate"

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
- Do NOT include placeholders like [Company Name] — infer from job description if possible
- Output ONLY the cover letter, no explanations

RESUME:
{request.resume}

JOB DESCRIPTION:
{request.job_description}

Cover Letter:"""

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(OLLAMA_URL, json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            })

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Ollama request failed")

            result = response.json()
            cover_letter = result.get("response", "").strip()

            return {
                "cover_letter": cover_letter,
                "tone": request.tone,
                "word_count": len(cover_letter.split())
            }

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI took too long. Try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))