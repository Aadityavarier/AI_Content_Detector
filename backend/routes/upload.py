"""
File upload routes
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid
import os
import aiofiles
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "/tmp/ai-detector-uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("")
async def upload_file(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1].lower()
    save_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")

    content = await file.read()

    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 50MB limit.")

    async with aiofiles.open(save_path, "wb") as f:
        await f.write(content)

    return {
        "id": file_id,
        "filename": file.filename,
        "size_bytes": len(content),
        "saved_at": datetime.utcnow().isoformat()
    }


@router.get("/results/{result_id}")
async def get_result(result_id: str):
    raise HTTPException(
        status_code=404,
        detail=f"Result '{result_id}' not found."
    )
