import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  Divider,
  Paper,
  Grid,
  useTheme,
  alpha,
  Chip,
  Stack,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteIcon from "@mui/icons-material/Note";
import HeaderComponent from "../../components/patient/HeaderComponent";
import { motion } from "framer-motion";

function AppointmentHistory() {
  const theme = useTheme();
  const [prescription, setPrescription] = useState({
    doctor: "Nguyễn Văn A",
    patient: "Trần Thị B",
    date: "30/03/2023",
    time: "09:00 - 09:30",
    birthdate: "01/01/1990",
    gender: "Nữ",
    status: "Đã hoàn thành",
    description: "Mụn viêm và mụn đầu đen vùng trán",
    note: "Bệnh nhân cần kiêng ăn đồ cay nóng, thức khuya và hạn chế sử dụng mỹ phẩm trong thời gian điều trị.",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã hoàn thành":
        return "success";
      case "Đang thực hiện":
        return "primary";
      case "Chờ xác nhận":
        return "warning";
      case "Đã hủy":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.background.default, 0.8),
        minHeight: "100vh",
      }}
    >
      <HeaderComponent />

      <Divider />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Fade in timeout={500}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                mb: 4,
                background: `linear-gradient(120deg, ${alpha(
                  theme.palette.primary.main,
                  0.08
                )} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <HistoryIcon
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.main,
                      mr: 2,
                    }}
                  />
                  <div>
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      color="primary.main"
                      gutterBottom
                    >
                      Lịch sử khám bệnh
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Thông tin chi tiết về lịch sử khám và đơn thuốc của bạn
                    </Typography>
                  </div>
                </Box>

                <Chip
                  label={prescription.status}
                  color={getStatusColor(prescription.status)}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    py: 1,
                    px: 1,
                    borderRadius: 2,
                  }}
                />
              </Box>
            </Paper>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 4px 20px ${alpha(
                    theme.palette.common.black,
                    0.05
                  )}`,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color="text.primary"
                    gutterBottom
                    sx={{ mb: 3 }}
                  >
                    Chi tiết đơn khám
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Bác sĩ"
                        fullWidth
                        value={prescription.doctor}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Bệnh nhân"
                        fullWidth
                        value={prescription.patient}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày khám"
                        fullWidth
                        value={prescription.date}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon color="primary" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Thời gian khám"
                        fullWidth
                        value={prescription.time}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon color="primary" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Ngày sinh"
                        fullWidth
                        value={prescription.birthdate}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <CakeIcon color="primary" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: `1px solid ${alpha(
                            theme.palette.divider,
                            0.15
                          )}`,
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <WcIcon color="primary" sx={{ ml: 1, mr: 2 }} />
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mr: 3 }}
                          >
                            Giới tính:
                          </Typography>
                          <RadioGroup
                            row
                            value={prescription.gender}
                            sx={{ ml: "auto" }}
                          >
                            <FormControlLabel
                              value="Nam"
                              control={<Radio color="primary" />}
                              label="Nam"
                            />
                            <FormControlLabel
                              value="Nữ"
                              control={<Radio color="primary" />}
                              label="Nữ"
                            />
                          </RadioGroup>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Mô tả chẩn đoán"
                        fullWidth
                        value={prescription.description}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionIcon color="primary" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Lưu ý và hướng dẫn điều trị"
                        multiline
                        rows={3}
                        fullWidth
                        value={prescription.note}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ alignSelf: "flex-start", mt: 1.5 }}
                            >
                              <NoteIcon color="primary" />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: 2,
                            pl: 1,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: `0px 4px 12px ${alpha(
                          theme.palette.primary.main,
                          0.25
                        )}`,
                      }}
                    >
                      Xem đơn thuốc
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default AppointmentHistory;
