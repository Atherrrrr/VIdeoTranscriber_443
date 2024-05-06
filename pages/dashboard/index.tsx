import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  circularProgressClasses,
  useTheme,
} from "@mui/material";
import type { VideoData } from "@/components/Tables/VideosTable";
import VideosTable from "@/components/Tables/VideosTable";
import { PlayCircle } from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from "@/store/snackbar";
import { VIDEOS_PATH, VIDEO_PATH } from "@/utils/Apihelper";
import { VideoUploadModal } from "@/components/models/VideoUploadModel";

const DashboardPage: React.FC = (): JSX.Element => {
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [videosList, setVideosList] = useState<VideoData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();
  const snackbar = useSnackbar();

  const userName = "yahya";

  const handleOpen = (): void => setOpenModel(true);

  const handleClose = (): void => {
    setOpenModel(false);
    setTimeout(() => {
      fetchVideosList();
    }, 2000);
  };

  const closeSnackbar = (): void => {
    setOpenSnackBar(false);
  };

  const onDelete = async (videoId: string) => {
    try {
      const response = await axios.delete(`${VIDEO_PATH}/${videoId}`);
      console.log("Delete Response:", response);
      setOpenSnackBar(true);
    } catch (error) {
      console.log("Failed to delete video:", error);
      snackbar("error", "Failed to delete video. Please try again later.");
    }
    fetchVideosList();
  };

  useEffect(() => {
    fetchVideosList();
  }, []);

  const fetchVideosList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(VIDEOS_PATH, {
        params: { user_id: userName },
      });
      console.log("Video List = ", response.data);
      setVideosList(response.data.body);
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch video URL:", error);
      snackbar("error", "Failed to fetch videos list. Please try again later.");
      setIsLoading(false);
    }
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

      <VideoUploadModal open={openModel} handleClose={handleClose}></VideoUploadModal>

      <div>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress
              sx={{
                borderRadius: "50%",
                transform: "rotate(-90deg)",
                [`& .${circularProgressClasses.circle}`]: {
                  strokeLinecap: "round",
                  stroke: theme.palette.text.primary, // Dynamic color for the progress bar
                },
              }}
            />
          </Box>
        ) : (
          videosList && <VideosTable data={videosList} onDelete={onDelete} />
        )}
      </div>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" variant="filled" sx={{ width: "100%" }}>
          Video Deleted Successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default DashboardPage;
