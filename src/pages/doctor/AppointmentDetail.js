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
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  LocalHospital as LocalHospitalIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import Sidebar from "../../components/doctor/Sidebar";
import { appointment } from "../../api/appointment";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState(null);

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

  const fetchData = async () => {
    try {
      const response = await appointment.getAppointmentById(id);
      if (response.code === 1000) {
        setAppointmentData(response.result);
      } else {
        console.error("Failed to fetch appointment data:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch appointment data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!appointmentData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        margin: "0 auto",
        marginLeft: "250px",
        paddingBottom: 8,
      }}
    >
      <Box maxWidth={200}>
        <Sidebar />
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
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
            label={appointmentData.status}
            color={getStatusColor(appointmentData.status)}
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Quay lại
        </Button>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={3}>
            {/* Thông tin bệnh nhân */}
            <Grid item xs={5}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Thông tin bệnh nhân
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Họ và tên
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {appointmentData.name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {appointmentData.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Địa chỉ
                    </Typography>
                    <Typography variant="body1">
                      {appointmentData.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

            {/* Thông tin cuộc hẹn */}
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Thông tin cuộc hẹn
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocalHospitalIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Tiêu đề
                    </Typography>
                    <Typography variant="body1">
                      {appointmentData.title}
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
                      {appointmentData.description}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EventIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Ngày hẹn
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(appointmentData.start)}
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
                      {appointmentData.start.split(" ")[1]} -{" "}
                      {appointmentData.end.split(" ")[1]}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AppointmentDetail;
