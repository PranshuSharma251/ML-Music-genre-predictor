import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  type PredictionResult = {
    genre: string;
    confidence: number;
  };

  const [predictions, setPredictions] = useState<PredictionResult[] | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setPredictions(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/predict", formData);
      console.log("API response:", res.data);
      setPredictions(res.data.predictions); // assuming backend sends `top_predictions: [{ genre, probability }]`
    } catch (error) {
      console.error("Upload failed:", error);
      setPredictions([{ genre: "Error", confidence: 0 }]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(145deg, #1e1e1e, #2c2c2c)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#f3f3f3",
                letterSpacing: "0.5px",
              }}
            >
              ML Genre Identifier
            </Typography>

            <Typography variant="subtitle1" color="gray" sx={{ mb: 3 }}>
              Upload an audio files (.wav) and discover the genre
            </Typography>

            <input
              type="file"
              accept=".mp3,.wav"
              onChange={handleFileChange}
              style={{
                margin: "20px 0",
                background: "#fff",
                padding: "10px",
                borderRadius: "6px",
              }}
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={<UploadFileIcon />}
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              sx={{
                mt: 2,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload & Predict"
              )}
            </Button>

            {Array.isArray(predictions) && predictions.length > 0 && (
              <Box mt={4}>
                <Typography
                  variant="h6"
                  sx={{ color: "#90caf9", fontWeight: 600, mb: 1 }}
                >
                  Top Predictions:
                </Typography>
                {predictions.map((pred, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{ color: "#fff" }}
                  >
                    {pred.genre}: {(pred.confidence * 100).toFixed(2)}%
                  </Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default App;
