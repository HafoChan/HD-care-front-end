import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../../css/user/login_register.css";
import { useNavigate } from "react-router-dom";
import images from "../../constants/images";
import axiosClient from "../../api/axios-instance";
import { setItem } from "../../service/otherService/localStorage";
import { BorderLeft, BorderLeftOutlined } from "@mui/icons-material";
import { OAuthConfig } from "../../configuration/configuration";
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");
  const navigate = useNavigate();
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const showError = (message) => {
    setSnackType("error");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const showSuccess = (message) => {
    setSnackType("success");
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const handleLoginGoogle = async () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);

    window.location.href = targetUrl;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await axiosClient.post("auth/login", {
      username: email,
      password: password,
    });

    try {
      if (data.code != 1000) {
        console.log(data.message);
        throw new Error(data.message);
      }
      showSuccess(data.message);
      setItem(
        data.result.accessToken,
        data.result.refreshToken,
        data.result.userResponse.img
      );
      // navigate("/home");
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div className="login-container bg-login-register">
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Container
        component="main"
        maxWidth="lg"
        style={{
          display: "flex",
          height: "50%",
          justifyContent: "center",
        }}
      >
        <img
          src={images.login_img}
          alt="Side"
          className="side-image"
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
          }}
        />
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            boxShadow: "none",
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
          }}
        >
          <Typography variant="h5" align="center">
            Welcome to our professional skincare service!
          </Typography>
          <Typography
            variant="body2"
            align="center"
            style={{ marginBottom: "20px", marginTop: "10px" }}
          >
            Log in to book an appointment and enjoy radiant skin today.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: "10px" }}
              fullWidth
            >
              Log In
            </Button>
          </form>
          <Box display="flex" justifyContent="flex-end">
            <Box style={{ marginTop: "15px" }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button
                  color="primary"
                  sx={{ textTransform: "none", fontSize: 15 }}
                >
                  Don't have an account? Sign up
                </Button>
              </Link>
              <Button
                variant="outlined"
                onClick={handleLoginGoogle}
                startIcon={<GoogleIcon />}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#ffffff',
                  color: '#444444',
                  borderColor: '#dadce0',
                  boxShadow: '0 2px 4px 0 rgba(0,0,0,.25)',
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,.25)',
                    borderColor: '#dadce0',
                  },
                  marginLeft: '10px',
                  fontSize: 15,
                  padding: '8px 16px',
                  fontWeight: 500,
                  '& .MuiButton-startIcon': {
                    marginRight: '12px',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#4285f4', // Màu xanh của Google
                  }
                }}
              >
                Sign in with Google
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
