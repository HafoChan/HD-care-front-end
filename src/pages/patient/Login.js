import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Snackbar
} from "@mui/material";
import { json, Link } from "react-router-dom";
import "../../css/user/login_register.css";
import { useNavigate } from 'react-router-dom';
import images from "../../constants/images";
import axiosClient from "../../components/api/axiosClient";

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(email+password)
    const data = await axiosClient.post(
      "auth/login",{username : email,password : password}
    );
    try {
      if (data.code != 1000)
      {
        console.log(data.message)
        throw new Error(data.message)
      }
      setSnackBarMessage(data.message)
      showSuccess(snackBarMessage)

    } catch (error) {
      setSnackBarMessage(error.message)
      showError(snackBarMessage)
    }
    console.log(data.result.token)

    
    localStorage.setItem("accessToken",data.result.accessToken)
    localStorage.setItem("refreshToken",data.result.refreshToken)
    navigate("/home")

  }

  return (
    <div className="login-container bg-login-register">
      <Container
        component="main"
        maxWidth="lg"
        style={{
          display: "flex",
          height: "50%",
          justifyContent: "center",
        }}
      >
        <img src={images.login_img} alt="Side" className="side-image" />
        <Paper
          elevation={3}
          style={{ padding: "20px", boxShadow: "none", borderRadius: 0 }}
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
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button color="primary">Don't have an account? Sign up</Button>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
