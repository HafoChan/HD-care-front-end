import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Container,
  Switch,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  MdArrowBack,
  MdLocationOn,
  MdPerson,
  MdEmail,
  MdPhone,
  MdAttachMoney,
  MdVerified,
} from "react-icons/md";
import { alpha } from "@mui/material/styles";
import {
  FaUserMd,
  FaClipboardList,
  FaRegHospital,
  FaRegLightbulb,
} from "react-icons/fa";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: 32,
  marginBottom: 24,
  borderRadius: 16,
  transition: "transform 0.2s, box-shadow 0.2s",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.09)",
  },
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    background: "linear-gradient(90deg, #1976d2, #64b5f6)",
    opacity: 0.8,
  },
}));

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(() => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2ECA45",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: "background-color 500ms",
  },
}));

const SectionTitle = styled(Typography)(() => ({
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 16,
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#1976d2",
  "& svg": {
    backgroundColor: alpha("#1976d2", 0.08),
    padding: 8,
    borderRadius: 8,
    boxSizing: "content-box",
    color: "#1976d2",
  },
}));

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    <Box
      sx={{
        minWidth: 40,
        color: "#1976d2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const DoctorDetailAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  if (!doctor) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Không tìm thấy thông tin bác sĩ
          </Typography>
          <Button
            onClick={() => navigate("/admin")}
            startIcon={<MdArrowBack />}
            variant="contained"
            sx={{
              mt: 2,
              borderRadius: 8,
              px: 3,
              py: 1,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontWeight: 500,
            }}
          >
            Quay lại
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
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
          startIcon={<MdArrowBack />}
          onClick={() => navigate("/admin")}
          sx={{
            borderRadius: 8,
            px: 3,
            py: 1,
            textTransform: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
            borderWidth: 1.5,
            "&:hover": {
              borderWidth: 1.5,
              backgroundColor: alpha("#1976d2", 0.04),
            },
          }}
        >
          Quay lại
        </Button>

        <Chip
          label={doctor.enable ? "Đang hoạt động" : "Ngừng hoạt động"}
          color={doctor.enable ? "success" : "error"}
          variant="filled"
          sx={{
            fontSize: "0.85rem",
            fontWeight: 600,
            py: 2.5,
            borderRadius: 8,
          }}
        />
      </Box>

      {/* Thông tin cơ bản */}
      <StyledPaper elevation={1}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={doctor.img}
              sx={{
                width: 220,
                height: 220,
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "4px solid white",
              }}
              variant="rounded"
            />
            <Box sx={{ mt: 2, width: "100%", textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mr: 1 }}>
                  {doctor.name}
                </Typography>
                {doctor.verified && <MdVerified size={22} color="#1976d2" />}
              </Box>
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontWeight: 600,
                  mt: 0.5,
                  fontSize: "1.1rem",
                  opacity: 0.85,
                }}
              >
                {doctor.clinicName}
              </Typography>
              <Chip
                label={`${doctor.price.toLocaleString("vi-VN")} VNĐ`}
                color="primary"
                variant="outlined"
                icon={<MdAttachMoney />}
                sx={{ mt: 2, borderRadius: 6, fontWeight: 500 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <SectionTitle>
              <FaUserMd size={20} />
              Thông tin cá nhân
            </SectionTitle>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={<MdEmail size={20} />}
                  label="Email"
                  value={doctor.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={<MdPhone size={20} />}
                  label="Số điện thoại"
                  value={doctor.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={<MdPerson size={20} />}
                  label="Giới tính"
                  value={doctor.gender}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, opacity: 0.6 }} />

            <SectionTitle>
              <MdLocationOn size={20} />
              Địa chỉ phòng khám
            </SectionTitle>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
                color: "text.primary",
                bgcolor: alpha("#f5f5f5", 0.5),
                p: 2,
                borderRadius: 2,
                boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
              }}
            >
              {doctor.address}, {doctor.district}, {doctor.city}
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Chuyên môn */}
      <StyledPaper elevation={1}>
        <SectionTitle>
          <FaClipboardList size={20} />
          Chuyên môn
        </SectionTitle>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            lineHeight: 1.7,
            color: "text.primary",
            bgcolor: alpha("#f5f5f5", 0.5),
            p: 2,
            borderRadius: 2,
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
          }}
        >
          {doctor.specialization}
        </Typography>
      </StyledPaper>

      {/* Kinh nghiệm */}
      <StyledPaper elevation={1}>
        <SectionTitle>
          <FaRegHospital size={20} />
          Kinh nghiệm
        </SectionTitle>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            lineHeight: 1.7,
            color: "text.primary",
            bgcolor: alpha("#f5f5f5", 0.5),
            p: 2,
            borderRadius: 2,
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
          }}
        >
          {doctor.experience}
        </Typography>
      </StyledPaper>

      {/* Mô tả */}
      <StyledPaper elevation={1}>
        <SectionTitle>
          <FaRegLightbulb size={20} />
          Mô tả
        </SectionTitle>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            lineHeight: 1.7,
            color: "text.primary",
            bgcolor: alpha("#f5f5f5", 0.5),
            p: 2,
            borderRadius: 2,
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
          }}
        >
          {doctor.description}
        </Typography>
      </StyledPaper>

      {/* Trạng thái */}
      <StyledPaper elevation={1}>
        <SectionTitle>
          <FaUserMd size={20} />
          Trạng thái
        </SectionTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: alpha(doctor.enable ? "#4caf50" : "#f44336", 0.08),
            p: 2,
            borderRadius: 2,
          }}
        >
          <IOSSwitch checked={doctor.enable} onChange={() => {}} disabled />
          <Typography
            sx={{
              fontWeight: 500,
              color: doctor.enable ? "#2e7d32" : "#c62828",
            }}
          >
            {doctor.enable ? "Đang hoạt động" : "Ngừng hoạt động"}
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default DoctorDetailAdmin;
