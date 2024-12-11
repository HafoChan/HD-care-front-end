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
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  LocalHospital as LocalHospitalIcon,
  Event,
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

const AppointmentDetailPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [openPdf, setOpenPdf] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      let response;
      try {
        response = await appointment.getAppointmentById(id);
        console.log(response);
        if (response.code === 1000) {
          setAppointmentData(response.result);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
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
      }
    };
    fetchData();
  }, [id]);

  const handleViewPDF = async () => {
    try {
      const response = await fetch(
        `https://powerful-motivation-production.up.railway.app/api/v1/appointment/pdf/${id}?status=xem`,
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
      } else {
      }
      toast.success("Tạo pdf thành công");
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

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  if (!appointmentData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <HeaderComponent />
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Chi tiết cuộc hẹn
          </Typography>
          <Chip
            label={appointmentData?.status}
            color={getStatusColor(appointmentData?.status)}
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Quay lại
        </Button>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={3}>
            {/* Thông tin bác sĩ */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Thông tin bác sĩ
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Avatar
                  src={appointmentData?.img}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" color="primary" fontWeight={"bold"}>
                    Bác sĩ: {appointmentData?.nameDoctor}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{doctorInfo?.email}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Địa chỉ
                    </Typography>
                    <Typography variant="body1">
                      {doctorInfo?.district} - {doctorInfo?.city}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <ShoppingCartIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Giá
                    </Typography>
                    <Typography variant="body1">
                      {formatNumber(doctorInfo?.price)}đ
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ pt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<VisibilityIcon />}
                  disabled={appointmentData.status !== "COMPLETED"}
                  onClick={handleViewPDF}
                  sx={{ textTransform: "none" }}
                >
                  Xem đơn thuốc
                </Button>
              </Box>
            </Grid>

            {/* Thông tin cuộc hẹn */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Thông tin cuộc hẹn
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <AccountCircleIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Họ và tên
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {appointmentData?.name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocalHospitalIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Tiêu đề
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {appointmentData?.title}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <DescriptionIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Mô tả
                    </Typography>
                    <Typography variant="body1">
                      {appointmentData?.description}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Event color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Ngày hẹn
                    </Typography>
                    <Typography variant="body1">
                      {appointmentData?.start?.split(" ")[0]}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <AccessTimeIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Thời gian
                    </Typography>
                    <Typography variant="body1">
                      {appointmentData?.start?.split(" ")[1]} -{" "}
                      {appointmentData?.end?.split(" ")[1]}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Event color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Kết quả
                    </Typography>
                    <Typography variant="body1">
                      {appointmentData?.result}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog open={openPdf} onClose={handleClosePdf} fullWidth maxWidth="md">
        <DialogContent>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Prescription PDF"
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AppointmentDetailPatient;
