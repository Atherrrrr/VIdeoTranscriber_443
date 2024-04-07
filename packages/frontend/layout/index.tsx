import Link from "next/link";
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
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import LoginIcon from "@mui/icons-material/Login";
import { IconMessageReport } from "@tabler/icons-react";
import LightDarkSwitchBtn from "@/components/shared/LightDarkSwitchBtn";
import { snackbarAtom, snackbarMessage, snackbarSeverity, useSnackbar } from "@/store/snackbar";
import { useRouter } from "next/router";
import { SignupIcon } from "@/icons";
import useProfilePicture from "@/hooks/useProfilePicture";
import { NotificationsOutlined, PlayCircle } from "@mui/icons-material";
import { IThemeMode } from "@/theme/types";
import SideBar from "@/components/layout/Sidebar";

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
      paddingLeft: { sm: 35 }, // Adjust based on Sidebar width
      paddingRight: 3,
      paddingBottom: 3,
      backgroundColor: theme.palette.background.default,
    }}
  >
    {children}
  </Box>
);

export default function Layout(props: LayoutProps) {
  const theme = useTheme();

  // const [currentUser] = useAtom(currentUserAtom);
  const currentUser = true;
  const [profileImgSrc, refetch] = useProfilePicture();

  const [snackbarStatus, setSnackbarStatus] = useAtom(snackbarAtom);
  const [severity] = useAtom(snackbarSeverity);
  const [message] = useAtom(snackbarMessage);

  const snackbar = useSnackbar();

  const router = useRouter();
  const currentURL = router.asPath;

  const goToAccount = () => {
    router.push(`/account`); // Assuming your `page` values in menuItems are valid paths
  };

  return (
    <>
      {true && (
        <Fab
          color="primary"
          sx={{
            position: "absolute",
            right: 25,
            bottom: 25,
          }}
          onClick={() => router.replace("/inbox")}
        >
          <Tooltip title="Report" arrow>
            <IconMessageReport color="white" />
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
                <Link href={"/product/post"}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ textTransform: "none", height: "fit-content" }}
                    startIcon={<PlayCircle style={{ fill: "#fff" }} />}
                  >
                    Start New Practice Session
                  </Button>
                </Link>

                <IconButton size="small">
                  <NotificationsOutlined style={{ fill: theme.palette.primary.main }} />
                </IconButton>
                <Box onClick={goToAccount}>
                  <Avatar src={"/user-avatar.svg"} />
                </Box>
                <Typography variant="subtitle2" color={theme.palette.primary.main}>
                  Faaiz Khan
                </Typography>
                <LightDarkSwitchBtn />
              </Grid>
            </Grid>
          </AppBar>

          <SideBar />
        </div>
      )}
      <PageContainer children={props.children} theme={theme}>
        {/* {props.children} */}
      </PageContainer>
    </>
  );
}
