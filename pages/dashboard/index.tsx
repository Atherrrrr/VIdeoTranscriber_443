import type { ChangeEvent } from "react";
import React, { useState, useEffect } from "react";
// import Skeleton from "@mui/material/Skeleton";
// import Stack from "@mui/material/Stack";
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
// import { useRouter } from "next/router";

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

const DashboardPage: React.FC = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [videoName, setVideoName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const theme = useTheme();

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);
  const handleVideoNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setVideoName(event.target.value);
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    // Your existing useEffect logic
  }, []);

  const handleSubmit = (): void => {
    setIsUploading(true);
    setTimeout(() => {
      console.log(videoName, file);
      setIsUploading(false);
      handleClose();
    }, 5000);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 300,
    bgcolor: theme.palette.background.default,
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
};

export default DashboardPage;
