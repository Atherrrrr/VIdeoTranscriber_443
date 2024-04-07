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
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
  Chip,
  useTheme,
  CardMedia,
  CardContent,
  Card,
  Avatar,
  Box,
  styled,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { circularProgressClasses } from "@mui/material/CircularProgress";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

interface SessionData {
  name: string;
  role: string;
  date: string;
  avgScore: number;
  status: string;
  duration: string;
}

interface PracticeSessionsTableProps {
  data: SessionData[];
}

const ProgressContainer = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "50%",
    bottom: 0,
  },
}));

const PracticeSessionsTable: React.FC<PracticeSessionsTableProps> = ({ data }) => {
  // Function to render action buttons
  const theme = useTheme();

  const renderActions = () => (
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
        <IconButton onClick={() => console.log("View")}>
          <VisibilityOutlinedIcon sx={{ fill: "#17C964" }} />
        </IconButton>
      </Tooltip>
    </>
  );

  const getColorForProgressScore = (score: number): string => {
    if (score >= 80) return "#17C964";
    if (score >= 60) return "#C5E866";
    if (score >= 40) return "#F5A524";
    return "#F31260";
  };

  const ProgressLabel = styled(Typography)(({ theme, score }) => ({
    position: "absolute",
    zIndex: 1,
    color: getColorForProgressScore(score), // Dynamic color for the text
  }));

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
                <TableCell sx={{ bgcolor: theme.palette.info.main }}>Role</TableCell>
                <TableCell sx={{ bgcolor: theme.palette.info.main }}>Date</TableCell>
                <TableCell sx={{ bgcolor: theme.palette.info.main }} align="center">
                  Avg Score
                </TableCell>
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
                  <TableCell>{session.role}</TableCell>
                  <TableCell>{session.date}</TableCell>
                  <TableCell align="center">
                    <ProgressContainer>
                      {session.status !== "Processing" && (
                        <ProgressLabel
                          variant="subtitle2"
                          score={session.avgScore}
                        >{`${session.avgScore}%`}</ProgressLabel>
                      )}
                      <CircularProgress
                        variant="determinate"
                        value={100} // This creates a full circle
                        size={65}
                        thickness={4}
                        sx={{
                          position: "absolute",
                          [`& .${circularProgressClasses.circle}`]: {
                            strokeLinecap: "round",
                            stroke: theme.palette.text.disabled,
                          },
                        }}
                      />
                      {session.status !== "Processing" && (
                        <CircularProgress
                          variant="determinate"
                          value={session.avgScore} // Assuming semi-circle effect is needed, multiply by 2
                          size={65}
                          thickness={4}
                          sx={{
                            borderRadius: "50%",
                            transform: "rotate(-90deg)",
                            [`& .${circularProgressClasses.circle}`]: {
                              strokeLinecap: "round",
                              stroke: getColorForProgressScore(session.avgScore), // Dynamic color for the progress bar
                            },
                          }}
                        />
                      )}
                    </ProgressContainer>
                  </TableCell>
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
                  <TableCell align="center">{renderActions()}</TableCell>
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
