"""
Detection API routes — text, audio, video
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
import uuid
import os
import aiofiles
from datetime import datetime

from ml.text_detector import TextDetector
from ml.audio_detector import AudioDetector
from ml.video_detector import VideoDetector
from database.connection import get_db
from database.models import Upload, Result

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Singletons — loaded once at startup
text_detector = TextDetector()
audio_detector = AudioDetector()
video_detector = VideoDetector()

# Allowed file types
ALLOWED_AUDIO = {".mp3", ".wav", ".ogg", ".flac", ".m4a"}
ALLOWED_VIDEO = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
MAX_FILE_SIZE_MB = 50


def validate_file_size(file: UploadFile):
    """Check file size limit"""
    # FastAPI doesn't expose size directly; checked after save
    pass


# ─────────────────────────────────────────
# TEXT DETECTION
# ─────────────────────────────────────────
@router.post("/text")
@limiter.limit("20/minute")
async def detect_text(
    request: Request,
    text: str = Form(...),
    db=Depends(get_db)
):
    """
    Detect if text is AI-generated.
    
    - **text**: The text content to analyze (min 50 chars)
    
    Returns ai_probability (0–1), confidence level, and model used.
    """
    if len(text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Text must be at least 50 characters long for accurate detection."
        )

    if len(text) > 50_000:
        raise HTTPException(
            status_code=400,
            detail="Text exceeds maximum length of 50,000 characters."
        )

    try:
        result = await text_detector.detect(text)

        # Save to DB (optional, skip if no DB)
        record_id = str(uuid.uuid4())
        # await save_result(db, record_id, "text", result)

        return {
            "id": record_id,
            "type": "text",
            "ai_probability": result["ai_probability"],
            "human_probability": round(1 - result["ai_probability"], 4),
            "confidence": result["confidence"],
            "model_used": result["model_used"],
            "label": "AI Generated" if result["ai_probability"] > 0.5 else "Human Written",
            "analyzed_at": datetime.utcnow().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")


# ─────────────────────────────────────────
# AUDIO DETECTION
# ─────────────────────────────────────────
@router.post("/audio")
@limiter.limit("10/minute")
async def detect_audio(
    request: Request,
    file: UploadFile = File(...),
    db=Depends(get_db)
):
    """
    Detect if audio is AI-generated / deepfake.
    
    Supported formats: mp3, wav, ogg, flac, m4a
    Max size: 50MB
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_AUDIO:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format '{ext}'. Allowed: {ALLOWED_AUDIO}"
        )

    # Save file temporarily
    tmp_path = f"/tmp/{uuid.uuid4()}{ext}"
    try:
        content = await file.read()

        if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=413, detail=f"File exceeds {MAX_FILE_SIZE_MB}MB limit.")

        async with aiofiles.open(tmp_path, "wb") as f:
            await f.write(content)

        result = await audio_detector.detect(tmp_path)
        record_id = str(uuid.uuid4())

        return {
            "id": record_id,
            "type": "audio",
            "ai_generated_probability": result["ai_generated_probability"],
            "human_probability": round(1 - result["ai_generated_probability"], 4),
            "confidence": result["confidence"],
            "model_used": result["model_used"],
            "label": "AI Generated" if result["ai_generated_probability"] > 0.5 else "Authentic",
            "features_extracted": result.get("features", {}),
            "analyzed_at": datetime.utcnow().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio detection failed: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


# ─────────────────────────────────────────
# VIDEO DETECTION
# ─────────────────────────────────────────
@router.post("/video")
@limiter.limit("5/minute")
async def detect_video(
    request: Request,
    file: UploadFile = File(...),
    db=Depends(get_db)
):
    """
    Detect deepfakes in video content.
    
    Supported formats: mp4, mov, avi, mkv, webm
    Max size: 50MB
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_VIDEO:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported video format '{ext}'. Allowed: {ALLOWED_VIDEO}"
        )

    tmp_path = f"/tmp/{uuid.uuid4()}{ext}"
    try:
        content = await file.read()

        if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=413, detail=f"File exceeds {MAX_FILE_SIZE_MB}MB limit.")

        async with aiofiles.open(tmp_path, "wb") as f:
            await f.write(content)

        result = await video_detector.detect(tmp_path)
        record_id = str(uuid.uuid4())

        return {
            "id": record_id,
            "type": "video",
            "deepfake_probability": result["deepfake_probability"],
            "human_probability": round(1 - result["deepfake_probability"], 4),
            "confidence": result["confidence"],
            "model_used": result["model_used"],
            "frames_analyzed": result.get("frames_analyzed", 0),
            "label": "Deepfake" if result["deepfake_probability"] > 0.5 else "Authentic",
            "analyzed_at": datetime.utcnow().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video detection failed: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
