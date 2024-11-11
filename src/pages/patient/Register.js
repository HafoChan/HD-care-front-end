import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import "../../css/user/login_register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng ký:", { username, email, password });
  };

  return (
    <div
      className="login-container bg-login-register"
      style={{ display: "flex", height: "100vh" }}
    >
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Mật khẩu"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Đăng ký
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Register;
