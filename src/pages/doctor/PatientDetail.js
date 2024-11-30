import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
  Container,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WcIcon from "@mui/icons-material/Wc";
import Sidebar from "../../components/doctor/Sidebar";
import patientApi from "../../api/patient";

const PatientDetail = () => {
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await patientApi.getById(id);
      if (response.code === 1000) {
        setPatientData(response.result);
      } else {
        console.error("Failed to fetch patient data:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch patient data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Kiểm tra nếu patientData là null và hiển thị loading
  if (!patientData) {
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
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
          Thông tin chi tiết bệnh nhân
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            {/* Avatar Section */}
            <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
              <Avatar
                src={patientData.img}
                sx={{
                  width: 150,
                  height: 150,
                  margin: "0 auto",
                  border: "3px solid #f5f5f5",
                }}
              >
                {patientData.name?.charAt(0)}
              </Avatar>
            </Grid>

            {/* Information Section */}
            <Grid item xs={12} md={9}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Họ và tên
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {patientData.name}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{patientData.email}</Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Số điện thoại
                    </Typography>
                    <Typography variant="body1">
                      {patientData.phone || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <WcIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Giới tính
                    </Typography>
                    <Typography variant="body1" textTransform="capitalize">
                      {patientData.gender}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CakeIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Ngày sinh
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(patientData.dob)}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Địa chỉ
                    </Typography>
                    <Typography variant="body1">
                      {patientData.address}
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

export default PatientDetail;
