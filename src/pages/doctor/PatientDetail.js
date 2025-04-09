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
  LinearProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WcIcon from "@mui/icons-material/Wc";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import VerifiedIcon from "@mui/icons-material/Verified";
import Sidebar from "../../components/doctor/Sidebar";
import patientApi from "../../api/patient";
import { alpha, useTheme, styled } from "@mui/material/styles";

// Styled components for enhanced UI
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 160,
  height: 160,
  border: `4px solid white`,
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
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

const PatientDetail = () => {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const theme = useTheme();

  const { id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await patientApi.getById(id);
      if (response.code === 1000) {
        setPatientData(response.result);
      } else {
        console.error("Failed to fetch patient data:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch patient data:", error.message);
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
      <Box maxWidth={280}>
        <Sidebar />
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: "280px" },
          transition: "margin 0.2s ease",
          py: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
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

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thông tin chi tiết bệnh nhân
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ width: "100%", mt: 8 }}>
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
              Đang tải thông tin bệnh nhân...
            </Typography>
          </Box>
        ) : !patientData ? (
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
              Không tìm thấy dữ liệu bệnh nhân
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
          <StyledPaper>
            <Grid container spacing={4}>
              {/* Avatar Section */}
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
                <StyledAvatar
                  src={patientData.img}
                  sx={{
                    bgcolor: patientData.img
                      ? "transparent"
                      : theme.palette.primary.main,
                    fontSize: "3.5rem",
                  }}
                >
                  {!patientData.img && patientData.name
                    ? patientData.name.charAt(0).toUpperCase()
                    : null}
                </StyledAvatar>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" sx={{ mr: 1 }}>
                      {patientData.name}
                    </Typography>
                    {patientData.verified && (
                      <Tooltip title="Đã xác thực">
                        <VerifiedIcon color="primary" />
                      </Tooltip>
                    )}
                  </Box>

                  <Chip
                    label={
                      patientData.enable ? "Đang hoạt động" : "Không hoạt động"
                    }
                    color={patientData.enable ? "success" : "error"}
                    variant="outlined"
                    sx={{ mt: 1, borderRadius: 20, fontWeight: 500 }}
                  />
                </Box>
              </Grid>

              {/* Information Section */}
              <Grid item xs={12} md={8}>
                <SectionTitle variant="h6">Thông tin cá nhân</SectionTitle>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoCard>
                      <IconBox>
                        <EmailIcon />
                      </IconBox>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {patientData.email}
                        </Typography>
                      </Box>
                    </InfoCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InfoCard>
                      <IconBox color="#4caf50">
                        <PhoneIcon />
                      </IconBox>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          Số điện thoại
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {patientData.phone || "Chưa cập nhật"}
                        </Typography>
                      </Box>
                    </InfoCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InfoCard>
                      <IconBox color="#9c27b0">
                        <WcIcon />
                      </IconBox>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          Giới tính
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          textTransform="capitalize"
                        >
                          {patientData.gender}
                        </Typography>
                      </Box>
                    </InfoCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InfoCard>
                      <IconBox color="#ff9800">
                        <CakeIcon />
                      </IconBox>
                      <Box>
                        <Typography color="text.secondary" variant="body2">
                          Ngày sinh
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(patientData.dob)}
                        </Typography>
                      </Box>
                    </InfoCard>
                  </Grid>

                  <Grid item xs={12}>
                    <InfoCard>
                      <IconBox color="#f44336">
                        <LocationOnIcon />
                      </IconBox>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography color="text.secondary" variant="body2">
                          Địa chỉ
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          sx={{
                            pl: 1,
                            mt: 0.5,
                            py: 1,
                            borderLeft: `3px solid ${theme.palette.primary.light}`,
                          }}
                        >
                          {patientData.address || "Chưa cập nhật địa chỉ"}
                        </Typography>
                      </Box>
                    </InfoCard>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="info.main"
                    sx={{ fontStyle: "italic" }}
                  >
                    Đây là thông tin cá nhân bệnh nhân. Vui lòng tuân thủ các
                    quy định về bảo mật thông tin bệnh nhân theo quy định của
                    HD-Care.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        )}
      </Container>

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

export default PatientDetail;
