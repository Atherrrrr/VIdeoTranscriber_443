import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
// import VideoView from "@/components/PracticeSession/VideoView";
import { Box, Button, Typography } from "@mui/material";
import PracticeSessionsTable from "@/components/Tables/PracticeSessionsTable";
import { PlayCircle } from "@mui/icons-material";

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

export default function PracticeSession() {
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
        >
          Upload New Video
        </Button>
      </Box>
      <PracticeSessionsTable data={sessionData} />
    </>
  );
}
