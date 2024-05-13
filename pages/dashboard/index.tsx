import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  circularProgressClasses,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { VideoData } from "@/components/Tables/VideosTable";
import VideosTable from "@/components/Tables/VideosTable";
import { PlayCircle } from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from "@/store/snackbar";
import { VIDEOS_PATH, VIDEO_PATH } from "@/utils/Apihelper";
import { VideoUploadModal } from "@/components/models/VideoUploadModel";
import { determineStatus, formatDate, getLanguageFullForm } from "@/utils/VideoProcessers";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/store";

export interface AwsVideo {
  user_id: string;
  languages: string;
  video_id: string;
  file_name: string;
  time_stamp: string;
  video_uploaded: boolean;
  srt_en: boolean;
  srt_fr: boolean;
  srt_tr: boolean;
  srt_ar: boolean;
  srt_de: boolean;
}

const DashboardPage: React.FC = (): JSX.Element => {
  const theme = useTheme();
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [videosList, setVideosList] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pooling, setPooling] = useState<boolean>(false);
  const [currentUser] = useAtom(currentUserAtom);
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const snackbar = useSnackbar();

  const handleOpen = (): void => setOpenModel(true);

  const handleClose = (updated: boolean): void => {
    setOpenModel(false);
    setTimeout(() => {
      fetchVideosList();
    }, 3500);
    if (updated) {
      setPooling(true);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (pooling) {
      console.log("Pooling for Processing State Update");
      intervalId = setInterval(fetchVideosList, 5000);
    }
    return () => clearInterval(intervalId); // Cleanup interval on component unmount or pooling stopped
  }, [pooling]);

  const closeSnackbar = (): void => {
    setOpenSnackBar(false);
  };

  const onDelete = async (videoId: string) => {
    try {
      const response = await axios.delete(`${VIDEO_PATH}/${videoId}`);
      console.log("Delete Response:", response);
      setOpenSnackBar(true);
      fetchVideosList();
    } catch (error) {
      console.error("Failed to delete video:", error);
      snackbar("error", "Failed to delete video. Please try again later.");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchVideosList();
    }
  }, [currentUser]);

  const fetchVideosList = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.get(VIDEOS_PATH, {
        params: { user_id: currentUser?.sub },
      });

      const processedVideos = response.data.body.map((video: AwsVideo) => {
        const { date, time } = formatDate(video.time_stamp);
        return {
          ...video,
          name: video.file_name.replace(/\.mp4$/, ""),
          fileType: video.file_name.split(".").pop(),
          time,
          date,
          status: determineStatus(video),
          languages: getLanguageFullForm(video.languages),
        };
      });

      console.log("processedVideos =", processedVideos);

      const allProcessedNew = processedVideos.every(
        (video: VideoData) => video.status === "Analyzed"
      );
      const allProcessedOld = videosList.every((video) => video.status === "Analyzed");

      let bothEqual = processedVideos.length === videosList.length;
      bothEqual = bothEqual && allProcessedNew === allProcessedOld;

      if (!bothEqual) {
        setVideosList(processedVideos);
        setPooling(!allProcessedNew);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      snackbar("error", "Failed to load videos. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography variant={matches ? "h3" : "h2"} align="center" gutterBottom sx={{ mt: 2 }}>
        Welcome {currentUser?.given_name} 👋
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
          size={matches ? "small" : "large"}
          variant="contained"
          sx={{ textTransform: "none", height: "fit-content" }}
          startIcon={<PlayCircle style={{ fill: "#fff" }} />}
          onClick={handleOpen}
        >
          Upload New Video
        </Button>
      </Box>

      <VideoUploadModal
        open={openModel}
        handleClose={handleClose}
        userId={currentUser?.sub}
      ></VideoUploadModal>

      <div>
        {isLoading && videosList.length < 1 ? (
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
