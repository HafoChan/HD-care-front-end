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
} from "@mui/material";
import { styled } from "@mui/system";
import { MdArrowBack } from "react-icons/md";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: 24,
  marginBottom: 24,
  borderRadius: 8,
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

const DoctorDetailAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  if (!doctor) {
    return (
      <Container>
        <Typography>Không tìm thấy thông tin bác sĩ</Typography>
        <Button onClick={() => navigate("/admin")} startIcon={<MdArrowBack />}>
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Nút quay lại */}
      <Button
        variant="outlined"
        startIcon={<MdArrowBack />}
        onClick={() => navigate("/admin")}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      {/* Thông tin cơ bản */}
      <StyledPaper elevation={2}>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Avatar
            src={doctor.img}
            sx={{ width: 200, height: 200, borderRadius: 2 }}
            variant="square"
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              {doctor.name}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {doctor.clinicName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {doctor.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Số điện thoại:</strong> {doctor.phone}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Giới tính:</strong> {doctor.gender}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Giá khám:</strong> {doctor.price.toLocaleString("vi-VN")}{" "}
              VNĐ
            </Typography>
          </Box>
        </Box>
      </StyledPaper>

      {/* Địa chỉ */}
      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom>
          Địa chỉ phòng khám
        </Typography>
        <Typography variant="body1">
          {doctor.address}, {doctor.district}, {doctor.city}
        </Typography>
      </StyledPaper>

      {/* Chuyên môn */}
      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom>
          Chuyên môn
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {doctor.specialization}
        </Typography>
      </StyledPaper>

      {/* Kinh nghiệm */}
      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom>
          Kinh nghiệm
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {doctor.experience}
        </Typography>
      </StyledPaper>

      {/* Mô tả */}
      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom>
          Mô tả
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {doctor.description}
        </Typography>
      </StyledPaper>

      {/* Trạng thái */}
      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom>
          Trạng thái
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IOSSwitch checked={doctor.enable} onChange={() => {}} disabled />
          <Typography>
            {doctor.enable ? "Đang hoạt động" : "Ngừng hoạt động"}
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default DoctorDetailAdmin;
