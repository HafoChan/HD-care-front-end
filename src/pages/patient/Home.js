import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  Card,
  CardMedia,
  Stack,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import images from "../../constants/images";
import HeaderComponent from "../../components/patient/HeaderComponent";
import BookingForm from "./BookingForm";
import axiosClient from "../../api/axios-instance";
import EvaluateForm from "../../components/patient/evaluateForm";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HomePage = () => {
  const [isBookingFormOpen, setBookingFormOpen] = useState(false); // State to handle form visibility
  const [isEvaluateFormOpen, setEvaluateFormOpen] = useState(false); // State to handle evaluate form visibility
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("evaluate") == "1") {
      setEvaluateFormOpen(true); // Open evaluate form if the query parameter is present
    }
  }, []); // Run once on component mount

  const handleBookingClick = () => {
    navigate("/team-of-doctors"); // Navigate to the Team of Doctors page
  };

  const handleFormClose = () => {
    setBookingFormOpen(false);
  };

  const handleEvaluateClick = () => {
    setEvaluateFormOpen(true); // Open the evaluate form
    setBookingFormOpen(false); // Close the booking form if it's open
  };

  const handleEvaluateFormClose = () => {
    setEvaluateFormOpen(false); // Close the evaluate form
  };

  return (
    <Box sx={{ backgroundColor: "#e0f7fa", height: "100vh" }}>
      {/* Header */}
      <HeaderComponent />

      {/* Main Content */}
      <Container sx={{ py: 5 }}>
        <Box display="flex" flexDirection="row" spacing={3} alignItems="center">
          {/* Văn bản */}
          <Box xs={12} md={6}>
            <Typography
              variant="h4"
              color="primary"
              gutterBottom
              sx={{ paddingBottom: 5 }}
            >
              Vẻ đẹp <span style={{ color: "#42a5f5" }}>và </span>
              sự tự tin <span style={{ color: "#42a5f5" }}>của bạn là </span>
              niềm hạnh phúc
              <span style={{ color: "#42a5f5" }}> của chúng tôi</span>
            </Typography>

            <Stack direction="column" spacing={3}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                LỢI ÍCH <span style={{ color: "#42a5f5" }}>CỦA CHÚNG TÔI</span>
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <EventAvailableIcon color="primary" />
                <Typography variant="body1">Đặt lịch khám da mặt</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon color="primary" />
                <Typography variant="body1">
                  Quy trình đặt lịch hẹn tiết kiệm thời gian
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIphoneIcon color="primary" />
                <Typography variant="body1">
                  Đặt lịch trực tuyến dễ dàng qua website hoặc qua điện thoại
                </Typography>
              </Stack>
            </Stack>
            <Button
              variant="contained"
              color="warning"
              sx={{ mt: 4, borderRadius: "20px" }}
              onClick={handleBookingClick} // Show form on button click
            >
              ĐẶT LỊCH KHÁM NGAY
            </Button>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%", flexDirection: { xs: "column", md: "row" } }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  mt: 2,
                  mb: 4,
                  fontWeight: "bold",
                  fontStyle: "italic",
                  paddingX: 3,
                }}
              >
                Nơi hội tụ các bác sĩ da liễu hàng đầu Việt Nam với nhiều năm
                kinh nghiệm trong nghề
              </Typography>
              <Card sx={{ boxShadow: "none", borderRadius: "10px" }}>
                <CardMedia
                  component="img"
                  alt="Leading Dermatologists"
                  height="300"
                  image={images.home_banner}
                  title="Leading Dermatologists"
                  sx={{ borderRadius: "10px" }}
                />
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Evaluate Form */}
      {isEvaluateFormOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // Ensure it appears above other content
          }}
        >
          <EvaluateForm
            open={isEvaluateFormOpen}
            onClose={handleEvaluateFormClose}
          />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
