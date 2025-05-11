import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserAuth } from "../../context/UserAuthContext"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import GoogleButton from "react-google-button";

const theme = createTheme();

function ANewUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { adminLogIn, googleSignIn } = useUserAuth(); // context functions
  const navigate = useNavigate();

  const handleLogIn = async () => {
    setLoading(true);
    setError(false);
    try {
      await adminLogIn(email, password);
      navigate("/adhome");
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(false);
    try {
      await googleSignIn();
      navigate("/adhome");
    } catch (error) {
      console.error("Google login failed:", error);
      setError(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Admin Login
          </Typography>
          <Box component="form" noValidate onSubmit={(e) => e.preventDefault()} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                Please enter correct login credentials
              </Typography>
            )}

            {loading ? (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <RotatingLines width="30" />
              </Box>
            ) : (
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleLogIn}
              >
                Login
              </Button>
            )}

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <GoogleButton
                label="Sign in with Google"
                onClick={handleGoogleLogin}
                style={{ width: "100%" }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ANewUser;
