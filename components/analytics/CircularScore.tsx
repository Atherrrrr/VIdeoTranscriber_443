import * as React from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CircularProgress, { circularProgressClasses } from "@mui/material/CircularProgress";
import { Box, IconButton, styled, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

interface CircularScoreProps {
  label: string;
  toolTipInfo: string;
  progressScore: number;
}

const CircularScore: React.FC<CircularScoreProps> = ({ label, toolTipInfo, progressScore }) => {
  const theme = useTheme();

  // Function to determine the color based on the progressScore
  const getColorForProgressScore = (score: number): string => {
    if (score >= 80) return "#17C964";
    if (score >= 60) return "#C5E866";
    if (score >= 40) return "#F5A524";
    return "#F31260";
  };

  const Root = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }));

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

  const ProgressLabel = styled(Typography)(({ theme }) => ({
    position: "absolute",
    zIndex: 1,
    color: getColorForProgressScore(progressScore), // Dynamic color for the text
  }));

  return (
    <Root>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="body1" align="center">
          {label}
        </Typography>
        <Tooltip title={toolTipInfo} placement="top" arrow>
          <IconButton>
            <InfoOutlinedIcon sx={{ fill: theme.palette.text.secondary }} />
          </IconButton>
        </Tooltip>
      </Box>
      <ProgressContainer>
        <ProgressLabel variant="h5">{`${progressScore}%`}</ProgressLabel>
        <CircularProgress
          variant="determinate"
          value={100} // This creates a full circle
          size={100}
          thickness={4}
          sx={{
            position: "absolute",
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
              stroke: theme.palette.text.disabled,
            },
          }}
        />
        <CircularProgress
          variant="determinate"
          value={progressScore} // Assuming semi-circle effect is needed, multiply by 2
          size={100}
          thickness={4}
          sx={{
            borderRadius: "50%",
            transform: "rotate(-90deg)",
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
              stroke: getColorForProgressScore(progressScore), // Dynamic color for the progress bar
            },
          }}
        />
      </ProgressContainer>
    </Root>
  );
};

export default CircularScore;
