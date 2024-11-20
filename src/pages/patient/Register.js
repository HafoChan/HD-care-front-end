import React, { useState } from "react";
import {
  TextField,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (
        !passwordService.validatePasswords(userInfo.password, confirmPassword)
      ) {
        throw new Error("Mật khẩu xác nhận không đúng");
      }
      patientApi
        .create(userInfo)
        .then((data) => {
          console.log(data);
          if (data.code == 1028) {
            showSuccess(data.message);
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else throw new Error(data.message);
        })
        .catch((error) => {
          showError(error.message);
          return;
        });
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <div
      className="login-container bg-login-register"
      style={{ display: "flex", height: "100vh" }}
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
          style={{ padding: "20px", boxShadow: "none", borderRadius: 0 }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Đăng ký tài khoản
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Tên người dùng"
              variant="outlined"
              fullWidth
              margin="normal"
              name="username"
              value={userInfo.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Tên"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              required
            />
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
            <FormControl variant="outlined" fullWidth margin="normal" required>
              <InputLabel>Giới tính</InputLabel>
              <Select
                name="gender"
                value={userInfo.gender}
                onChange={handleChange}
                label="Giới tính"
              >
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
              </Select>
            </FormControl>
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
              sx={{ mt: 3 }}
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
