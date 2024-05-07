import React, { useEffect, useRef, useState } from "react";
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
  ListItem,
  ListItemText,
  Badge,
  List,
  Popover,
  ListItemIcon,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LightDarkSwitchBtn from "@/components/shared/LightDarkSwitchBtn";
import { snackbarAtom, snackbarMessage, snackbarSeverity } from "@/store/snackbar";
import { useRouter } from "next/router";
import { CheckCircleOutline, DeleteOutline, NotificationsOutlined } from "@mui/icons-material";
import { IThemeMode } from "@/theme/types";
import type { Theme } from "@mui/material";
import LANGUAGE_DICTIONARY from "@/dataClasses/LanguageDictionary";
import type { FetchUserAttributesOutput } from "aws-amplify/auth";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { currentUserAtom } from "@/store/store";

interface PageContainerProps {
  children: React.ReactNode;
  theme: Theme;
}

interface LayoutProps {
  children: React.ReactNode;
}

interface Notification {
  message: string;
  seen: boolean;
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
  const [snackbarStatus, setSnackbarStatus] = useAtom(snackbarAtom);
  const [severity] = useAtom(snackbarSeverity);
  const [message] = useAtom(snackbarMessage);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotification, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((notif) => !notif.seen).length;
  const router = useRouter();
  const currentURL = router.asPath;
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  useEffect(() => {
    fetchUserAttributes()
      .then((user) => {
        console.log("currentUser", user);
        setCurrentUser(user); // Update the atom with fetched user data
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const newWs = new WebSocket(
        `wss://togyq1hva3.execute-api.us-east-1.amazonaws.com/production?user_id=${currentUser.sub}`
      );
      newWs.onopen = () => console.log("WebSocket is open now.");
      newWs.onmessage = (event) => {
        const formattedMessage = formatMessage(event.data);
        // Add the new notification and ensure the list is sorted with unseen messages at the top
        setNotifications((prev) => {
          const newNotifications = [{ message: formattedMessage, seen: false }, ...prev];
          return newNotifications.sort((a, b) => (a.seen === b.seen ? 0 : a.seen ? 1 : -1));
        });
      };
      newWs.onclose = () => console.log("WebSocket is closed now.");
      newWs.onerror = (error) => console.log("WebSocket error: ", error);

      setWs(newWs);
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [currentUser]);

  function formatMessage(message: string) {
    const matches = message.match(/'(\w{2})'/);
    if (matches && matches[1] && LANGUAGE_DICTIONARY[matches[1]]) {
      return message.replace(`'${matches[1]}'`, `'${LANGUAGE_DICTIONARY[matches[1]]}'`);
    }
    return message;
  }

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotification) {
      console.log("Opening notifications");
    } else {
      console.log("Closing notifications and marking all as seen");
      // Mark all notifications as seen when closing the notification list
      setNotifications((notifs) => notifs.map((notif) => ({ ...notif, seen: true })));
    }
  };

  const handleNotificationClose = () => {
    setShowNotifications(false);
    setNotifications((notifs) => notifs.map((notif) => ({ ...notif, seen: true })));
  };

  const goToAccount = () => {
    router.push(`/account`);
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
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
                <IconButton
                  size="small"
                  onClick={handleNotificationClick}
                  ref={notificationButtonRef} // Attach the ref here
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsOutlined sx={{ fill: theme.palette.primary.main }} />
                  </Badge>
                </IconButton>
                <Popover
                  id="notification-popover"
                  open={showNotification}
                  anchorEl={notificationButtonRef.current}
                  onClose={handleNotificationClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.default" }}>
                    {notifications.map((notification, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 5,
                              height: 5,
                              bgcolor: notification.seen ? "background.default" : "error.main",
                              borderRadius: "50%",
                              marginRight: 0.7,
                            }}
                          />

                          {notification.message.includes("delete") ? (
                            <DeleteOutline sx={{ fill: theme.palette.success.main }} />
                          ) : (
                            <CheckCircleOutline sx={{ fill: theme.palette.success.main }} />
                          )}
                        </ListItemIcon>
                        <ListItemText primary={notification.message} />
                      </ListItem>
                    ))}
                  </List>
                </Popover>
                <Box onClick={goToAccount}>
                  <Avatar src={"/user-avatar.svg"} />
                </Box>
                <Typography variant="subtitle2" color={theme.palette.primary.main}>
                  {currentUser?.given_name} {currentUser?.family_name}
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
