import type { Theme} from "@mui/material";
import { createTheme } from "@mui/material";
import { red, grey } from "@mui/material/colors";

const commonTypography = {
  button: {
    textTransform: "none" as const,
  },
  fontFamily: [
    "Inter",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "Noto Sans",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji",
  ].join(","),
  h1: {
    fontSize: "4rem",
    fontWeight: 600,
    lineHeight: 1,
  },
  h2: {
    letterSpacing: "-.025em",
    fontWeight: 700,
    fontSize: "2.25rem",
    lineHeight: 2.5,
  },
  h3: {
    fontWeight: 500,
    fontSize: "1.25rem",
    lineHeight: 1.75,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.75,
  },
  body2: {
    fontSize: "1rem",
    lineHeight: 1.75,
  },
};

export const AppLightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00255A",
      light: "#E2F1FA",
    },
    secondary: {
      main: "#E2F1FA",
      light: "#FFFFFF",
    },
    error: {
      main: red[500],
      light: "#ECC8C7",
    },
    background: {
      default: "#FFFFFF",
      paper: "#E2F1FA",
    },
    text: {
      primary: "#000",
      secondary: "#00255A",
      disabled: grey[200],
    },
    action: {
      hover: "#E2F1FA",
    },
    info: {
      light: "#fff",
      main: "#A1A1AA",
    },
  },
  typography: {
    ...commonTypography,
    // Any light-theme-specific overrides can go here
    h1: { ...commonTypography.h1, color: "#00255A" },
    h2: { ...commonTypography.h2, color: "#00255A" },
    h3: { ...commonTypography.h3, color: "#00255A" },
    h6: { color: "#00255A" },
    body1: { ...commonTypography.body1, color: "#00255A" },
    body2: { ...commonTypography.body2, color: "#666" },
  },
});

export const AppDarkTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2A93D5",
      light: "#FFFFFF",
    },
    secondary: {
      main: "#E2F1FA",
      light: "#FFF",
    },
    error: {
      main: "#EF3C34",
      light: "#FFA9A5",
    },
    background: {
      default: "#161A23",
      paper: "#000",
    },
    text: {
      primary: "#fff",
      secondary: "#fff",
      disabled: grey[800],
    },
    action: {
      hover: "#2A93D5",
    },
    info: {
      light: "#161A23",
      main: "#58585C",
    },
  },
  typography: {
    ...commonTypography,
    // Any dark-theme-specific overrides can go here
    h1: { ...commonTypography.h1, color: "#fff" },
    h2: { ...commonTypography.h2, color: "#fff" },
    h3: { ...commonTypography.h3, color: "#fff" },
    h6: { color: "#fff" },
    body1: { ...commonTypography.body1, color: "#fff" },
    body2: { ...commonTypography.body2, color: "#9CA3AF" },
  },
});
