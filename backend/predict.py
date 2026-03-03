"""
Prediction + Real-time SHAP Explanation Engine

Loads pre-trained model artifacts and provides:
- Crop prediction with confidence scores
- Top-3 probability ranking
- Real-time SHAP waterfall values per prediction
- Auto-generated explanation text
"""

import os
import numpy as np
import torch
import torch.nn as nn
import joblib
import shap

from model import ANN, FEATURE_NAMES, FEATURE_DISPLAY_NAMES

# ============================================================
# Global state - loaded once at startup
# ============================================================
MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")

_model = None
_scaler = None
_label_encoder = None
_background_data = None
_explainer = None
_softmax = nn.Softmax(dim=1)
_device = torch.device("cpu")


def _predict_proba_np(x_np: np.ndarray) -> np.ndarray:
    """Wrapper: numpy input -> model -> softmax probabilities as numpy."""
    x_t = torch.tensor(x_np, dtype=torch.float32).to(_device)
    with torch.no_grad():
        logits = _model(x_t)
        return _softmax(logits).cpu().numpy()


def load_model():
    """Load all model artifacts from saved_models/ directory."""
    global _model, _scaler, _label_encoder, _background_data, _explainer

    # 1) Load ANN weights
    model_path = os.path.join(MODEL_DIR, "model.pt")
    _model = ANN(input_dim=7, num_classes=22).to(_device)
    _model.load_state_dict(torch.load(model_path, map_location=_device))
    _model.eval()
    print(f"[OK] Model loaded from {model_path}")

    # 2) Load StandardScaler
    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
    _scaler = joblib.load(scaler_path)
    print(f"[OK] Scaler loaded from {scaler_path}")

    # 3) Load LabelEncoder
    le_path = os.path.join(MODEL_DIR, "label_encoder.pkl")
    _label_encoder = joblib.load(le_path)
    print(f"[OK] LabelEncoder loaded from {le_path}")

    # 4) Load SHAP background data
    bg_path = os.path.join(MODEL_DIR, "background_data.npy")
    _background_data = np.load(bg_path)
    print(f"[OK] Background data loaded: shape={_background_data.shape}")

    # 5) Initialize SHAP KernelExplainer
    _explainer = shap.KernelExplainer(_predict_proba_np, _background_data)
    print("[OK] SHAP KernelExplainer initialized")


def predict_crop(features: dict) -> dict:
    """
    Main prediction function.
    
    Args:
        features: dict with keys {n, p, k, temperature, humidity, ph, rainfall}
    
    Returns:
        dict with:
            - predicted_crop: str
            - confidence: float (0-1)
            - top_3_probabilities: list of {crop, probability}
            - shap_values: list of {feature, display_name, value, contribution}
            - base_value: float (expected value for predicted class)
            - explanation_text: str (auto-generated insight)
    """
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    # 1) Prepare input array in correct feature order
    x_raw = np.array([[features[f] for f in FEATURE_NAMES]], dtype=np.float32)

    # 2) Scale input
    x_scaled = _scaler.transform(x_raw).astype(np.float32)

    # 3) Get prediction probabilities
    probs = _predict_proba_np(x_scaled)[0]  # shape: (22,)
    pred_idx = int(np.argmax(probs))
    pred_crop = _label_encoder.inverse_transform([pred_idx])[0]
    confidence = float(probs[pred_idx])

    # 4) Top 3 probabilities
    top3_idx = np.argsort(probs)[::-1][:3]
    top_3 = [
        {
            "crop": _label_encoder.inverse_transform([i])[0],
            "probability": float(probs[i]),
        }
        for i in top3_idx
    ]

    # 5) Real-time SHAP computation for this specific input
    shap_values_all = _explainer.shap_values(x_scaled, nsamples=200)

    # Extract SHAP values for the predicted class
    if isinstance(shap_values_all, list):
        shap_for_pred = shap_values_all[pred_idx][0]  # shape: (7,)
    else:
        shap_for_pred = shap_values_all[0, :, pred_idx]

    # Base value for the predicted class
    expected = _explainer.expected_value
    if isinstance(expected, (list, np.ndarray)):
        base_val = float(expected[pred_idx])
    else:
        base_val = float(expected)

    # 6) Build SHAP feature contribution list (sorted by absolute value)
    shap_list = []
    for i, fname in enumerate(FEATURE_NAMES):
        shap_list.append(
            {
                "feature": fname,
                "display_name": FEATURE_DISPLAY_NAMES[fname],
                "value": float(x_raw[0, i]),  # original input value
                "scaled_value": float(x_scaled[0, i]),  # scaled value
                "contribution": float(shap_for_pred[i]),
            }
        )
    # Sort by absolute contribution (descending)
    shap_list.sort(key=lambda x: abs(x["contribution"]), reverse=True)

    # 7) Auto-generate explanation text
    explanation = _generate_explanation(pred_crop, confidence, shap_list)

    return {
        "predicted_crop": pred_crop,
        "confidence": confidence,
        "top_3_probabilities": top_3,
        "shap_values": shap_list,
        "base_value": base_val,
        "explanation_text": explanation,
    }


def _generate_explanation(crop: str, confidence: float, shap_list: list) -> str:
    """Auto-generate a human-readable explanation based on SHAP values."""
    top_positive = [s for s in shap_list if s["contribution"] > 0][:3]
    top_negative = [s for s in shap_list if s["contribution"] < 0][:2]

    parts = []
    parts.append(
        f"The AI model recommends **{crop}** with {confidence*100:.1f}% confidence."
    )

    if top_positive:
        drivers = ", ".join(
            [
                f"**{s['display_name']}** ({s['value']:.1f})"
                for s in top_positive
            ]
        )
        parts.append(
            f"This recommendation is primarily driven by {drivers}."
        )

    if top_negative:
        inhibitors = ", ".join(
            [
                f"**{s['display_name']}** ({s['value']:.1f})"
                for s in top_negative
            ]
        )
        parts.append(
            f"Factors slightly reducing the probability: {inhibitors}."
        )

    return " ".join(parts)


def get_model_info() -> dict:
    """Return model metadata for the frontend."""
    if _label_encoder is None:
        return {"loaded": False}

    return {
        "loaded": True,
        "num_classes": len(_label_encoder.classes_),
        "classes": _label_encoder.classes_.tolist(),
        "features": FEATURE_NAMES,
        "feature_display_names": FEATURE_DISPLAY_NAMES,
        "architecture": "ANN (7 -> 128 -> 64 -> 22)",
        "training_method": "5-Fold Stratified CV + Gaussian Noise Augmentation + Class Weights",
    }
