import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Container,
  Button,
  Chip,
  Divider,
  Avatar,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  LocalHospital as LocalHospitalIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
} from "@mui/icons-material";
import Sidebar from "../../components/doctor/Sidebar";
import { appointment } from "../../api/appointment";
import { alpha, styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: "blur(20px)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  transition: "transform 0.3s, box-shadow 0.3s",
  position: "relative",
  overflow: "hidden",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: "translateX(8px)",
  },
}));

const IconBox = styled(Box)(({ theme, color }) => ({
  color: color || theme.palette.primary.main,
  backgroundColor: alpha(color || theme.palette.primary.main, 0.1),
  padding: theme.spacing(1),
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 4px 8px ${alpha(color || theme.palette.primary.main, 0.2)}`,
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  position: "relative",
  paddingLeft: theme.spacing(2),
  "&:before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "4px",
    height: "60%",
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(0.5),
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Hàm format date
  const formatDate = (dateString) => {
    const [date, time] = dateString.split(" ");
    return `${date} ${time}`;
  };

  // Hàm lấy màu cho status
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "primary";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await appointment.getAppointmentById(id);
      if (response.code === 1000) {
        setAppointmentData(response.result);
      } else {
        console.error("Failed to fetch appointment data:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch appointment data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <Box
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.95),
        minHeight: "100vh",
        display: "flex",
        pb: 10,
        backgroundImage: "linear-gradient(120deg, #f0f7ff 0%, #fafafa 100%)",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          transition: "margin 0.2s ease",
          py: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="xl">
          {loading ? (
            <Box sx={{ width: "100%", mt: 4 }}>
              <LinearProgress
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "& .MuiLinearProgress-bar": {
                    backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  },
                }}
              />
              <Typography
                sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
              >
                Đang tải thông tin cuộc hẹn...
              </Typography>
            </Box>
          ) : !appointmentData ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: "blur(20px)",
              }}
            >
              <Typography variant="h6">
                Không tìm thấy dữ liệu cuộc hẹn
              </Typography>
              <Button
                variant="contained"
                startIcon={<KeyboardBackspaceIcon />}
                onClick={() => navigate(-1)}
                sx={{ mt: 2, borderRadius: 8 }}
              >
                Quay lại
              </Button>
            </Paper>
          ) : (
            <>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{
                    borderRadius: 8,
                    px: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    borderWidth: 1.5,
                    "&:hover": {
                      borderWidth: 1.5,
                      backgroundColor: alpha("#1976d2", 0.04),
                    },
                  }}
                  startIcon={<KeyboardBackspaceIcon />}
                >
                  Quay lại
                </Button>

                <Chip
                  label={getStatusLabel(appointmentData.status)}
                  color={getStatusColor(appointmentData.status)}
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    py: 2.5,
                    px: 2,
                    height: "auto",
                    borderRadius: 8,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Chi tiết cuộc hẹn
              </Typography>

              <StyledPaper elevation={0}>
                <Grid container spacing={4}>
                  {/* Thông tin bệnh nhân */}
                  <Grid item xs={12} md={5}>
                    <SectionTitle variant="h6">
                      Thông tin bệnh nhân
                    </SectionTitle>

                    <InfoBox>
                      <InfoCard>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: theme.palette.primary.main,
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.3
                            )}`,
                          }}
                        >
                          {appointmentData.name?.charAt(0).toUpperCase() || "P"}
                        </Avatar>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            Họ và tên
                          </Typography>
                          <Typography variant="h6" fontWeight="medium">
                            {appointmentData.name}
                          </Typography>
                        </Box>
                      </InfoCard>

                      <InfoCard>
                        <IconBox>
                          <EmailIcon />
                        </IconBox>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {appointmentData.email}
                          </Typography>
                        </Box>
                      </InfoCard>

                      <InfoCard>
                        <IconBox color="#4caf50">
                          <LocationOnIcon />
                        </IconBox>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            Địa chỉ
                          </Typography>
                          <Typography variant="body1">
                            {appointmentData.address}
                          </Typography>
                        </Box>
                      </InfoCard>
                    </InfoBox>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <SectionTitle variant="h6">Thông tin cuộc hẹn</SectionTitle>

                    <InfoBox>
                      <InfoCard>
                        <IconBox color="#5c6bc0">
                          <LocalHospitalIcon />
                        </IconBox>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            Tiêu đề
                          </Typography>
                          <Typography variant="h6" fontWeight="medium">
                            {appointmentData.title}
                          </Typography>
                        </Box>
                      </InfoCard>

                      <InfoCard>
                        <IconBox color="#ec407a">
                          <DescriptionIcon />
                        </IconBox>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            Mô tả
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              bgcolor: alpha(
                                theme.palette.background.paper,
                                0.4
                              ),
                              p: 1.5,
                              borderRadius: 2,
                              mt: 1,
                              fontStyle: "italic",
                            }}
                          >
                            {appointmentData.description}
                          </Typography>
                        </Box>
                      </InfoCard>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                      >
                        <InfoCard sx={{ flex: 1 }}>
                          <IconBox color="#f57c00">
                            <EventIcon />
                          </IconBox>
                          <Box>
                            <Typography color="text.secondary" variant="body2">
                              Ngày hẹn
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatDate(appointmentData.start)}
                            </Typography>
                          </Box>
                        </InfoCard>

                        <InfoCard sx={{ flex: 1 }}>
                          <IconBox color="#009688">
                            <AccessTimeIcon />
                          </IconBox>
                          <Box>
                            <Typography color="text.secondary" variant="body2">
                              Thời gian
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {appointmentData.start.split(" ")[1]} -{" "}
                              {appointmentData.end.split(" ")[1]}
                            </Typography>
                          </Box>
                        </InfoCard>
                      </Box>
                    </InfoBox>
                  </Grid>
                </Grid>
              </StyledPaper>
            </>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: { xs: "100%", md: "calc(100% - 280px)" },
          bgcolor: "background.paper",
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} HD-Care. Bảo lưu mọi quyền.
        </Typography>
      </Box>
    </Box>
  );
};

export default AppointmentDetail;
