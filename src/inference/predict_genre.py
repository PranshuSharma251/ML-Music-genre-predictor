import os
import sys
import librosa
import numpy as np
import joblib

MODEL_PATH = "src/model/model.pkl"
SCALER_PATH = "src/model/scaler.pkl"
AUDIO_PATH = "data/predict/test.wav"  # <-- Put your test file here

def extract_features(file_path):
    y, sr = librosa.load(file_path, duration=30)
    features = []

    # Match your 30_sec feature order exactly:
    features.append(np.mean(librosa.feature.chroma_stft(y=y, sr=sr)))
    features.append(np.var(librosa.feature.chroma_stft(y=y, sr=sr)))

    rms = librosa.feature.rms(y=y)[0]
    features.append(np.mean(rms))
    features.append(np.var(rms))

    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    features.append(np.mean(spectral_centroid))
    features.append(np.var(spectral_centroid))

    bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)[0]
    features.append(np.mean(bandwidth))
    features.append(np.var(bandwidth))

    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
    features.append(np.mean(rolloff))
    features.append(np.var(rolloff))

    zcr = librosa.feature.zero_crossing_rate(y)[0]
    features.append(np.mean(zcr))
    features.append(np.var(zcr))

    harmony = librosa.effects.harmonic(y)
    features.append(np.mean(harmony))
    features.append(np.var(harmony))

    perceptr = librosa.feature.spectral_flatness(y=y)[0]
    features.append(np.mean(perceptr))
    features.append(np.var(perceptr))

    tempo = librosa.beat.tempo(y=y, sr=sr)[0]
    features.append(tempo)

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    for i in range(20):
        features.append(np.mean(mfcc[i]))
        features.append(np.var(mfcc[i]))

    return np.array(features).reshape(1, -1)

def main():
    if not os.path.exists(AUDIO_PATH):
        print(f"File not found: {AUDIO_PATH}")
        sys.exit(1)

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    X = extract_features(AUDIO_PATH)
    X_scaled = scaler.transform(X)

    prediction = model.predict(X_scaled)[0]
    print(f"🎵 Predicted Genre: **{prediction}**")

if __name__ == "__main__":
    main()
