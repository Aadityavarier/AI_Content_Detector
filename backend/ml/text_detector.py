"""
Text AI Detection Module
Uses a lightweight approach that works on low-RAM machines
"""

import asyncio
import re
import math
import logging

logger = logging.getLogger(__name__)


class TextDetector:
    """
    Lightweight heuristic-based AI text detector.
    Works on any machine without loading heavy ML models.
    Analyzes statistical patterns known to differ between AI and human text.
    """

    def __init__(self):
        logger.info("✅ Lightweight text detector initialized (no model download needed)")

    def _get_confidence(self, prob: float) -> str:
        diff = abs(prob - 0.5)
        if diff > 0.35: return "very high"
        elif diff > 0.20: return "high"
        elif diff > 0.10: return "moderate"
        else: return "uncertain"

    def _analyze(self, text: str) -> float:
        """
        Heuristic scoring based on known AI text patterns.
        Returns probability 0.0 (human) to 1.0 (AI).
        """
        score = 0.5
        words = text.split()
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]

        if not sentences or not words:
            return 0.5

        # ── 1. Sentence length uniformity ──────────────────────────
        # AI text tends to have very uniform sentence lengths
        sent_lengths = [len(s.split()) for s in sentences]
        avg_len = sum(sent_lengths) / len(sent_lengths)
        variance = sum((l - avg_len) ** 2 for l in sent_lengths) / len(sent_lengths)
        std_dev = math.sqrt(variance)
        if std_dev < 4:
            score += 0.12   # Very uniform = AI-like
        elif std_dev < 7:
            score += 0.05
        elif std_dev > 15:
            score -= 0.08   # High variation = human-like

        # ── 2. Filler/transition phrase detection ──────────────────
        # AI models overuse these phrases
        ai_phrases = [
            "in conclusion", "it is important to note", "it's worth noting",
            "furthermore", "moreover", "in addition", "as a result",
            "it is essential", "plays a crucial role", "in today's world",
            "in summary", "to summarize", "overall", "in other words",
            "needless to say", "it goes without saying", "first and foremost",
            "last but not least", "in terms of", "with regard to",
            "delve into", "dive into", "leverage", "utilize", "facilitate",
            "it should be noted", "it is worth mentioning", "as mentioned",
            "as previously stated", "as we can see", "this means that",
        ]
        text_lower = text.lower()
        phrase_count = sum(1 for p in ai_phrases if p in text_lower)
        phrase_density = phrase_count / max(len(words) / 100, 1)
        score += min(phrase_density * 0.08, 0.20)

        # ── 3. Vocabulary richness ──────────────────────────────────
        # AI text often has lower type-token ratio (repeats words more)
        unique_words = set(w.lower().strip('.,!?;:') for w in words)
        ttr = len(unique_words) / len(words)
        if ttr < 0.4:
            score += 0.08
        elif ttr > 0.7:
            score -= 0.06

        # ── 4. Punctuation patterns ─────────────────────────────────
        # AI rarely uses dashes, ellipses, or informal punctuation
        informal = text.count('--') + text.count('...') + text.count('—')
        if informal == 0 and len(words) > 100:
            score += 0.05
        elif informal > 3:
            score -= 0.05

        # ── 5. Average word length ──────────────────────────────────
        # AI tends to use slightly longer, more formal words
        avg_word_len = sum(len(w.strip('.,!?;:')) for w in words) / len(words)
        if avg_word_len > 5.5:
            score += 0.05
        elif avg_word_len < 4.0:
            score -= 0.05

        # ── 6. Question and exclamation usage ───────────────────────
        # Human text uses more questions and exclamations
        q_count = text.count('?')
        e_count = text.count('!')
        if q_count == 0 and e_count == 0 and len(sentences) > 5:
            score += 0.04
        elif (q_count + e_count) > len(sentences) * 0.3:
            score -= 0.06

        # ── 7. Paragraph structure ──────────────────────────────────
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        if len(paragraphs) > 2:
            para_lengths = [len(p.split()) for p in paragraphs]
            para_avg = sum(para_lengths) / len(para_lengths)
            para_variance = sum((l - para_avg) ** 2 for l in para_lengths) / len(para_lengths)
            if math.sqrt(para_variance) < 10:
                score += 0.06  # Very uniform paragraphs = AI

        return float(max(0.01, min(0.99, score)))

    async def detect(self, text: str) -> dict:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._run, text)

    def _run(self, text: str) -> dict:
        words = text.split()
        chunk_size = 400
        chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

        scores = [self._analyze(chunk) for chunk in chunks]
        avg_score = round(sum(scores) / len(scores), 4)

        return {
            "ai_probability": avg_score,
            "confidence": self._get_confidence(avg_score),
            "model_used": "heuristic-statistical-v1",
            "chunks_analyzed": len(chunks)
        }