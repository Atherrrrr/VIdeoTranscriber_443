import React, { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
// import VideoView from "@/components/PracticeSession/VideoView";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Input,
  InputLabel,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import PracticeSessionsTable from "@/components/Tables/PracticeSessionsTable";
import { PlayCircle } from "@mui/icons-material";
import { useRouter } from "next/router";

const sessionData = [
  {
    name: "Developer_Intro_Session_2021_08_01",
    date: "2021-08-01",
    status: "Processing",
    duration: "45 mins",
    fileType: ".mp4",
    time: "10:00 AM",
  },
  {
    name: "Product_Manager_Strategy_2021_07_25",
    date: "2021-07-25",
    status: "Analyzed",
    duration: "30 mins",
    fileType: ".mp4",
    time: "11:00 AM",
  },
  {
    name: "Designer_Workshop_2021_06_17",
    date: "2021-06-17",
    status: "Processing",
    duration: "1 hour",
    fileType: ".mp4",
    time: "12:00 PM",
  },
  {
    name: "Developer_Advanced_Tech_2021_08_12",
    date: "2021-08-12",
    status: "Analyzed",
    duration: "2 hours",
    fileType: ".mp4",
    time: "01:00 PM",
  },
  {
    name: "Product_Manager_Meeting_2021_05_09",
    date: "2021-05-09",
    status: "Analyzed",
    duration: "1.5 hours",
    fileType: ".mp4",
    time: "02:00 PM",
  },
  {
    name: "Designer_Creative_Review_2021_04_22",
    date: "2021-04-22",
    status: "Analyzed",
    duration: "50 mins",
    fileType: ".mp4",
    time: "03:00 PM",
  },
  {
    name: "Developer_Code_Review_2021_03_15",
    date: "2021-03-15",
    status: "Processing",
    duration: "40 mins",
    fileType: ".mp4",
    time: "04:00 PM",
  },
  {
    name: "Product_Manager_Launch_2021_02_05",
    date: "2021-02-05",
    status: "Processing",
    duration: "1 hour 15 mins",
    fileType: ".mp4",
    time: "05:00 PM",
  },
  {
    name: "Designer_Brainstorm_Session_2021_01_30",
    date: "2021-01-30",
    status: "Processing",
    duration: "35 mins",
    fileType: ".mp4",
    time: "06:00 PM",
  },
  {
    name: "Developer_Software_Demo_2021_01_12",
    date: "2021-01-12",
    status: "Analyzed",
    duration: "55 mins",
    fileType: ".mp4",
    time: "07:00 PM",
  },
];

export default function dashboard() {
  const [open, setOpen] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // New state for managing upload state
  const theme = useTheme(); // Access theme

  const router = useRouter();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleVideoNameChange = (event) => setVideoName(event.target.value);
  const handleFileChange = (event) => setFile(event.target.files[0]);

  useEffect(() => {
    const getHashParams = (hash) => {
      const hashParams = new URLSearchParams(hash.slice(1));
      return {
        accessToken: hashParams.get("access_token"),
      };
    };

    const fetchUserInfo = async (accessToken) => {
      try {
        const response = await fetch(
          "https://tdorohoz1e.execute-api.us-east-1.amazonaws.com/test/user/",
          {
            method: "GET",
            headers: {
              Authorization: accessToken, // Set the Authorization header with the access token
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("User Info:", data); // Process or update state with the fetched data
      } catch (error) {
        console.error("Fetching user info failed:", error.message);
      }
    };

    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const { accessToken } = getHashParams(hash);

      console.log("accessToken = ", accessToken);

      if (accessToken) {
        fetchUserInfo(accessToken); // Make the API call with the access token
      } else {
        console.error("No access token available.");
      }
    }
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500, // Increased width
    height: 300, // Increased height
    bgcolor: theme.palette.background.default,
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Adjust content spacing
  };

  const handleSubmit = () => {
    setIsUploading(true); // Simulate upload process
    // Simulate a file upload
    setTimeout(() => {
      console.log(videoName, file);
      setIsUploading(false);
      handleClose();
    }, 5000);
  };

  return (
    <>
      <Typography variant="h2" align="center" gutterBottom>
        Welcome Maher 👋
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
          marginRight: "20px",
        }}
      >
        <Button
          size="large"
          variant="contained"
          sx={{ textTransform: "none", height: "fit-content" }}
          startIcon={<PlayCircle style={{ fill: "#fff" }} />}
          onClick={handleOpen}
        >
          Upload New Video
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {isUploading ? (
            <>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ textAlign: "center", width: "100%" }}
              >
                Video Uploading
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            </>
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
                <Button variant="contained" component="label">
                  Upload File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <PracticeSessionsTable data={sessionData} />
    </>
  );
}
