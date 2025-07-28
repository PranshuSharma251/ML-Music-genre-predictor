import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Stack,
  LinearProgress,
  IconButton,
  Drawer,
  Icon,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import { Block, Image, Scale, WidthFullSharp } from "@mui/icons-material";
import logo from "../src/logo.png";

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
      const res = await axios.post(
        "https://ml-genre-predictor-backend.onrender.com/predict",
        formData
      );
      console.log("API response:", res.data);
      setPredictions(res.data.predictions); // assuming backend sends `top_predictions: [{ genre, probability }]`
    } catch (error) {
      console.error("Upload failed:", error);
      setPredictions([{ genre: "Error", confidence: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
        flexDirection: "column",
        px: 2,
      }}
    >
      <>
        <Box
          sx={{
            width: "100%",
            height: "70px",
            backgroundColor: "#14163c",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "space-between" },
            px: 4,
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            position: "fixed",
            top: 0,
            zIndex: 999,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: { xs: "0px", md: "60px" },
            }}
          >
            <img src={logo} style={{ width: "45px" }} />
            <Typography variant="h5" color="#FFFFFF" fontWeight={600}>
              ToneScope
            </Typography>
          </Box>

          {/* Desktop Nav */}
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              px: "60px",
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            <Typography
              sx={{ color: "#D0D6F9", cursor: "pointer" }}
              onClick={() =>
                window.open(
                  "https://github.com/PranshuSharma251/ML-Music-genre-predictor"
                )
              }
            >
              Github
            </Typography>
            <Typography
              component="a"
              href="#how-it-works"
              sx={{
                color: "#D0D6F9",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              How It Works
            </Typography>
            <Typography
              sx={{ color: "#D0D6F9", cursor: "pointer" }}
              onClick={() =>
                window.open(
                  "https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification",
                  "_blank"
                )
              }
            >
              Dataset
            </Typography>

            <Button
              variant="contained"
              component="label"
              sx={{
                background: "linear-gradient(135deg, #00AEEF, #00C389)",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "999px",
                px: 3,
                py: 1,
                transition: "transform 0.3s ease, background 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #0099CC, #009966)",
                  transform: "Scale(1.05)",
                },
              }}
            >
              Upload Track
              <input
                type="file"
                accept=".wav"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Stack>

          {/* Hamburger Icon - Mobile Only */}
          <IconButton
            sx={{
              display: { xs: "block", md: "none" },
              color: "#fff",
              position: "fixed", // Make it fixed on screen
              top: "16px", // Adjust top distance (change as needed)
              right: "16px", // Stick to left side
              zIndex: 1000, // Ensure it's above other content
            }}
            onClick={handleDrawerToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 17h18M3 12h18M3 7h18"
              />
            </svg>
          </IconButton>
        </Box>

        {/* Drawer Menu - Mobile */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#14163c",
              color: "#D0D6F9",
              width: "60%",
              p: 2,
            },
          }}
        >
          <Stack spacing={3} mt={5} px={2}>
            <Typography
              onClick={() => {
                handleDrawerToggle();
                window.open(
                  "https://github.com/PranshuSharma251/ML-Music-genre-predictor"
                );
              }}
              sx={{ cursor: "pointer" }}
            >
              Github
            </Typography>
            <Typography
              component="a"
              href="#how-it-works"
              onClick={handleDrawerToggle}
              sx={{ textDecoration: "none", color: "#D0D6F9" }}
            >
              How It Works
            </Typography>
            <Typography
              onClick={() => {
                handleDrawerToggle();
                window.open(
                  "https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification",
                  "_blank"
                );
              }}
              sx={{ cursor: "pointer" }}
            >
              Dataset
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{
                background: "linear-gradient(135deg, #00AEEF, #00C389)",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "999px",
                px: 3,
                py: 1,
                mt: 2,
              }}
            >
              Upload Track
              <input
                type="file"
                accept=".wav"
                hidden
                onChange={(e) => {
                  handleFileChange(e);
                  handleDrawerToggle();
                }}
              />
            </Button>
          </Stack>
        </Drawer>
      </>

      <Container maxWidth="sm">
        <Card
          elevation={10}
          sx={{
            p: 4,
            mt: 15,
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
              Upload an audio file (.wav) and discover the genre
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: "#00AEEF",
                  color: "#00AEEF",
                  fontWeight: 600,
                  width: "60%",
                  mb: 2,
                  "&:hover": {
                    borderColor: "#0099CC",
                    backgroundColor: "rgba(0, 174, 239, 0.1)",
                  },
                }}
              >
                Choose Audio File
                <input
                  type="file"
                  accept=".wav"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
            {selectedFile && (
              <Typography variant="body2" sx={{ color: "#aaa", mt: 1 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
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
                  sx={{ color: "#90caf9", fontWeight: 600, mb: 5 }}
                >
                  Top Predictions:
                </Typography>
                {predictions.map((pred, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {/* Genre label on the left */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#fff",
                        minWidth: 80,
                        textTransform: "capitalize",
                      }}
                    >
                      {pred.genre}
                    </Typography>
                    <Box sx={{ flexGrow: 1, position: "relative" }}>
                      <LinearProgress
                        variant="determinate"
                        value={pred.confidence * 100}
                        sx={{
                          height: 20,
                          borderRadius: 999,
                          backgroundColor: "#333",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #00AEEF, #00C389)",
                          },
                        }}
                      />
                      {/* Percentage inside the bar */}
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {(pred.confidence * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
      <Container id="how-it-works" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#00AEEF", fontWeight: "bold" }}
        >
          How It Works
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "grid",
            gap: 4,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          }}
        >
          {[
            {
              title: "1. Upload Audio",
              desc: "Select a .wav file (max 30 seconds). This is your input for the genre prediction.",
            },
            {
              title: "2. Format Conversion",
              desc: "We convert your file to a standard 22kHz mono WAV format to maintain consistency across all inputs.",
            },
            {
              title: "3. Audio Preprocessing",
              desc: "Silence trimming, normalization, and standardization are applied to prepare your file for feature extraction.",
            },
            {
              title: "4. Feature Extraction",
              desc: "Key musical features like MFCCs, tempo, chroma, and spectral contrast are extracted using audio libraries.",
            },
            {
              title: "5. ML Genre Prediction",
              desc: "Our trained machine learning model analyzes the features and predicts the most probable genres.",
            },
            {
              title: "6. Results & Visualization",
              desc: "Top 3 predicted genres are shown instantly, each with a confidence score in a clean progress bar UI.",
            },
          ].map((step, index) => (
            <Box
              key={index}
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: "#1e1e1e",
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #0099CC, #009966)",
                  transform: "Scale(1.05)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 1, color: "#fff", fontWeight: 600 }}
              >
                {step.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>
                {step.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default App;
