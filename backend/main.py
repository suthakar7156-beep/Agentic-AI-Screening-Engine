from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocumentRequest(BaseModel):
    resume_text: str
    jd_text: str

@app.post("/api/analyze")
def analyze_fit(req: DocumentRequest):
    # Core Agentic Prompt Strategy
    system_prompt = f"""
    Act as a Senior Technical Recruiter. Evaluate the candidate's resume against the Job Description.
    Provide your output strictly in this format:
    1. Match Percentage (e.g., 85%)
    2. Missing Technical Keywords (List max 3)
    3. Final Verdict (One sentence feedback on engineering fit)
    
    Resume Context: {req.resume_text}
    Target JD: {req.jd_text}
    """
    
    try:
        # Executing local LLM inference
        response = ollama.generate(model='llama3', prompt=system_prompt)
        return {"status": "success", "analysis": response['response']}
    except Exception as e:
        return {"status": "error", "message": str(e)}
