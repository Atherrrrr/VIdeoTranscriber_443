import React from "react";
import Caurosel from "react-material-ui-carousel";
import { Box, useTheme, Button, Typography } from "@mui/material";
import { DomainImage } from "."; // Ensure correct import path
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

interface DomainImageCauroselProps {
  sources: string[];
}

export const DomainImageCaurosel: React.FC<DomainImageCauroselProps> = (props): JSX.Element => {
  const theme = useTheme();

  return (
    <Caurosel
      NavButton={({ onClick, style, next }) => (
        <Button
          onClick={onClick}
          size="small"
          variant="outlined"
          style={style}
          sx={{
            position: "absolute",
            bottom: 0,
            right: next ? 0 : undefined,
            color: "#fff", // Set color directly to the Button component
            backgroundColor: theme.palette.secondary.main, // Use theme for consistency
          }}
          startIcon={next ? <SkipNextIcon /> : <SkipPreviousIcon />}
        >
          <Typography variant="body2">{next ? "Next" : "Prev"}</Typography>
        </Button>
      )}
      sx={{ aspectRatio: "1/1" }}
      navButtonsProps={{
        style: {
          backgroundColor: "transparent", // Ensure nav buttons are correctly styled
        },
      }}
    >
      {props.sources.map((source, idx) => (
        <Box key={idx}>
          <DomainImage src={source} alt="product image" />
        </Box>
      ))}
    </Caurosel>
  );
};
