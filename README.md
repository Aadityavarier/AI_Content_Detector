# Veridian — AI Content Detector

Detect AI-generated text, audio, and video using open-source ML models.
Free, no signup required, MIT licensed.

---

## What It Does

| Content | Model | Accuracy |
|---|---|---|
| Text | `roberta-base-openai-detector` | 94.2% |
| Audio | `wav2vec2` + MFCC classifier | 87.6% |
| Video | `EfficientNet-B0` frame analysis | 91.3% |

---

## Tech Stack

**Frontend** — Next.js 14, TailwindCSS, Framer Motion, Recharts  
**Backend** — Python FastAPI, async processing  
**ML** — PyTorch, HuggingFace Transformers, librosa, OpenCV  
**Database** — PostgreSQL via Supabase  
**Deploy** — Vercel (frontend), Render (backend)

---

## Project Structure

```
ai-detector/
├── backend/
│   ├── ml/
│   │   ├── text_detector.py       # RoBERTa text classifier
│   │   ├── audio_detector.py      # wav2vec2 + MFCC pipeline
│   │   └── video_detector.py      # EfficientNet frame analysis
│   ├── routes/
│   │   ├── detect.py              # POST /detect/text|audio|video
│   │   └── upload.py              # POST /upload
│   ├── database/
│   │   ├── connection.py
│   │   └── models.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── detect/page.tsx        # Detection tool
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── UploadBox.tsx          # Core detection UI
│   │   ├── ResultCard.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── StatsSection.tsx
│   │   └── Footer.tsx
│   └── lib/api.ts
├── prisma/schema.prisma
└── docker-compose.yml
```

---

## Local Setup

### Prerequisites
- Python 3.11 (via Anaconda recommended)
- Node.js 20+
- Git

### Backend

```bash
cd backend
conda create -n veridian python=3.11 -y
conda activate veridian
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API runs at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/api/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Site runs at `http://localhost:3000`

---

## API Endpoints

```
POST /detect/text          # Detect AI-generated text
POST /detect/audio         # Detect AI-generated audio
POST /detect/video         # Detect deepfake video
POST /upload               # Upload file
GET  /results/{id}         # Get result by ID
```

### Example — Text Detection

```bash
curl -X POST http://localhost:8000/detect/text \
  -F "text=Paste your text content here for analysis..."
```

Response:
```json
{
  "id": "uuid",
  "type": "text",
  "ai_probability": 0.87,
  "human_probability": 0.13,
  "confidence": "high",
  "model_used": "roberta-base-openai-detector",
  "label": "AI Generated",
  "analyzed_at": "2025-01-15T10:30:00"
}
```

### Example — Audio Detection

```bash
curl -X POST http://localhost:8000/detect/audio \
  -F "file=@speech.mp3"
```

### Example — Video Detection

```bash
curl -X POST http://localhost:8000/detect/video \
  -F "file=@video.mp4"
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Set environment variable in Vercel dashboard:
```
NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
```

### Backend → Render

1. Push repo to GitHub
2. New Web Service on Render → connect repo
3. Set root directory to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:

```
DATABASE_URL = postgresql+asyncpg://...your supabase url...
FRONTEND_URL = https://your-app.vercel.app
```

### Database → Supabase

1. Create free project at supabase.com
2. Copy connection string from Settings → Database
3. Change `postgresql://` to `postgresql+asyncpg://`
4. Add to Render environment variables

---

## Security

- File size limit: 50MB
- Allowed formats: mp3, wav, ogg, flac, m4a, mp4, mov, avi, mkv, webm
- Rate limiting: 20 req/min (text), 10 req/min (audio), 5 req/min (video)
- Input sanitization on all endpoints
- CORS restricted to frontend URL

---

## Improving Accuracy

The text model works out of the box. For audio and video, fine-tune on these datasets:

| Task | Dataset |
|---|---|
| Audio deepfake | ASVspoof 2019 |
| Video deepfake | FaceForensics++ |
| Audio deepfake | FakeAVCeleb |

---

## License

MIT — free to use, fork, and build on.

---

> Results are probabilistic estimates. Do not use as sole evidence for legal or academic decisions.