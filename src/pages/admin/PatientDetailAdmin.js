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
} from "@mui/material";
import { styled } from "@mui/system";
import { MdArrowBack } from "react-icons/md";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(1),
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(14),
  height: theme.spacing(14),
}));

const PatientDetailAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;

  if (!patient) {
    return (
      <Container>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Không tìm thấy thông tin bệnh nhân
        </Typography>
        <Button
          onClick={() => navigate("/admin")}
          startIcon={<MdArrowBack />}
          variant="outlined"
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Nút quay lại */}
      <Button
        onClick={() => navigate("/admin")}
        startIcon={<MdArrowBack />}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      {/* Thông tin bệnh nhân */}
      <StyledPaper>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <StyledAvatar alt={patient.name} src={patient.img} />
          <Box sx={{ ml: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {patient.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {patient.enable ? "Trạng thái: Active" : "Trạng thái: Inactive"}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "primary.main" }}
        >
          Thông tin chi tiết
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="body1">
                <strong>Email:</strong> {patient.email}
              </Typography>
              <Typography variant="body1">
                <strong>Số điện thoại:</strong> {patient.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Tên tài khoản:</strong> {patient.username}
              </Typography>
            </InfoBox>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="body1">
                <strong>Địa chỉ:</strong> {patient.address}
              </Typography>
              <Typography variant="body1">
                <strong>Giới tính:</strong> {patient.gender}
              </Typography>
              <Typography variant="body1">
                <strong>Ngày sinh:</strong> {patient.dob}
              </Typography>
            </InfoBox>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default PatientDetailAdmin;
