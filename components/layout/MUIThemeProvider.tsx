import { useTheme } from "next-themes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppDarkTheme, AppLightTheme } from "@/theme/themes";
import type { FC} from "react";
import { useEffect, useState } from "react";

const MUIThemeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(AppDarkTheme);

  useEffect(() => {
    resolvedTheme === "light"
      ? setCurrentTheme(AppLightTheme)
      : setCurrentTheme(AppDarkTheme);
  }, [resolvedTheme]);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MUIThemeProvider;
