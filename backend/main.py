"""
FastAPI Backend - Smart Farming AI Crop Recommendation

Endpoints:
    POST /api/predict     - Predict crop + SHAP explanation
    GET  /api/health      - Health check
    GET  /api/model-info  - Model metadata
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from predict import load_model, predict_crop, get_model_info


# ============================================================
# Lifespan: load model on startup
# ============================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML model artifacts on startup."""
    print("Loading model artifacts...")
    load_model()
    print("Model ready!")
    yield
    print("Shutting down...")


app = FastAPI(
    title="Smart Farming AI API",
    description="Crop Recommendation with ANN + SHAP Explainability",
    version="1.0.0",
    lifespan=lifespan,
)

# ============================================================
# CORS - allow frontend to call this API
# ============================================================
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,https://*.vercel.app",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Request / Response Models
# ============================================================
class SensorInput(BaseModel):
    """Input sensor data from the smart farming dashboard."""

    n: float = Field(..., ge=0, le=200, description="Nitrogen (mg/kg)")
    p: float = Field(..., ge=0, le=200, description="Phosphorus (mg/kg)")
    k: float = Field(..., ge=0, le=300, description="Potassium (mg/kg)")
    temperature: float = Field(..., ge=0, le=60, description="Temperature (C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity (%)")
    ph: float = Field(..., ge=0, le=14, description="pH Level")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall (mm)")


class ShapValue(BaseModel):
    feature: str
    display_name: str
    value: float
    scaled_value: float
    contribution: float


class TopProbability(BaseModel):
    crop: str
    probability: float


class PredictionResponse(BaseModel):
    predicted_crop: str
    confidence: float
    top_3_probabilities: list[TopProbability]
    shap_values: list[ShapValue]
    base_value: float
    explanation_text: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


# ============================================================
# Endpoints
# ============================================================
@app.post("/api/predict", response_model=PredictionResponse)
async def api_predict(data: SensorInput):
    """
    Predict the recommended crop based on sensor input.
    Returns prediction + confidence + SHAP explanation.
    """
    try:
        result = predict_crop(data.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/api/health", response_model=HealthResponse)
async def api_health():
    """Health check endpoint."""
    info = get_model_info()
    return {
        "status": "healthy",
        "model_loaded": info.get("loaded", False),
    }


@app.get("/api/model-info")
async def api_model_info():
    """Return model metadata (classes, features, architecture)."""
    info = get_model_info()
    if not info.get("loaded"):
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    return info
