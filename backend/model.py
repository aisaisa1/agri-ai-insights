"""
ANN Model Definition for Crop Recommendation
Architecture: 7 -> 128 -> 64 -> 22 (with ReLU + Dropout)
Exact same architecture as the training notebook.
"""

import torch
import torch.nn as nn


class ANN(nn.Module):
    """
    Artificial Neural Network for crop recommendation.
    
    Architecture:
        - Input: 7 features (N, P, K, Temperature, Humidity, pH, Rainfall)
        - Hidden 1: 128 neurons, ReLU, Dropout(0.2)
        - Hidden 2: 64 neurons, ReLU, Dropout(0.1)
        - Output: 22 classes (crop types)
    """

    def __init__(self, input_dim: int = 7, num_classes: int = 22):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(64, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


# Feature names used during training (must match input order)
FEATURE_NAMES = ["n", "p", "k", "temperature", "humidity", "ph", "rainfall"]

# Feature display names for UI
FEATURE_DISPLAY_NAMES = {
    "n": "Nitrogen (N)",
    "p": "Phosphorus (P)",
    "k": "Potassium (K)",
    "temperature": "Temperature",
    "humidity": "Humidity",
    "ph": "pH Level",
    "rainfall": "Rainfall",
}

# Feature units
FEATURE_UNITS = {
    "n": "mg/kg",
    "p": "mg/kg",
    "k": "mg/kg",
    "temperature": "°C",
    "humidity": "%",
    "ph": "",
    "rainfall": "mm",
}
