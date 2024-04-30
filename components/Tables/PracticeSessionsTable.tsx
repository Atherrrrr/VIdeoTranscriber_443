// PracticeSessionsTable.tsx
import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Chip,
  useTheme,
  Avatar,
  Box,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/router";

interface SessionData {
  name: string;
  fileType: string;
  time: string;
  date: string;
  status: string;
  duration: string;
}

interface PracticeSessionsTableProps {
  data: SessionData[];
}

const PracticeSessionsTable: React.FC<PracticeSessionsTableProps> = ({ data }) => {
  // Function to render action buttons
  const theme = useTheme();
  const router = useRouter();

  const renderActions = (status: string) => (
    <>
      <Tooltip title="Edit" placement="top" arrow>
        <IconButton onClick={() => console.log("Edit")}>
          <EditOutlinedIcon sx={{ fill: "#006FEE" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="top" arrow>
        <IconButton onClick={() => console.log("Delete")}>
          <DeleteOutlinedIcon sx={{ fill: "#EE0000" }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="View" placement="top" arrow>
        <IconButton
          onClick={() => router.push(`/video`)}
          disabled={status === "Processing"} // Disable button if status is "Processing"
        >
          <VisibilityOutlinedIcon sx={{ fill: status === "Processing" ? "#ccc" : "#17C964" }} />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 830 }}>
          <Table stickyHeader aria-label="practice sessions table">
            <TableHead>
              <TableRow>
                {/* Apply a grey background to header cells */}
                <TableCell sx={{ bgcolor: theme.palette.info.main }}></TableCell>
                <TableCell sx={{ bgcolor: theme.palette.info.main }}>Name</TableCell>
                <TableCell sx={{ bgcolor: theme.palette.info.main }}>File Format</TableCell>
                <TableCell sx={{ bgcolor: theme.palette.info.main }}>Upload Time</TableCell>
                <TableCell sx={{ bgcolor: theme.palette.info.main }}>Upload Date</TableCell>
                <TableCell sx={{ bgcolor: theme.palette.info.main }}>Status</TableCell>
                <TableCell sx={{ bgcolor: theme.palette.info.main }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((session, index) => (
                <TableRow hover key={index} sx={{ "& > *": { bgcolor: theme.palette.info.light } }}>
                  {/* Apply conditional styling to table row cells */}
                  <TableCell>
                    <Box sx={{ position: "relative", width: 75, height: 75 }}>
                      <Avatar
                        variant="square"
                        src={"/thumbnail2.png"} // Ideally, you would use session.imgUrl or a relevant image URL
                        alt={session.name} // Ideally, you would use session.name
                        sx={{ width: "100%", height: "100%" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          bgcolor: "rgba(0, 0, 0, 0.5)", // Translucent black background
                          color: "white",
                          px: 0.5, // Padding on the sides
                          py: 0.25, // Padding on the top and bottom
                          fontSize: "0.75rem", // Smaller font size for the duration text
                          borderRadius: "0 4px 0 0", // Optional: Rounded top-right corner
                        }}
                      >
                        {session.duration}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{session.name}</TableCell>
                  <TableCell>{session.fileType}</TableCell>
                  <TableCell>{session.time}</TableCell>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>
                    {session.status === "Processing" ? (
                      <Chip
                        sx={{
                          backgroundColor: "#E6F1FE",
                          color: "white",
                          border: 2,
                          borderBlockColor: "#006FEE",
                        }} // Set background color and text color
                        // size="small"
                        icon={<AutorenewOutlinedIcon sx={{ fill: "#006FEE" }} />}
                        label={session.status}
                      />
                    ) : (
                      <Chip
                        sx={{
                          backgroundColor: "#F6FFED",
                          fill: "#0E793C",
                          border: 2,
                          borderBlockColor: "#0E793C",
                        }} // Set background color and text color
                        // size="small"
                        icon={<CheckCircleOutlineOutlinedIcon sx={{ fill: "#0E793C" }} />}
                        label={session.status}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">{renderActions(session.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default PracticeSessionsTable;
