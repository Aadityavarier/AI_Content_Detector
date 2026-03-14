"""
Text AI Detection Module
Uses roberta-base-openai-detector from HuggingFace
"""

import asyncio
from functools import lru_cache
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging

logger = logging.getLogger(__name__)

MODEL_NAME = "roberta-base-openai-detector"


class TextDetector:
    """
    Detects AI-generated text using RoBERTa-based OpenAI detector.
    
    Model: roberta-base-openai-detector
    Labels: LABEL_0 = Real/Human, LABEL_1 = Fake/AI
    """

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._load_model()

    def _load_model(self):
        """Load model from HuggingFace hub"""
        logger.info(f"Loading text detection model: {MODEL_NAME}")
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
            self.model.to(self.device)
            self.model.eval()
            logger.info(f"✅ Text model loaded on {self.device}")
        except Exception as e:
            logger.error(f"❌ Failed to load text model: {e}")
            raise

    def _get_confidence_label(self, probability: float) -> str:
        """Map probability to human-readable confidence level"""
        if probability >= 0.85:
            return "very high"
        elif probability >= 0.70:
            return "high"
        elif probability >= 0.55:
            return "moderate"
        elif probability >= 0.45:
            return "uncertain"
        else:
            return "low"

    def _chunk_text(self, text: str, max_tokens: int = 500) -> list[str]:
        """
        Split long texts into chunks for processing.
        RoBERTa max is 512 tokens.
        """
        words = text.split()
        chunks = []
        chunk_size = 400  # words per chunk (safe margin)
        for i in range(0, len(words), chunk_size):
            chunks.append(" ".join(words[i:i + chunk_size]))
        return chunks

    async def detect(self, text: str) -> dict:
        """
        Run AI detection on input text.
        
        Returns:
            dict with ai_probability, confidence, model_used
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._run_inference, text)

    def _run_inference(self, text: str) -> dict:
        """Synchronous inference — runs in thread pool"""
        chunks = self._chunk_text(text)
        ai_probs = []

        for chunk in chunks:
            inputs = self.tokenizer(
                chunk,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            ).to(self.device)

            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probs = torch.softmax(logits, dim=-1)

            # LABEL_1 = AI/Fake
            ai_prob = probs[0][1].item()
            ai_probs.append(ai_prob)

        # Average across chunks
        avg_ai_prob = round(sum(ai_probs) / len(ai_probs), 4)

        return {
            "ai_probability": avg_ai_prob,
            "confidence": self._get_confidence_label(
                avg_ai_prob if avg_ai_prob >= 0.5 else 1 - avg_ai_prob
            ),
            "model_used": MODEL_NAME,
            "chunks_analyzed": len(chunks)
        }
