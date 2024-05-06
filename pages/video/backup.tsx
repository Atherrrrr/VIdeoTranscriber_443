import * as React from "react";
import { useAtom } from "jotai";
import {
  Snackbar,
  Alert,
  AppBar,
  Grid,
  Fab,
  useTheme,
  Avatar,
  Tooltip,
  IconButton,
  Box,
  Typography,
  Menu,
  Badge,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LightDarkSwitchBtn from "@/components/shared/LightDarkSwitchBtn";
import { snackbarAtom, snackbarMessage, snackbarSeverity } from "@/store/snackbar";
import { useRouter } from "next/router";
import { NotificationsOutlined } from "@mui/icons-material";
import { IThemeMode } from "@/theme/types";
import type { Theme } from "@mui/material";

interface PageContainerProps {
  children: React.ReactNode;
  theme: Theme;
}

interface LayoutProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, theme }) => (
  <Box
    sx={{
      // sidebarWidth === 0 means live practice session
      marginTop: 7,
      paddingLeft: 5,
      paddingRight: 5,
      marginRight: 0,
      marginBottom: 5,
      backgroundColor: theme.palette.background.default,
      borderRadius: 0,
      maxHeight: "calc(100vh - 64px)",
      minHeight: "calc(100vh - 56px)",
      overflowY: "hidden",
    }}
  >
    {children}
  </Box>
);
const Layout = (props: LayoutProps): JSX.Element => {
  const theme = useTheme();
  const [ws, setWs] = React.useState(null);

  const [snackbarStatus, setSnackbarStatus] = useAtom(snackbarAtom);
  const [severity] = useAtom(snackbarSeverity);
  const [message] = useAtom(snackbarMessage);
  const [notifications, setNotifications] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const userId = "yahya";

  React.useEffect(() => {
    const ws = new WebSocket(
      `wss://togyq1hva3.execute-api.us-east-1.amazonaws.com/production?user_id=${userId}`
    );
    ws.onopen = () => console.log("WebSocket is open now.");
    ws.onmessage = (event) => {
      console.log("Message from server", event.data);
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data]);
    };
    ws.onclose = () => console.log("WebSocket is closed now.");
    ws.onerror = (error) => console.log("WebSocket error:", error);
    setWs(ws);
    return () => ws.close();
  }, []);

  const router = useRouter();
  const currentURL = router.asPath;

  const goToAccount = () => {
    router.push(`/account`);
  };

  const logout = () => {
    router.push(`/login`);
    ws?.close();
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {true && (
        <Fab
          color="error"
          sx={{
            position: "absolute",
            right: 20,
            bottom: 20,
          }}
          onClick={logout}
        >
          <Tooltip title="Logout" arrow>
            <LogoutIcon style={{ fill: "#FFF" }} />
          </Tooltip>
        </Fab>
      )}
      <Snackbar
        open={snackbarStatus}
        autoHideDuration={6000}
        onClose={() => setSnackbarStatus(false)}
      >
        <Alert onClose={() => setSnackbarStatus(false)} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      {!(currentURL.includes("login") || currentURL.includes("register")) && (
        <div>
          <AppBar
            position="fixed"
            color="secondary"
            sx={{
              height: "fit-content",
              padding: "0.5rem 0.75rem",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Grid container sx={{ width: "100%" }} alignItems="center">
              <Grid
                item
                xs={1}
                sx={{
                  height: 40,
                  display: "flex",
                  alignItems: "center", // Center vertically
                  justifyContent: "center", // Center horizontally
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: "80%",
                    objectFit: "contain",
                    display: "block",
                    marginLeft: theme.spacing(2),
                    marginRight: "auto",
                  }}
                  alt="WePrep logo"
                  src={
                    theme.palette.mode === IThemeMode.LIGHT
                      ? "/app-logo-light.png"
                      : "/app-logo-dark.png"
                  }
                />
              </Grid>
              <Grid
                item
                xs={11}
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <IconButton size="small" onClick={handleNotificationClick}>
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsOutlined style={{ fill: theme.palette.primary.main }} />
                  </Badge>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  {notifications.map((notification, index) => (
                    <MenuItem key={index} onClick={handleClose}>
                      {notification.message}
                    </MenuItem>
                  ))}
                </Menu>
                <Box onClick={goToAccount}>
                  <Avatar src={"/user-avatar.svg"} />
                </Box>
                <Typography variant="subtitle2" color={theme.palette.primary.main}>
                  Maher Athar
                </Typography>
                <LightDarkSwitchBtn />
              </Grid>
            </Grid>
          </AppBar>
        </div>
      )}
      <PageContainer theme={theme}>{props.children}</PageContainer>
    </>
  );
};
export default Layout;
