import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Movie, Subtitles, ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";

const VideoPage = () => {
  const theme = useTheme();
  const router = useRouter(); // Hook to control routing
  const videoSrc = "https://www.youtube.com/watch?v=iGsFCnJL6ko"; // Place your video URL here
  const [language, setLanguage] = useState("English");

  const subtitles = [
    { time: "00:00:01", text: "Hello, welcome to our video!" },
    { time: "00:00:05", text: "This is a sample subtitle." },
    { time: "00:00:10", text: "Enjoy watching." },
    { time: "00:00:20", text: "Today, we'll be discussing important topics." },
    { time: "00:00:30", text: "First, let's cover the basics." },
    { time: "00:00:45", text: "The basics are essential for understanding." },
    { time: "00:01:00", text: "Now, moving on to more advanced topics." },
    { time: "00:01:15", text: "Advanced topics will require your full attention." },
    { time: "00:01:30", text: "Let's take a moment to review what we've learned." },
    { time: "00:01:45", text: "Reviewing ensures that you grasp the key concepts." },
    { time: "00:02:00", text: "Finally, we'll conclude with a summary." },
    { time: "00:02:15", text: "The summary will highlight the main points." },
    { time: "00:02:30", text: "Thank you for watching. Let's continue our journey." },
    { time: "00:02:45", text: "Remember, practice makes perfect." },
    { time: "00:03:00", text: "We hope this video has been informative." },
    { time: "00:03:15", text: "Stay tuned for more content." },
    // Add more subtitles as needed
  ];

  // Function to handle language change
  const changeLanguage = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    console.log("Language changed to:", newLanguage);
  };

  return (
    <>
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
          }}
        >
          <IconButton
            onClick={() => router.push("/dashboard")}
            sx={{
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              marginRight: "auto", // Pushes the button to the left
            }}
          >
            <ArrowBack style={{ fill: "#FFF" }} />
          </IconButton>
          <Typography variant="h3" align="center" gutterBottom sx={{ flexGrow: 1 }}>
            Developer_Intro_Session_2021_08_01
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ width: "100%", position: "relative", paddingTop: "56.25%" }}>
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                <video src={videoSrc} controls style={{ width: "100%", height: "100%" }} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="language-select-label">Subtitle Language</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                label="Subtitle Language"
                onChange={changeLanguage}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Turkish">Turkish</MenuItem>
                <MenuItem value="Arabic">Arabic</MenuItem>
                <MenuItem value="German">German</MenuItem>
                <MenuItem value="French">French</MenuItem>
              </Select>
            </FormControl>
            <Paper
              elevation={3}
              sx={{ maxHeight: 500, overflow: "auto", padding: theme.spacing(2) }}
            >
              <Typography variant="h6" gutterBottom>
                <Subtitles sx={{ mr: 1, verticalAlign: "bottom" }} />
                Subtitles
              </Typography>
              {subtitles.map((subtitle, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  gutterBottom
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <b>{subtitle.time}</b> - {subtitle.text}
                </Typography>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default VideoPage;
