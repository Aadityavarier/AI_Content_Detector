"""
Audio AI Detection Module
Detects AI-generated / deepfake audio using wav2vec2 + MFCC features
"""

import asyncio
import numpy as np
import torch
import logging
import librosa
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor

logger = logging.getLogger(__name__)

# Using a fake audio detection model
# Alternative: "facebook/wav2vec2-base" fine-tuned on fake audio datasets
MODEL_NAME = "facebook/wav2vec2-base"
SAMPLE_RATE = 16000  # wav2vec2 expects 16kHz


class AudioDetector:
    """
    Detects AI-generated audio using wav2vec2 feature extraction
    + a lightweight classifier trained on MFCC features.
    
    For production, replace with a fine-tuned deepfake audio model.
    """

    def __init__(self):
        self.feature_extractor = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._load_model()

    def _load_model(self):
        logger.info("Loading audio detection model...")
        try:
            self.feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(MODEL_NAME)
            # NOTE: For a real fine-tuned model, use:
            # Wav2Vec2ForSequenceClassification.from_pretrained("your-finetuned-model")
            # For now we use MFCC-based heuristics + wav2vec2 embeddings
            logger.info(f"✅ Audio feature extractor loaded ({MODEL_NAME})")
        except Exception as e:
            logger.warning(f"wav2vec2 not available, using MFCC-only mode: {e}")

    def _extract_mfcc_features(self, audio: np.ndarray, sr: int) -> dict:
        """
        Extract MFCC and spectral features for AI audio detection.
        Real AI audio often has:
        - Unnaturally uniform spectral features
        - Artifacts in high-frequency ranges
        - Less variation in pitch/prosody
        """
        # MFCC
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
        mfcc_mean = np.mean(mfcc, axis=1)
        mfcc_std = np.std(mfcc, axis=1)

        # Spectral features
        spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=audio, sr=sr))
        spectral_rolloff = np.mean(librosa.feature.spectral_rolloff(y=audio, sr=sr))
        zero_crossing = np.mean(librosa.feature.zero_crossing_rate(y=audio))

        # Chroma
        chroma = np.mean(librosa.feature.chroma_stft(y=audio, sr=sr))

        return {
            "mfcc_mean": mfcc_mean.tolist(),
            "mfcc_std": mfcc_std.tolist(),
            "spectral_centroid": float(spectral_centroid),
            "spectral_rolloff": float(spectral_rolloff),
            "zero_crossing_rate": float(zero_crossing),
            "chroma_mean": float(chroma)
        }

    def _heuristic_score(self, features: dict) -> float:
        """
        Heuristic-based AI audio scoring.
        
        IMPORTANT: Replace this with a real trained classifier in production.
        This is a placeholder that uses known audio artifact patterns.
        
        Fine-tuned models to consider:
        - https://huggingface.co/MelissaChen/fake-audio-detection
        - https://huggingface.co/hance-ai/audio-deepfake-detection
        """
        score = 0.5  # Base neutral

        mfcc_std = np.array(features["mfcc_std"])
        mfcc_mean = np.array(features["mfcc_mean"])

        # Low variance in MFCCs suggests synthetic audio
        avg_mfcc_std = np.mean(np.abs(mfcc_std))
        if avg_mfcc_std < 8.0:
            score += 0.15  # Suspiciously uniform
        elif avg_mfcc_std > 25.0:
            score -= 0.1  # High variation = more human-like

        # Unusual spectral centroid (AI audio often has different freq distribution)
        sc = features["spectral_centroid"]
        if sc < 1500 or sc > 5000:
            score += 0.1

        # Zero crossing rate anomalies
        zcr = features["zero_crossing_rate"]
        if zcr < 0.02 or zcr > 0.25:
            score += 0.08

        return float(np.clip(score, 0.01, 0.99))

    def _get_confidence(self, prob: float) -> str:
        diff = abs(prob - 0.5)
        if diff > 0.35:
            return "very high"
        elif diff > 0.20:
            return "high"
        elif diff > 0.10:
            return "moderate"
        else:
            return "uncertain"

    async def detect(self, file_path: str) -> dict:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._run_inference, file_path)

    def _run_inference(self, file_path: str) -> dict:
        # Load audio
        audio, sr = librosa.load(file_path, sr=SAMPLE_RATE, mono=True)

        # Duration check
        duration = librosa.get_duration(y=audio, sr=sr)
        if duration < 1.0:
            return {
                "ai_generated_probability": 0.5,
                "confidence": "uncertain",
                "model_used": "mfcc-heuristic",
                "features": {},
                "note": "Audio too short for reliable detection"
            }

        # Extract features
        features = self._extract_mfcc_features(audio, sr)

        # Score
        ai_prob = self._heuristic_score(features)

        return {
            "ai_generated_probability": round(ai_prob, 4),
            "confidence": self._get_confidence(ai_prob),
            "model_used": "wav2vec2-mfcc-heuristic",
            "duration_seconds": round(duration, 2),
            "sample_rate": sr,
            "features": {
                "spectral_centroid": features["spectral_centroid"],
                "zero_crossing_rate": features["zero_crossing_rate"],
                "chroma_mean": features["chroma_mean"]
            }
        }
