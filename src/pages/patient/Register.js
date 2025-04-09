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
  Card,
  CardContent,
  useTheme,
  alpha,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Stepper,
  Step,
  StepLabel,
  OutlinedInput,
} from "@mui/material";
import "../../css/user/login_register.css";
import patientApi from "../../api/patient";
import passwordService from "../../service/patientService/passwordService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WcIcon from "@mui/icons-material/Wc";
import BadgeIcon from "@mui/icons-material/Badge";

const Register = () => {
  const theme = useTheme();
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Thông tin tài khoản", "Thông tin cá nhân"];

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

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();

    if (activeStep === 0) {
      if (
        !userInfo.username ||
        !userInfo.email ||
        !userInfo.password ||
        !confirmPassword
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin tài khoản!");
        return;
      }

      if (
        !passwordService.validatePasswords(userInfo.password, confirmPassword)
      ) {
        toast.error("Mật khẩu xác nhận không đúng");
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
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

      // Check if all required fields are filled
      if (
        !userInfo.username ||
        !userInfo.email ||
        !userInfo.password ||
        !userInfo.name ||
        !userInfo.phone ||
        !userInfo.address ||
        !userInfo.gender
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      data = await patientApi.create(userInfo);

      if (data.code === 1000) {
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
    <Box
      className="login-container bg-login-register"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        py: 5,
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
          )} 0%, ${alpha(theme.palette.primary.light, 0.4)} 100%)`,
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

      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Card
            elevation={6}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              mx: "auto",
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              background: theme.palette.background.paper,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Button
                  component={Link}
                  to="/"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    mr: "auto",
                    textTransform: "none",
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
                textAlign="center"
                sx={{ mb: 3 }}
              >
                Đăng ký tài khoản
              </Typography>

              <Stepper activeStep={activeStep} sx={{ mb: 4, py: 2 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (activeStep === steps.length - 1) {
                    handleSubmit(e);
                  } else {
                    handleNext(e);
                  }
                }}
              >
                {activeStep === 0 ? (
                  <Box>
                    <TextField
                      label="Tên đăng nhập"
                      variant="outlined"
                      placeholder="Nhập tên đăng nhập"
                      fullWidth
                      margin="normal"
                      name="username"
                      value={userInfo.username}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon color="primary" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 },
                      }}
                    />

                    <TextField
                      label="Email"
                      variant="outlined"
                      placeholder="Nhập email"
                      fullWidth
                      margin="normal"
                      type="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 },
                      }}
                    />

                    <TextField
                      label="Mật khẩu"
                      variant="outlined"
                      placeholder="Nhập mật khẩu"
                      fullWidth
                      margin="normal"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={userInfo.password}
                      onChange={handleChange}
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
                        sx: { borderRadius: 2 },
                      }}
                    />

                    <TextField
                      label="Xác nhận mật khẩu"
                      placeholder="Nhập xác nhận mật khẩu"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
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
                              onClick={handleToggleConfirmPasswordVisibility}
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
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={7}>
                        <TextField
                          label="Họ và tên"
                          placeholder="Nhập họ và tên"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="name"
                          value={userInfo.name}
                          onChange={handleChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <TextField
                          label="Số điện thoại"
                          placeholder="Nhập số điện thoại"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="phone"
                          value={userInfo.phone}
                          onChange={handleChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="primary" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={7}>
                        <TextField
                          label="Địa chỉ"
                          placeholder="Nhập địa chỉ"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="address"
                          value={userInfo.address}
                          onChange={handleChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <HomeIcon color="primary" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 2 },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        >
                          <InputLabel>Giới tính</InputLabel>
                          <Select
                            name="gender"
                            placeholder="Nhập giới tính"
                            value={userInfo.gender}
                            onChange={handleChange}
                            label="Giới tính"
                            startAdornment={
                              <InputAdornment position="start">
                                <WcIcon color="primary" />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    variant="outlined"
                    sx={{
                      py: 1.2,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      visibility: activeStep === 0 ? "hidden" : "visible",
                    }}
                  >
                    Quay lại
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    type={activeStep === steps.length - 1 ? "submit" : "button"}
                    onClick={
                      activeStep === steps.length - 1 ? null : handleNext
                    }
                    size="large"
                    sx={{
                      px: 4,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {activeStep === steps.length - 1 ? "Đăng ký" : "Tiếp tục"}
                  </Button>
                </Box>
              </form>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    style={{
                      textDecoration: "none",
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    }}
                  >
                    Đăng nhập
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
