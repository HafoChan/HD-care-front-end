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
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../../css/user/login_register.css";
import { useNavigate } from "react-router-dom";
import images from "../../constants/images";
import axiosClient from "../../api/axios-instance";
import { setItem, setRole } from "../../service/otherService/localStorage";
import { OAuthConfig } from "../../configuration/configuration";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState("");
  const navigate = useNavigate();

  // Create axios instance for password reset
  const axiosResetPassword = axios.create({
    baseURL: "https://hdcarebackend-production.up.railway.app/api/v1/",
    headers: {
      "Content-Type": "application/json",
    },
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await axiosClient.post("auth/login", {
        username: email,
        password: password,
      });

      if (data.code != 1000) {
        console.log(data.message);
        throw new Error(data.message);
      }
      if (data.code === 1000 && !data?.result) {
        toast.warning(data.message);
      } else {
        showSuccess(data.message);
        console.log(data.result);
        setItem(
          data.result.accessToken,
          data.result.refreshToken,
          data.result.userResponse.img,
          data.result.userResponse.username
        );
        setRole(data.result.roles);

        console.log("data", data.result.userResponse.username);
        // navigate("/home");
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordUsername) {
      showError("Vui lòng nhập tên đăng nhập");
      return;
    }

    try {
      const response = await axiosResetPassword.get(
        `/auth/resetPassword?username=${forgotPasswordUsername}`
      );
      console.log("response", response);
      if (response.data.code === 1000) {
        showSuccess(
          "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn."
        );
        setForgotPasswordOpen(false);
        setForgotPasswordUsername("");
      } else {
        showError(
          response.data.message ||
            "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu"
        );
      }
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu"
      );
    }
  };

  return (
    <Box
      className="login-container bg-login-register"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100vh",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.dark,
            0.2
          )} 0%, ${alpha(theme.palette.primary.light, 0)} 100%)`,
          zIndex: -1,
        },
      }}
    >
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

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Fade in timeout={800}>
          <Card
            elevation={6}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              maxWidth: "1000px",
              mx: "auto",
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              background: theme.palette.background.paper,
            }}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  position: "relative",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Box
                  component="img"
                  src={images.login_img}
                  alt="Healthcare Services"
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 3,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="white"
                    sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                  >
                    HD-Care
                  </Typography>
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{
                      opacity: 0.9,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  >
                    Chăm sóc sức khỏe làn da của bạn
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <CardContent sx={{ p: 4, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Button
                      component={Link}
                      to="/"
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        mr: "auto",
                        textTransform: "none",
                        mb: 2,
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      Quay lại trang chủ
                    </Button>
                  </Box>

                  <Typography
                    variant="h4"
                    gutterBottom
                    fontWeight={700}
                    color="primary.main"
                    sx={{ mb: 1 }}
                  >
                    Đăng nhập
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Tài khoản"
                      variant="outlined"
                      fullWidth
                      placeholder="Email hoặc tên đăng nhập"
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      label="Mật khẩu"
                      variant="outlined"
                      placeholder="Mật khẩu của bạn"
                      fullWidth
                      margin="normal"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                        },
                      }}
                      sx={{ mb: 1 }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        onClick={() => setForgotPasswordOpen(true)}
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: "none",
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Quên mật khẩu?
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        mb: 3,
                      }}
                    >
                      Đăng nhập
                    </Button>

                    <Divider sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          px: 1,
                        }}
                      >
                        Hoặc đăng nhập với
                      </Typography>
                    </Divider>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleLoginGoogle}
                      startIcon={<GoogleIcon sx={{ color: "#4285f4" }} />}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#ffffff",
                        color: "#444444",
                        borderColor: "#dadce0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 500,
                        mb: 3,
                        "&:hover": {
                          backgroundColor: "#f8f9fa",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                          borderColor: "#dadce0",
                        },
                      }}
                    >
                      Đăng nhập với Google
                    </Button>

                    <Box sx={{ textAlign: "center", mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Chưa có tài khoản?{" "}
                        <Link
                          to="/register"
                          style={{
                            textDecoration: "none",
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          }}
                        >
                          Đăng ký
                        </Link>
                      </Typography>
                    </Box>
                  </form>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Fade>
      </Container>

      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      >
        <DialogTitle>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Vui lòng nhập tên đăng nhập của bạn để nhận hướng dẫn đặt lại mật
            khẩu.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Tên đăng nhập"
            type="text"
            fullWidth
            value={forgotPasswordUsername}
            onChange={(e) => setForgotPasswordUsername(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotPasswordOpen(false)}>Hủy</Button>
          <Button
            onClick={handleForgotPassword}
            variant="contained"
            color="primary"
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
