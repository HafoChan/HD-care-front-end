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

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState("Trang chủ");
  const [isBookingFormOpen, setBookingFormOpen] = useState(false); // State to handle form visibility

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };


  const handleBookingClick = () => {
    setBookingFormOpen(true);
  };

  const handleFormClose = () => {
    setBookingFormOpen(false);
  };
  return (
    <Box sx={{ backgroundColor: "#e0f7fa" }}>
      {/* Header */}
      <HeaderComponent
        selectedTab={selectedTab}
        handleTabClick={handleTabClick}
      />

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

      {/* Booking Form */}
      <BookingForm open={isBookingFormOpen} onClose={handleFormClose} />
    </Box>
  );
};

export default HomePage;
