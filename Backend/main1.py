import os
import json
from typing import Any, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import logging

app = FastAPI()
logger = logging.getLogger("uvicorn.error")

# Load your OpenRouter API key
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    raise RuntimeError("Set OPENROUTER_API_KEY in .env")

# Initialize FastAPI
app = FastAPI()

# Allow CORS from your React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] in dev
    allow_methods=["*"],                      # ← allow OPTIONS, GET, etc. :contentReference[oaicite:0]{index=0}
    allow_headers=["*"],
)
# Pydantic model for request
class ExtractRequest(BaseModel):
    resume: str
    job_desc: str

# Initialize OpenAI client pointed at OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",  # OpenAI‑compatible endpoint :contentReference[oaicite:0]{index=0}
    api_key=API_KEY,
)

# Prompt template
PROMPT = """
You are an expert at parsing resumes and job descriptions.
Extract and return a JSON object with two keys: "resume" and "job_description".

For "resume", include:
  - personal_info: {{name, email, phone, location}} (if present)
  - education: list of {{degree, institution, years}}
  - experience: list of {{role, company, duration, bullets}}
  - skills: list of skill keywords

For "job_description", include:
  - title
  - company
  - requirements: list of requirement sentences
  - responsibilities: list of responsibility sentences
  - skills: list of required skill keywords

=== RESUME ===
{resume_text}

=== JOB DESCRIPTION ===
{job_desc_text}

Return only valid JSON.
"""

@app.post("/api/extract")
async def extract(req: ExtractRequest) -> Dict[str, Any]:
    logger.info("Received extract request")
    try:
        prompt = PROMPT.format(
            resume_text=req.resume.strip(),
            job_desc_text=req.job_desc.strip()
        )
        
        try:
            resp = client.chat.completions.create(
                model="deepseek/deepseek-chat-v3-0324:free",
                messages=[
                    {"role": "system", "content": "You are a JSON extraction assistant."},
                    {"role": "user",   "content": prompt}
                    ]
                )
            
            text = resp.choices[0].message.content
            return json.loads(text)
        
        except json.JSONDecodeError:
            start = text.find("{")
            end   = text.rfind("}") + 1
            try:
                return json.loads(text[start:end])
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"JSON parse error: {e}")
            
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
            
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")