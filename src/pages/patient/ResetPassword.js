import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  Card,
  CardContent,
  useTheme,
  alpha,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");
  const { username } = useParams();

  // Create axios instance for password reset
  const axiosResetPassword = axios.create({
    baseURL: "http://hdcarebackend-production.up.railway.app/api/v1/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    if (!username) {
      showError("Link không hợp lệ");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [username, navigate]);

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
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      showError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const response = await axiosResetPassword.post("/auth/resetPassword", {
        username: username,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      if (response.data.code === 1000) {
        showSuccess("Đặt lại mật khẩu thành công");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showError(
          response.data.message || "Có lỗi xảy ra khi đặt lại mật khẩu"
        );
      }
    } catch (error) {
      showError(
        error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu"
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

      <Container maxWidth="sm">
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            background: theme.palette.background.paper,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              fontWeight={700}
              color="primary.main"
              sx={{ mb: 1 }}
            >
              Đặt lại mật khẩu
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Vui lòng nhập mật khẩu mới của bạn.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Mật khẩu mới"
                variant="outlined"
                placeholder="Nhập mật khẩu mới"
                fullWidth
                margin="normal"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                        onClick={() => setShowPassword(!showPassword)}
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
                sx={{ mb: 2 }}
              />

              <TextField
                label="Xác nhận mật khẩu"
                variant="outlined"
                placeholder="Nhập lại mật khẩu mới"
                fullWidth
                margin="normal"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
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
                sx={{ mb: 3 }}
              />

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
                }}
              >
                Đặt lại mật khẩu
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ResetPassword;
