"""
Train and Save Model Artifacts

Run this script ONCE locally to produce the saved model files:
    - saved_models/model.pt          (ANN weights)
    - saved_models/scaler.pkl        (StandardScaler)
    - saved_models/label_encoder.pkl (LabelEncoder)
    - saved_models/background_data.npy (500 SHAP background samples)

Usage:
    cd backend
    python train_and_save.py --dataset /path/to/BackupCrop_Recommendation.csv

After running, commit the saved_models/ folder to your repo.
"""

import os
import argparse

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
import joblib
import shap
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report

from model import ANN, FEATURE_NAMES


def main(dataset_path: str):
    # =====================
    # 1) Load & prepare data
    # =====================
    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.lower()

    X = df[FEATURE_NAMES].values.astype(np.float32)
    y = df["label"].values

    le = LabelEncoder()
    y_enc = le.fit_transform(y).astype(np.int64)

    num_classes = len(le.classes_)
    input_dim = X.shape[1]
    print(f"Classes ({num_classes}): {le.classes_.tolist()}")
    print(f"Features ({input_dim}): {FEATURE_NAMES}")
    print(f"Total samples: {len(X)}")

    # Class weights (inverse frequency)
    class_counts = np.bincount(y_enc)
    class_weights = 1.0 / class_counts
    class_weights = class_weights / class_weights.sum() * len(class_weights)
    class_weights_tensor = torch.tensor(class_weights, dtype=torch.float32)

    # =====================
    # 2) Train/test split
    # =====================
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.25, random_state=537, stratify=y_enc
    )

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train_raw).astype(np.float32)
    X_test = scaler.transform(X_test_raw).astype(np.float32)

    # Internal val split
    X_tr, X_val, y_tr, y_val = train_test_split(
        X_train, y_train, test_size=0.10, random_state=537, stratify=y_train
    )

    # =====================
    # 3) Train model
    # =====================
    device = torch.device("cpu")
    model = ANN(input_dim, num_classes).to(device)
    criterion = nn.CrossEntropyLoss(weight=class_weights_tensor.to(device))
    optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode="min", factor=0.5, patience=20
    )

    X_tr_t = torch.tensor(X_tr, dtype=torch.float32).to(device)
    y_tr_t = torch.tensor(y_tr, dtype=torch.long).to(device)
    X_val_t = torch.tensor(X_val, dtype=torch.float32).to(device)
    y_val_t = torch.tensor(y_val, dtype=torch.long).to(device)

    best_val_loss = float("inf")
    patience_ctr = 0
    patience = 40
    best_state = None
    noise_std = 0.01
    epochs = 500
    batch_size = 32

    print(f"\nTraining: epochs={epochs}, batch_size={batch_size}, noise_std={noise_std}")

    for ep in range(epochs):
        model.train()
        n = X_tr_t.shape[0]
        idx = np.random.permutation(n)
        total_loss = 0.0

        for i in range(0, n, batch_size):
            j = idx[i : i + batch_size]
            xb, yb = X_tr_t[j], y_tr_t[j]

            # Gaussian noise augmentation
            if noise_std > 0:
                noise = torch.randn_like(xb) * noise_std
                xb = xb + noise

            optimizer.zero_grad()
            logits = model(xb)
            loss = criterion(logits, yb)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        # Validation
        model.eval()
        with torch.no_grad():
            val_logits = model(X_val_t)
            val_loss = criterion(val_logits, y_val_t).item()

        scheduler.step(val_loss)

        # Early stopping
        if val_loss < best_val_loss - 1e-4:
            best_val_loss = val_loss
            best_state = {k: v.cpu().clone() for k, v in model.state_dict().items()}
            patience_ctr = 0
        else:
            patience_ctr += 1
            if patience_ctr >= patience:
                print(f"Early stopping at epoch {ep + 1}")
                break

        if (ep + 1) % 50 == 0:
            print(f"  Epoch {ep+1}: val_loss={val_loss:.4f}")

    # Load best state
    if best_state is not None:
        model.load_state_dict(best_state)

    # =====================
    # 4) Evaluate
    # =====================
    model.eval()
    softmax = nn.Softmax(dim=1)
    X_test_t = torch.tensor(X_test, dtype=torch.float32).to(device)
    with torch.no_grad():
        logits = model(X_test_t)
        probs = softmax(logits).cpu().numpy()
        preds = np.argmax(probs, axis=1)

    acc = accuracy_score(y_test, preds)
    print(f"\nTest Accuracy: {acc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, preds, target_names=le.classes_))

    # =====================
    # 5) Save artifacts
    # =====================
    save_dir = os.path.join(os.path.dirname(__file__), "saved_models")
    os.makedirs(save_dir, exist_ok=True)

    # Model weights
    model_path = os.path.join(save_dir, "model.pt")
    torch.save(model.state_dict(), model_path)
    print(f"Saved model to {model_path}")

    # Scaler
    scaler_path = os.path.join(save_dir, "scaler.pkl")
    joblib.dump(scaler, scaler_path)
    print(f"Saved scaler to {scaler_path}")

    # Label encoder
    le_path = os.path.join(save_dir, "label_encoder.pkl")
    joblib.dump(le, le_path)
    print(f"Saved label encoder to {le_path}")

    # SHAP background data (500 samples from training set)
    bg_data = shap.sample(X_train, 500, random_state=42)
    bg_path = os.path.join(save_dir, "background_data.npy")
    np.save(bg_path, bg_data)
    print(f"Saved background data to {bg_path}")

    print("\n=== All artifacts saved! ===")
    print(f"Directory: {save_dir}")
    for f in os.listdir(save_dir):
        fpath = os.path.join(save_dir, f)
        size_mb = os.path.getsize(fpath) / (1024 * 1024)
        print(f"  {f}: {size_mb:.2f} MB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train and save crop recommendation model")
    parser.add_argument(
        "--dataset",
        type=str,
        required=True,
        help="Path to BackupCrop_Recommendation.csv",
    )
    args = parser.parse_args()
    main(args.dataset)
