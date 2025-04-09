import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Container,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAccountCircle,
  MdVerified,
} from "react-icons/md";
import { FaCalendarAlt, FaUserAlt, FaVenusMars } from "react-icons/fa";
import { alpha } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
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

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(18),
  height: theme.spacing(18),
  border: `4px solid white`,
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
  },
}));

const InfoItem = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      p: 2,
      borderRadius: 2,
      transition: "all 0.2s",
      "&:hover": {
        backgroundColor: alpha("#f5f5f5", 0.8),
        transform: "translateX(8px)",
      },
    }}
  >
    <Box
      sx={{
        minWidth: 40,
        color: "#1976d2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: alpha("#1976d2", 0.08),
        p: 1,
        borderRadius: 1.5,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: 13, fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value || "Chưa cập nhật"}
      </Typography>
    </Box>
  </Box>
);

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(2),
  color: "#1976d2",
  position: "relative",
  paddingLeft: theme.spacing(1.5),
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "4px",
    backgroundColor: "#1976d2",
    borderRadius: "4px",
  },
}));

const PatientDetailAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;

  if (!patient) {
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
            Không tìm thấy thông tin bệnh nhân
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
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => navigate("/admin")}
          startIcon={<MdArrowBack />}
          variant="outlined"
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
          label={patient.enable ? "Đang hoạt động" : "Tạm dừng"}
          color={patient.enable ? "success" : "error"}
          variant="filled"
          sx={{
            fontSize: "0.85rem",
            fontWeight: 600,
            py: 2.5,
            borderRadius: 8,
          }}
        />
      </Box>

      {/* Thông tin bệnh nhân */}
      <StyledPaper>
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box sx={{ textAlign: "center" }}>
              <StyledAvatar
                alt={patient.name}
                src={patient.img}
                sx={{
                  mx: "auto",
                  bgcolor: patient.img ? "transparent" : "#1976d2",
                  fontSize: "2.5rem",
                }}
              >
                {!patient.img && patient.name
                  ? patient.name.charAt(0).toUpperCase()
                  : null}
              </StyledAvatar>

              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mr: 1 }}
                  >
                    {patient.name}
                  </Typography>
                  {patient.verified && <MdVerified color="#1976d2" size={20} />}
                </Box>

                <Chip
                  label={patient.username}
                  icon={<MdAccountCircle />}
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1, borderRadius: 4, fontWeight: 500 }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <SectionTitle>Thông tin cá nhân</SectionTitle>

            <InfoBox>
              <InfoItem
                icon={<MdEmail size={18} />}
                label="Email"
                value={patient.email}
              />

              <InfoItem
                icon={<MdPhone size={18} />}
                label="Số điện thoại"
                value={patient.phone}
              />

              <InfoItem
                icon={<FaVenusMars size={16} />}
                label="Giới tính"
                value={patient.gender}
              />

              <InfoItem
                icon={<FaCalendarAlt size={16} />}
                label="Ngày sinh"
                value={patient.dob}
              />

              <InfoItem
                icon={<MdLocationOn size={18} />}
                label="Địa chỉ"
                value={patient.address}
              />
            </InfoBox>
          </Grid>
        </Grid>
      </StyledPaper>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          p: 3,
          bgcolor: alpha("#f5f5f5", 0.7),
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontStyle: "italic" }}
        >
          Thông tin của bệnh nhân được bảo mật theo quy định của HD-Care. Chỉ
          người quản trị và bác sĩ được phép xem thông tin chi tiết.
        </Typography>
      </Box>
    </Container>
  );
};

export default PatientDetailAdmin;
