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
  Avatar,
  Dialog,
  DialogContent,
  CircularProgress,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  Divider,
  Stack,
  Fade,
  DialogTitle,
  DialogActions,
  Backdrop,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  LocalHospital as LocalHospitalIcon,
  Event,
  ArrowBack,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import HeaderComponent from "../../components/patient/HeaderComponent";
import { appointment } from "../../api/appointment";
import { doctor } from "../../api/doctor";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

const AppointmentDetailPatient = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [openPdf, setOpenPdf] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let response;
      try {
        response = await appointment.getAppointmentById(id);
        console.log(response);
        if (response.code === 1000) {
          setAppointmentData(response.result);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
        toast.error("Không thể tải thông tin cuộc hẹn");
      }

      try {
        const fetchDoctor = await doctor.getDoctorById(
          response?.result?.idDoctor
        );

        if (fetchDoctor.code === 1000) {
          setDoctorInfo(fetchDoctor.result);
          console.log(fetchDoctor);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error("Không thể tải thông tin bác sĩ");
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleViewPDF = async () => {
    try {
      toast.info("Đang tải đơn thuốc...");
      const response = await fetch(
        `http://localhost:8082/api/v1/appointment/pdf/${id}?status=xem`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log(response);

      // Kiểm tra dữ liệu phản hồi
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/pdf")) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        setOpenPdf(true);
        toast.success("Tạo pdf thành công");
      } else {
        toast.error("Không thể tải đơn thuốc");
      }
    } catch (error) {
      console.error("Error viewing PDF:", error);
      toast.error(error.message || "Có lỗi xảy ra khi hiển thị file PDF.");
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handleClosePdf = () => {
    setOpenPdf(false);
    setPdfUrl("");
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `don-thuoc-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Đã tải xuống đơn thuốc");
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  if (loading) {
    return (
      <Box>
        <HeaderComponent />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
          }}
        >
          <CircularProgress color="primary" />
          <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>
            Đang tải thông tin cuộc hẹn...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!appointmentData) {
    return (
      <Box>
        <HeaderComponent />
        <Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "70vh",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Không tìm thấy thông tin cuộc hẹn
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/appointment-list")}
              sx={{ mt: 2 }}
            >
              Quay lại danh sách
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.background.default, 0.8),
        minHeight: "100vh",
      }}
    >
      <HeaderComponent />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Fade in timeout={500}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                mb: 4,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Quay lại danh sách cuộc hẹn
            </Button>

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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4" fontWeight="700" color="primary.main">
                  Chi tiết cuộc hẹn
                </Typography>
                <Chip
                  label={getStatusText(appointmentData?.status)}
                  color={getStatusColor(appointmentData?.status)}
                  sx={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                    py: 1,
                    px: 1,
                  }}
                />
              </Box>
            </Paper>

            <Grid container spacing={3}>
              {/* Thông tin bác sĩ */}
              <Grid item xs={12} md={5}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 4px 20px ${alpha(
                      theme.palette.common.black,
                      0.05
                    )}`,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color="text.primary"
                      gutterBottom
                    >
                      Thông tin bác sĩ
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                      <Avatar
                        src={appointmentData?.img}
                        sx={{
                          width: 90,
                          height: 90,
                          mr: 3,
                          boxShadow: `0 4px 12px ${alpha(
                            theme.palette.common.black,
                            0.1
                          )}`,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          color="primary.main"
                          fontWeight={600}
                          gutterBottom
                        >
                          Bác sĩ {appointmentData?.nameDoctor}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Chuyên khoa:{" "}
                          {doctorInfo?.specialist?.split("\\")[0] ||
                            "Chưa cập nhật"}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={3}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <EmailIcon
                          sx={{ color: theme.palette.primary.main, mt: 0.5 }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Email liên hệ
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {doctorInfo?.email || "Chưa cập nhật"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <LocationOnIcon
                          sx={{ color: theme.palette.primary.main, mt: 0.5 }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Địa chỉ phòng khám
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {doctorInfo?.district && doctorInfo?.city
                              ? `${doctorInfo?.district} - ${doctorInfo?.city}`
                              : "Chưa cập nhật"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <ShoppingCartIcon
                          sx={{ color: theme.palette.primary.main, mt: 0.5 }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Giá tư vấn
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="primary.main"
                          >
                            {doctorInfo?.price
                              ? `${formatNumber(doctorInfo?.price)}đ`
                              : "Chưa cập nhật"}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>

                    {appointmentData.status === "COMPLETED" && (
                      <Box sx={{ mt: 4 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<VisibilityIcon />}
                          onClick={handleViewPDF}
                          fullWidth
                          sx={{
                            py: 1.2,
                            textTransform: "none",
                            borderRadius: 2,
                            fontWeight: 600,
                          }}
                        >
                          Xem đơn thuốc
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Thông tin cuộc hẹn */}
              <Grid item xs={12} md={7}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 4px 20px ${alpha(
                      theme.palette.common.black,
                      0.05
                    )}`,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color="text.primary"
                      gutterBottom
                    >
                      Thông tin cuộc hẹn
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <AccountCircleIcon
                            sx={{ color: theme.palette.primary.main, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Họ và tên bệnh nhân
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {appointmentData?.name || "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Event
                            sx={{ color: theme.palette.primary.main, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Ngày hẹn
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {appointmentData?.start?.split(" ")[0] ||
                                "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <LocalHospitalIcon
                            sx={{ color: theme.palette.primary.main, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Tiêu đề cuộc hẹn
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {appointmentData?.title || "Không có tiêu đề"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <AccessTimeIcon
                            sx={{ color: theme.palette.primary.main, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Thời gian hẹn
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {appointmentData?.start?.split(" ")[1]} -{" "}
                              {appointmentData?.end?.split(" ")[1]}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <DescriptionIcon
                            sx={{ color: theme.palette.primary.main, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Mô tả triệu chứng
                            </Typography>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2.5,
                                bgcolor: alpha(
                                  theme.palette.background.default,
                                  0.7
                                ),
                                borderRadius: 2,
                                border: `1px solid ${alpha(
                                  theme.palette.divider,
                                  0.1
                                )}`,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ whiteSpace: "pre-line" }}
                              >
                                {appointmentData?.description ||
                                  "Không có mô tả"}
                              </Typography>
                            </Paper>
                          </Box>
                        </Box>
                      </Grid>

                      {appointmentData?.status === "COMPLETED" && (
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 2,
                            }}
                          >
                            <CheckCircle
                              sx={{
                                color: theme.palette.success.main,
                                mt: 0.5,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                Kết quả khám bệnh
                              </Typography>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2.5,
                                  bgcolor: alpha(
                                    theme.palette.success.main,
                                    0.05
                                  ),
                                  borderRadius: 2,
                                  border: `1px solid ${alpha(
                                    theme.palette.success.main,
                                    0.2
                                  )}`,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{ whiteSpace: "pre-line" }}
                                >
                                  {appointmentData?.result || "Chưa có kết quả"}
                                </Typography>
                              </Paper>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>

      <Dialog
        open={openPdf}
        onClose={handleClosePdf}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Đơn thuốc
          </Typography>
          <Box>
            <IconButton onClick={handleDownloadPDF} title="Tải xuống">
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={handleClosePdf} edge="end">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Prescription PDF"
            style={{ border: "none" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePdf}
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Đóng
          </Button>
          <Button
            onClick={handleDownloadPDF}
            color="primary"
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Tải xuống
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default AppointmentDetailPatient;
