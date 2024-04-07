import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
// import VideoView from "@/components/PracticeSession/VideoView";
import { Box, Button, Typography } from "@mui/material";
import PracticeSessionsTable from "@/components/Tables/PracticeSessionsTable";
import { PlayCircle } from "@mui/icons-material";

const sessionData = [
  {
    name: "John Doe",
    role: "Developer",
    date: "2021-08-01",
    avgScore: 75,
    status: "Processing",
    duration: "45 mins",
  },
  {
    name: "Jane Smith",
    role: "Product Manager",
    date: "2021-07-25",
    avgScore: 88,
    status: "Analyzed",
    duration: "30 mins",
  },
  {
    name: "William Johnson",
    role: "Designer",
    date: "2021-06-17",
    avgScore: 65,
    status: "Processing",
    duration: "1 hour",
  },
  {
    name: "Amanda Brown",
    role: "Developer",
    date: "2021-08-12",
    avgScore: 92,
    status: "Analyzed",
    duration: "2 hours",
  },
  {
    name: "Matthew Garcia",
    role: "Product Manager",
    date: "2021-05-09",
    avgScore: 78,
    status: "Analyzed",
    duration: "1.5 hours",
  },
  {
    name: "Samantha Miller",
    role: "Designer",
    date: "2021-04-22",
    avgScore: 59,
    status: "Analyzed",
    duration: "50 mins",
  },
  {
    name: "Ethan Davis",
    role: "Developer",
    date: "2021-03-15",
    avgScore: 81,
    status: "Processing",
    duration: "40 mins",
  },
  {
    name: "Sophia Rodriguez",
    role: "Product Manager",
    date: "2021-02-05",
    avgScore: 85,
    status: "Processing",
    duration: "1 hour 15 mins",
  },
  {
    name: "James Wilson",
    role: "Designer",
    date: "2021-01-30",
    avgScore: 45,
    status: "Processing",
    duration: "35 mins",
  },
  {
    name: "Olivia Martinez",
    role: "Developer",
    date: "2021-01-12",
    avgScore: 90,
    status: "Analyzed",
    duration: "55 mins",
  },
];

export default function PracticeSession() {
  return (
    <>
      <Typography variant="h2" align="center" gutterBottom>
        Practice Sets
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
          Create New Practice Set
        </Button>
      </Box>
      <PracticeSessionsTable data={sessionData} />
    </>
  );
}
