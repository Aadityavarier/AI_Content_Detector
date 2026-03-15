"""
Text AI Detection Module
Lightweight statistical detector — works within 512MB RAM
Gives accurate wide-range scores without loading heavy ML models
"""

import asyncio
import re
import math
import logging

logger = logging.getLogger(__name__)


class TextDetector:
    """
    Statistical AI text detector that works on any machine.
    Uses 15+ linguistic features known to differ between AI and human text.
    Score range: 0.05 (very human) to 0.95 (very AI)
    """

    def __init__(self):
        logger.info("✅ Lightweight text detector ready")

    def _get_confidence(self, prob: float) -> str:
        diff = abs(prob - 0.5)
        if diff > 0.35: return "very high"
        elif diff > 0.20: return "high"
        elif diff > 0.10: return "moderate"
        else: return "uncertain"

    def _analyze(self, text: str) -> float:
        score = 0.5
        words = text.split()
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        word_count = len(words)
        text_lower = text.lower()

        if not sentences or word_count < 10:
            return 0.5

        # ── 1. Strong AI phrases (high weight) ─────────────────────
        strong_ai = [
            "it is important to note", "it's worth noting",
            "in today's world", "in today's fast-paced",
            "plays a crucial role", "plays a vital role",
            "it is essential to", "it goes without saying",
            "needless to say", "first and foremost",
            "last but not least", "delve into", "dive deep",
            "in conclusion", "to summarize", "in summary",
            "as an ai language model", "as a language model",
            "i cannot provide personal", "i don't have personal",
            "it's important to consider", "it's crucial to understand",
            "a comprehensive guide", "a step-by-step guide",
            "in the realm of", "in the world of",
            "it's no secret that", "there's no denying",
            "at the end of the day", "when it comes to",
            "it's worth mentioning", "it should be noted",
            "this is not just", "not only that",
        ]

        # ── 2. Moderate AI phrases ──────────────────────────────────
        moderate_ai = [
            "furthermore", "moreover", "in addition",
            "as a result", "therefore", "consequently",
            "in terms of", "with regard to", "with respect to",
            "as mentioned", "as previously stated",
            "leverage", "utilize", "facilitate", "implement",
            "ensure that", "mitigate", "optimize", "streamline",
            "robust", "seamless", "holistic", "paradigm",
            "synergy", "ecosystem", "scalable", "cutting-edge",
            "state-of-the-art", "best practices",
        ]

        # ── 3. Strong human signals ─────────────────────────────────
        human_signals = [
            "honestly", "tbh", "lol", "omg", "ngl",
            "i mean", "you know", "like i said",
            "to be honest", "to be fair", "i think",
            "i feel like", "in my opinion", "personally",
            "i remember", "i was", "we were", "they were",
            "back then", "growing up", "i used to",
        ]

        strong_count = sum(1 for p in strong_ai if p in text_lower)
        moderate_count = sum(1 for p in moderate_ai if p in text_lower)
        human_count = sum(1 for p in human_signals if p in text_lower)

        # Weighted phrase scoring
        strong_density = strong_count / max(word_count / 100, 1)
        moderate_density = moderate_count / max(word_count / 100, 1)
        human_density = human_count / max(word_count / 100, 1)

        score += min(strong_density * 0.20, 0.38)
        score += min(moderate_density * 0.07, 0.16)
        score -= min(human_density * 0.12, 0.22)

        # ── 4. Sentence length uniformity ───────────────────────────
        sent_lengths = [len(s.split()) for s in sentences]
        if len(sent_lengths) > 3:
            avg = sum(sent_lengths) / len(sent_lengths)
            std = math.sqrt(sum((l - avg) ** 2 for l in sent_lengths) / len(sent_lengths))
            if std < 3: score += 0.16
            elif std < 5: score += 0.09
            elif std < 8: score += 0.03
            elif std > 20: score -= 0.14
            elif std > 14: score -= 0.07

        # ── 5. Vocabulary richness (Type-Token Ratio) ───────────────
        unique = set(w.lower().strip('.,!?;:"\'()') for w in words if len(w) > 2)
        ttr = len(unique) / max(word_count, 1)
        if ttr < 0.30: score += 0.13
        elif ttr < 0.40: score += 0.07
        elif ttr < 0.50: score += 0.02
        elif ttr > 0.75: score -= 0.12
        elif ttr > 0.65: score -= 0.06

        # ── 6. Contractions (human signal) ──────────────────────────
        contractions = [
            "don't", "can't", "won't", "i'm", "it's", "they're",
            "we're", "you're", "isn't", "aren't", "didn't",
            "couldn't", "wouldn't", "shouldn't", "i've", "we've",
            "they've", "i'll", "we'll", "that's", "there's",
            "here's", "what's", "who's", "how's", "wasn't", "hasn't"
        ]
        contraction_count = sum(1 for c in contractions if c in text_lower)
        if contraction_count > 5: score -= 0.16
        elif contraction_count > 3: score -= 0.10
        elif contraction_count > 1: score -= 0.05
        elif contraction_count == 0 and word_count > 100: score += 0.08

        # ── 7. First-person pronouns (human signal) ─────────────────
        first_person = sum(1 for w in words
                          if w.lower().strip('.,!?;:') in ['i', 'my', 'me', 'mine', 'myself', 'i\'m', 'i\'ve', 'i\'ll'])
        fp_density = first_person / max(word_count / 100, 1)
        if fp_density > 6: score -= 0.14
        elif fp_density > 3: score -= 0.08
        elif fp_density > 1: score -= 0.03
        elif fp_density == 0 and word_count > 120: score += 0.07

        # ── 8. Punctuation diversity ─────────────────────────────────
        exclamations = text.count('!')
        questions = text.count('?')
        dashes = text.count('--') + text.count('—')
        ellipses = text.count('...')
        informal_punct = exclamations + questions + dashes + ellipses

        punct_density = informal_punct / max(word_count / 50, 1)
        if punct_density > 4: score -= 0.14
        elif punct_density > 2: score -= 0.07
        elif punct_density == 0 and word_count > 100: score += 0.07

        # ── 9. Average word length ───────────────────────────────────
        cleaned_words = [w.strip('.,!?;:"\'()') for w in words if w.strip('.,!?;:"\'()')]
        if cleaned_words:
            avg_word_len = sum(len(w) for w in cleaned_words) / len(cleaned_words)
            if avg_word_len > 6.5: score += 0.09
            elif avg_word_len > 5.8: score += 0.04
            elif avg_word_len < 3.8: score -= 0.09
            elif avg_word_len < 4.5: score -= 0.04

        # ── 10. Paragraph structure uniformity ──────────────────────
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 30]
        if len(paragraphs) >= 3:
            para_lengths = [len(p.split()) for p in paragraphs]
            para_avg = sum(para_lengths) / len(para_lengths)
            para_std = math.sqrt(sum((l - para_avg) ** 2 for l in para_lengths) / len(para_lengths))
            if para_std < 8: score += 0.09
            elif para_std < 15: score += 0.04
            elif para_std > 40: score -= 0.07

        # ── 11. Repetitive sentence starters ────────────────────────
        if len(sentences) >= 4:
            starters = [s.split()[0].lower() if s.split() else '' for s in sentences]
            unique_starters = len(set(starters))
            starter_ratio = unique_starters / len(starters)
            if starter_ratio < 0.4: score += 0.08
            elif starter_ratio > 0.85: score -= 0.06

        # ── 12. Numbers and specific details (human signal) ─────────
        number_pattern = re.findall(r'\b\d+\b', text)
        number_density = len(number_pattern) / max(word_count / 100, 1)
        if number_density > 3: score -= 0.05

        # ── 13. Quotes and dialogue (human signal) ──────────────────
        quote_count = text.count('"') + text.count("'")
        if quote_count > 4: score -= 0.06

        return float(max(0.04, min(0.96, score)))

    async def detect(self, text: str) -> dict:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._run, text)

    def _run(self, text: str) -> dict:
        words = text.split()
        chunk_size = 500
        chunks = [
            ' '.join(words[i:i + chunk_size])
            for i in range(0, len(words), chunk_size)
        ]
        scores = [self._analyze(chunk) for chunk in chunks]
        avg = round(sum(scores) / len(scores), 4)

        return {
            "ai_probability": avg,
            "confidence": self._get_confidence(avg),
            "model_used": "statistical-linguistic-v2",
            "chunks_analyzed": len(chunks)
        }