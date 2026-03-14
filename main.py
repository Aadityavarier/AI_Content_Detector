"""
AI Content Detector — FastAPI Backend
Main entry point
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn

from routes.detect import router as detect_router
from routes.upload import router as upload_router
from database.connection import init_db

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="AI Content Detector API",
    description="Detect AI-generated text, audio, and video content",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Rate limit error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app",  # Replace with your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(detect_router, prefix="/detect", tags=["Detection"])
app.include_router(upload_router, prefix="/upload", tags=["Upload"])


@app.on_event("startup")
async def startup():
    await init_db()
    print("✅ Database initialized")


@app.get("/")
async def root():
    return {
        "status": "running",
        "message": "AI Content Detector API v1.0",
        "endpoints": {
            "text": "POST /detect/text",
            "audio": "POST /detect/audio",
            "video": "POST /detect/video",
            "upload": "POST /upload",
            "results": "GET /results/{id}",
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
