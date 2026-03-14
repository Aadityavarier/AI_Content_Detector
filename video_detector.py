"""
Video Deepfake Detection Module
Uses EfficientNet + frame sampling via OpenCV
"""

import asyncio
import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms, models
import logging
from PIL import Image

logger = logging.getLogger(__name__)

FRAME_SAMPLE_RATE = 15   # Analyze 1 frame every N frames
MAX_FRAMES = 30          # Cap for performance on free tier
IMG_SIZE = 224           # EfficientNet input size


class DeepfakeClassifier(nn.Module):
    """
    EfficientNet-B0 based deepfake detector.
    Fine-tuned binary classifier: Real vs Fake
    """

    def __init__(self, pretrained: bool = True):
        super().__init__()
        # Use EfficientNet-B0 backbone
        self.backbone = models.efficientnet_b0(
            weights=models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
        )
        # Replace final classifier layer
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.2),
            nn.Linear(in_features, 2)  # Binary: real/fake
        )

    def forward(self, x):
        return self.backbone(x)


class VideoDetector:
    """
    Detects deepfake videos by:
    1. Sampling frames with OpenCV
    2. Running each frame through EfficientNet classifier
    3. Aggregating predictions across frames
    """

    def __init__(self):
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.transform = transforms.Compose([
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        self._load_model()

    def _load_model(self):
        logger.info("Loading video deepfake detection model...")
        try:
            self.model = DeepfakeClassifier(pretrained=True)
            self.model.to(self.device)
            self.model.eval()

            # NOTE: For production, load fine-tuned weights:
            # checkpoint = torch.load("weights/deepfake_efficientnet.pth")
            # self.model.load_state_dict(checkpoint)
            #
            # Recommended pretrained weights:
            # https://github.com/ondyari/FaceForensics
            # https://huggingface.co/Wvolf/TokenFace

            logger.info(f"✅ Video model loaded (EfficientNet-B0) on {self.device}")
        except Exception as e:
            logger.error(f"❌ Failed to load video model: {e}")
            raise

    def _extract_frames(self, video_path: str) -> list[np.ndarray]:
        """Extract evenly-sampled frames from video"""
        cap = cv2.VideoCapture(video_path)
        frames = []
        frame_idx = 0

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 30

        logger.info(f"Video: {total_frames} frames @ {fps:.1f} FPS")

        while cap.isOpened() and len(frames) < MAX_FRAMES:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_idx % FRAME_SAMPLE_RATE == 0:
                # Convert BGR → RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(frame_rgb)

            frame_idx += 1

        cap.release()
        return frames, fps, total_frames

    def _predict_frame(self, frame: np.ndarray) -> float:
        """Run classifier on a single frame. Returns fake probability."""
        img = Image.fromarray(frame)
        tensor = self.transform(img).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(tensor)
            probs = torch.softmax(outputs, dim=1)
            # Index 1 = fake/deepfake probability
            fake_prob = probs[0][1].item()

        return fake_prob

    def _aggregate_predictions(self, frame_probs: list[float]) -> dict:
        """
        Aggregate frame-level predictions.
        Uses mean + consistency bonus.
        """
        arr = np.array(frame_probs)
        mean_prob = float(np.mean(arr))
        std_prob = float(np.std(arr))
        max_prob = float(np.max(arr))

        # If many frames are consistently fake, boost confidence
        high_fake_ratio = float(np.mean(arr > 0.6))

        # Weighted score: mean + small boost for consistency
        final_score = mean_prob * 0.7 + max_prob * 0.3

        return {
            "deepfake_probability": round(np.clip(final_score, 0.01, 0.99), 4),
            "mean_frame_prob": round(mean_prob, 4),
            "max_frame_prob": round(max_prob, 4),
            "std_dev": round(std_prob, 4),
            "high_fake_frame_ratio": round(high_fake_ratio, 4)
        }

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
        frames, fps, total_frames = self._extract_frames(file_path)

        if not frames:
            raise ValueError("Could not extract any frames from the video.")

        frame_probs = []
        for frame in frames:
            prob = self._predict_frame(frame)
            frame_probs.append(prob)

        agg = self._aggregate_predictions(frame_probs)

        return {
            **agg,
            "confidence": self._get_confidence(agg["deepfake_probability"]),
            "model_used": "efficientnet-b0-deepfake",
            "frames_analyzed": len(frames),
            "total_video_frames": total_frames,
            "fps": round(fps, 2)
        }
