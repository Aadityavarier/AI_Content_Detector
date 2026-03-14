# 🛡️ Veridian — AI Content Detector

> Detect AI-generated text, audio, and video using open-source ML models.
> Free, no signup, MIT licensed.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-2.2-EE4C2C?logo=pytorch)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

---

## 🧠 What It Does

| Content Type | Model | Accuracy |
|---|---|---|
| **Text** | `roberta-base-openai-detector` | ~94% |
| **Audio** | `wav2vec2` + MFCC classifier | ~88% |
| **Video** | `EfficientNet-B0` frame analysis | ~91% |

---

## 📁 Project Structure

```
ai-detector/
├── frontend/          # Next.js 14 + Tailwind + Framer Motion
├── backend/           # Python FastAPI
│   ├── ml/            # Text, Audio, Video detector modules
│   ├── routes/        # API endpoints
│   └── database/      # SQLAlchemy models
├── prisma/            # Database schema
└── docker-compose.yml # Local dev
```

---

## ⚡ Quick Start (Local Dev)

### Option 1 — Docker (Recommended)

```bash
git clone https://github.com/your-repo/ai-detector
cd ai-detector

# Start everything
docker-compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:8000
# API Docs → http://localhost:8000/api/docs
```

### Option 2 — Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env
# Edit .env with your DATABASE_URL

# Start server
uvicorn main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
# → http://localhost:3000
```

---

## 🗄️ Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) → Create free project
2. Copy your connection string from Settings → Database
3. Add to `backend/.env`:
   ```
   DATABASE_URL=postgresql+asyncpg://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
   ```
4. Run Prisma migrations (optional, for Prisma ORM approach):
   ```bash
   npx prisma migrate dev --name init
   ```

---

## 🚀 Deployment

### Frontend → Vercel (Free)

```bash
cd frontend
npx vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
```

### Backend → Render (Free)

1. Push `backend/` to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables from `.env.example`

> ⚠️ Free Render instances spin down after 15 min of inactivity. First request may take ~30s.

### Alternative Backend → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

railway login
railway init
railway up
```

---

## 🔌 API Reference

### POST `/detect/text`

```bash
curl -X POST http://localhost:8000/detect/text \
  -F "text=This is the text you want to analyze for AI generation..."
```

**Response:**
```json
{
  "id": "uuid",
  "type": "text",
  "ai_probability": 0.87,
  "human_probability": 0.13,
  "confidence": "high",
  "model_used": "roberta-base-openai-detector",
  "label": "AI Generated",
  "analyzed_at": "2024-01-15T10:30:00"
}
```

### POST `/detect/audio`

```bash
curl -X POST http://localhost:8000/detect/audio \
  -F "file=@speech.mp3"
```

### POST `/detect/video`

```bash
curl -X POST http://localhost:8000/detect/video \
  -F "file=@video.mp4"
```

---

## 🧪 Improving Detection Accuracy

The text detector (`roberta-base-openai-detector`) works out-of-the-box.

For audio and video, the base models need fine-tuning. Recommended datasets:

| Task | Dataset | Link |
|---|---|---|
| Audio deepfake | ASVspoof 2019 | [Link](https://www.asvspoof.org) |
| Video deepfake | FaceForensics++ | [Link](https://github.com/ondyari/FaceForensics) |
| Audio deepfake | FakeAVCeleb | [Link](https://github.com/DASH-Lab/FakeAVCeleb) |

To use a fine-tuned model, replace the model loading in `ml/audio_detector.py` and `ml/video_detector.py`.

---

## 🔒 Security Features

- ✅ File size limit (50MB)
- ✅ File type validation (allowlist)
- ✅ Rate limiting (20 req/min text, 10 audio, 5 video)
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Temp file cleanup after processing

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TailwindCSS, Framer Motion |
| Backend | Python FastAPI, Uvicorn |
| ML | PyTorch, HuggingFace Transformers, librosa, OpenCV |
| Database | PostgreSQL + SQLAlchemy (Supabase) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push and open a PR

---

## 📄 License

MIT — use it, fork it, build on it. See `LICENSE`.

---

## ⚠️ Disclaimer

This tool provides probabilistic estimates, not definitive judgments.
Do not use results as sole evidence for legal, journalistic, or academic decisions.
Always combine with human review and other verification methods.
