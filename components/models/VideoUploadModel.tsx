import React, { useState, SyntheticEvent } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
  MenuItem,
  Select,
  CircularProgress,
  circularProgressClasses,
  useTheme,
} from "@mui/material";
import LANGUAGE_DICTIONARY from "@/dataClasses/LanguageDictionary"; // Assuming this import path
import axios from "axios";
import { VIDEO_PATH } from "@/utils/Apihelper";
import { useSnackbar } from "@/store/snackbar";
import { CheckCircle, CloudUpload } from "@mui/icons-material";

interface VideoUploadModalProps {
  open: boolean;
  handleClose: () => void;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ open, handleClose }) => {
  const [videoName, setVideoName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [subtitleLangs, setSubtitleLangs] = useState<string[]>(["en"]); // Initialize with English
  const snackbar = useSnackbar();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const userId = "yahya";
  const theme = useTheme();

  const handleVideoNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoName(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setVideoName(selectedFile.name.split(".").slice(0, -1).join(".")); // Optionally update the name based on file name
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLangs = event.target.value as string[];
    if (!newLangs.includes("en")) {
      // Ensure English is always selected
      newLangs.push("en");
    }
    setSubtitleLangs(newLangs);
  };

  const onClose = () => {
    // Clear form values
    setVideoName("");
    setFile(null);
    setSubtitleLangs(["en"]);
    handleClose();
  };

  const handleSubmit = async () => {
    if (!file) {
      snackbar("error", "No file selected.");
      return;
    }

    setIsUploading(true); // Begin uploading

    try {
      const response = await axios.post(VIDEO_PATH, {
        user_id: userId,
        file_name: `${videoName}.mp4`,
        languages: subtitleLangs.join(", "),
      });

      const uploadUrl = response.data.url;
      console.log("Upload URL = ", uploadUrl);

      if (uploadUrl) {
        const fileUploadResponse = await axios.put(uploadUrl, file, {
          headers: { "Content-Type": "application/octet-stream" },
        });

        if (fileUploadResponse.status === 200) {
          snackbar("success", "Video uploaded successfully.");
        } else {
          snackbar("error", "Failed to upload video. Please try again later.");
        }
      } else {
        throw new Error("No upload URL provided");
      }
    } catch (error) {
      console.error("Error during video upload:", error);
      snackbar("error", "Failed to upload video. Please try again later.");
    }

    setIsUploading(false); // End uploading
    onClose();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.default",
    boxShadow: 24,
    p: 4,
    border: 2,
    borderColor: theme.palette.primary.main,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {isUploading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress
              sx={{
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: "round",
                  stroke: theme.palette.primary.main, // Dynamic color for the progress bar
                },
              }}
            />
            <Typography sx={{ mt: 2 }}>Uploading video, please wait...</Typography>
          </Box>
        ) : (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Upload New Video
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="video-name">Video Name</InputLabel>
              <Input id="video-name" value={videoName} onChange={handleVideoNameChange} />
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={
                  file ? (
                    <CheckCircle sx={{ fill: "#FFF" }} />
                  ) : (
                    <CloudUpload sx={{ fill: "#FFF" }} />
                  )
                }
              >
                {file ? "File Selected" : "Upload File"}
                <input type="file" hidden accept="video/mp4" onChange={handleFileChange} />
              </Button>
              {file && (
                <Box sx={{ mt: 1, ml: 2 }}>
                  <Typography align="center" variant="body1">
                    {file.name} selected
                  </Typography>
                </Box>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="subtitle-language-label">Subtitle Language</InputLabel>
              <Select
                labelId="subtitle-language-label"
                id="subtitle-language-select"
                multiple
                value={subtitleLangs}
                onChange={handleLanguageChange}
                renderValue={(selected) =>
                  selected.map((lang) => LANGUAGE_DICTIONARY[lang]).join(", ")
                }
              >
                {Object.entries(LANGUAGE_DICTIONARY).map(([key, name]) => (
                  <MenuItem
                    key={key}
                    value={key}
                    style={{ fontWeight: subtitleLangs.includes(key) ? "bold" : undefined }}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button variant="contained" onClick={onClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};