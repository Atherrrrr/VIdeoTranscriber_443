import Link from "next/link";
import * as React from "react";
import {
  Stack,
  Grid,
  useTheme,
  Button,
  ButtonGroup,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSnackbar } from "@/store/snackbar";
import { FilledInputField, DomainImage } from "@/components/shared";
import { BACKEND_URL, REGISTER_BILKENTEER } from "@/routes";
import { useRouter } from "next/router";
import { flushSync } from "react-dom";
import Auth from "aws-amplify";
import { LogoImage } from "@/components/shared/LogoImage";

const RegisterStack = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.default,
  width: "fit-content",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "3rem",
  borderRadius: "15px",
  alignItems: "center",
  border: `1px solid ${theme.palette.primary.main}`,
}));

type User = {
  email: string;
  password: string;
};

export default function RegisterPage() {
  /** a successful registration request will ignore the generated JWT
   * and instead redirect to login page
   */

  const router = useRouter();
  const theme = useTheme();
  const [firstname, setFirstname] = React.useState<string>("");
  const [lastname, setLastname] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [registering, setRegistering] = React.useState<boolean>(false);

  const snackbar = useSnackbar();

  React.useEffect(() => {
    setEmail("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setRegistering(false);
  }, []);

  const handleRegister = async () => {
    flushSync(() => setRegistering(true));
    try {
      const res = await fetch(`${BACKEND_URL}${REGISTER_BILKENTEER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          given_name: firstname,
          family_name: lastname,
          phone_number: phoneNumber,
          email: email,
          password: password,
        }),
      });

      try {
        const result = await Auth.Amplify.({
          username: email,
          password: password,
          // if custom attribute is added
          attributes: {
            "custom:role": "user",
          },
        });
        return result;
      } catch (error) {
        console.error("Error registering user:", error);
      }
      console.log("User registered:", user);

      const data = await res.json();
      if (data.hasOwnProperty("token")) {
        // do not store this accessToken, redirect to login
        snackbar("success", "Account Created");
        router.replace("/login");
      } else if ("errors" in data) {
        throw new Error(data["errors"][0]);
      } else {
        throw new Error("Internal Server Error");
      }
    } catch (err: unknown) {
      snackbar("error", (err as Error).message);
    } finally {
      setRegistering(false);
    }
  };

  // const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   try {
  //     const result = await Auth.signUp({
  //       username: user.email,
  //       password: user.password,
  //       // if custom attribute is added
  //       attributes: {
  //         "custom:role": "user",
  //       },
  //     })
  //     return result
  //   } catch (error) {
  //     console.error("Error registering user:", error)
  //   }
  //   console.log("User registered:", user);
  // };

  return (
    <>
      {registering && (
        <div
          style={{
            position: "absolute",
            inset: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="primary" size={80} thickness={3} />
        </div>
      )}
      <RegisterStack gap={2}>
        <LogoImage/>
        <Grid container gap={0.5} justifyContent="space-between">
          <Grid item xs={5.75} style={{ margin: "5px" }}>
            <FilledInputField
              disabled={registering}
              placeholder="FirstName"
              label="First Name"
              fullWidth
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              multiline={false}
              size="small"
              background="white"
              hoverbackground={theme.palette.secondary.light}
              focusedbackground={theme.palette.secondary.light}
            />
          </Grid>
          <Grid item xs={5.75} style={{ margin: "5px" }}>
            <FilledInputField
              disabled={registering}
              placeholder="LastName"
              label="Last Name"
              fullWidth
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              multiline={false}
              size="small"
              background="white"
              hoverbackground={theme.palette.secondary.light}
              focusedbackground={theme.palette.secondary.light}
            />
          </Grid>
        </Grid>
        <FilledInputField
          style={{ margin: "5px" }}
          disabled={registering}
          placeholder="Email"
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          multiline={false}
          size="small"
          background="white"
          hoverbackground={theme.palette.secondary.light}
          focusedbackground={theme.palette.secondary.light}
        />
        <FilledInputField
          style={{ margin: "5px" }}
          disabled={registering}
          placeholder="Phone Number"
          label="Phone Number"
          fullWidth
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          multiline={false}
          size="small"
          background="white"
          hoverbackground={theme.palette.secondary.light}
          focusedbackground={theme.palette.secondary.light}
        />
        <FilledInputField
          style={{ margin: "5px" }}
          disabled={registering}
          placeholder="Password"
          label="Password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          multiline={false}
          size="small"
          background="white"
          hoverbackground={theme.palette.secondary.light}
          focusedbackground={theme.palette.secondary.light}
        />

        <Button
          variant="contained"
          onClick={handleRegister}
          sx={{
            textTransform: "none",
            padding: "5px",
          }}
        >
          Sign Up
        </Button>
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: theme.palette.background.default,
          }}
        />
        <Typography variant="h6" color="primary">
          Already have an account?
        </Typography>
        <Link href={"/login"}>
          <Button
            disabled={registering}
            size="small"
            variant="outlined"
            sx={{
              textTransform: "none",
              width: "fit-content",
              margin: "5px",
            }}
          >
            Log In
          </Button>
        </Link>
      </RegisterStack>
    </>
  );
}
