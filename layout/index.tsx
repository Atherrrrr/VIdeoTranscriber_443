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
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LightDarkSwitchBtn from "@/components/shared/LightDarkSwitchBtn";
import { snackbarAtom, snackbarMessage, snackbarSeverity } from "@/store/snackbar";
import { useRouter } from "next/router";
import { NotificationsOutlined } from "@mui/icons-material";
import { IThemeMode } from "@/theme/types";

interface LayoutProps {
  children: React.ReactNode;
}

// const PageContainer = styled("div")(({ theme }) => ({
//   flexGrow: 1,
//   position: "relative",
//   paddingTop: 10,
// }));

const PageContainer = ({ children, theme }) => (
  <Box
    sx={{
      paddingTop: 12, // Adjust based on AppBar height
      paddingLeft: 8,
      paddingRight: 8,
      paddingBottom: 3,
      backgroundColor: theme.palette.background.default,
    }}
  >
    {children}
  </Box>
);
const Layout = (props: LayoutProps): JSX.Element => {
  const theme = useTheme();

  // const [currentUser] = useAtom(currentUserAtom);
  // const currentUser = true;
  // const [profileImgSrc, refetch] = useProfilePicture();

  const [snackbarStatus, setSnackbarStatus] = useAtom(snackbarAtom);
  const [severity] = useAtom(snackbarSeverity);
  const [message] = useAtom(snackbarMessage);

  // const snackbar = useSnackbar();

  const router = useRouter();
  const currentURL = router.asPath;

  const goToAccount = () => {
    router.push(`/account`);
  };

  const logout = () => {
    router.push(`/login`);
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
                <IconButton size="small">
                  <NotificationsOutlined style={{ fill: theme.palette.primary.main }} />
                </IconButton>
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
