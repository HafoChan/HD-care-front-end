import React, { useState } from "react";
import {
  TextField,
  Box,
  Grid,
  Button,
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import "../../css/user/login_register.css";
import patientApi from "../../api/patient";
import passwordService from "../../service/patientService/passwordService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    gender: "",
  });
  const navigate = useNavigate();

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackType, setSnackType] = useState("error");

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

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data;
    try {
      if (
        !passwordService.validatePasswords(userInfo.password, confirmPassword)
      ) {
        throw new Error("Mật khẩu xác nhận không đúng");
      }

      data = await patientApi.create(userInfo);

      if (data.code === 1028) {
        showSuccess(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(data?.message || error.message);
    }
  };

  return (
    <div
      className="login-container bg-login-register"
      style={{
        display: "flex",
        height: "100vh",
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
      <Container
        component="main"
        maxWidth="lg"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            boxShadow: "none",
            borderRadius: 0,
            maxWidth: "1200px",
            minWidth: "900px",
            borderRadius: 10,
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Đăng ký tài khoản
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              fullWidth
              margin="normal"
              name="username"
              value={userInfo.username}
              onChange={handleChange}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <TextField
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <TextField
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="address"
                  value={userInfo.address}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                >
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    name="gender"
                    value={userInfo.gender}
                    onChange={handleChange}
                    label="Giới tính"
                  >
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Mật khẩu"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              name="password"
              value={userInfo.password}
              onChange={handleChange}
              required
            />
            <TextField
              label="Xác nhận mật khẩu"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng ký
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Register;
