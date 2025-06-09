import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Container,
  Card,
  CardMedia,
  Stack,
  Grid,
  Paper,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("evaluate") == "1") {
      setEvaluateFormOpen(true); // Open evaluate form if the query parameter is present
    }
  }, []); // Run once on component mount

  const handleBookingClick = () => {
    navigate("/team-of-doctors"); // Navigate to the Team of Doctors page
  };

  const handleNewsClick = () => {
    navigate("/news"); // Navigate to the News page
  };

  const handleSocialClick = () => {
    navigate("/social-network"); // Navigate to the Social Network page
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

  const services = [
    {
      icon: (
        <MedicalServicesIcon
          fontSize="large"
          sx={{ color: theme.palette.primary.main }}
        />
      ),
      title: "Tư vấn Điều trị Da",
      description:
        "Đội ngũ bác sĩ giàu kinh nghiệm giúp giải quyết mọi vấn đề da liễu",
    },
    {
      icon: (
        <FaceRetouchingNaturalIcon
          fontSize="large"
          sx={{ color: theme.palette.primary.main }}
        />
      ),
      title: "Chăm sóc Da mặt",
      description:
        "Các liệu trình chăm sóc da chuyên sâu với công nghệ hiện đại",
    },
    {
      icon: (
        <ArticleIcon
          fontSize="large"
          sx={{ color: theme.palette.primary.main }}
        />
      ),
      title: "Tư vấn Dinh dưỡng",
      description: "Chế độ dinh dưỡng phù hợp giúp cải thiện sức khỏe làn da",
    },
    {
      icon: (
        <GroupIcon
          fontSize="large"
          sx={{ color: theme.palette.primary.main }}
        />
      ),
      title: "Cộng đồng Hỗ trợ",
      description: "Kết nối và chia sẻ kinh nghiệm chăm sóc da cùng cộng đồng",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Thị Minh",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      comment:
        "Dịch vụ tuyệt vời, bác sĩ tư vấn rất nhiệt tình và chuyên nghiệp. Làn da của tôi đã cải thiện rõ rệt sau 2 tháng điều trị.",
      position: "Khách hàng",
    },
    {
      name: "Trần Văn Hoàng",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      comment:
        "Đội ngũ y bác sĩ rất tận tâm, liệu trình được thiết kế phù hợp với làn da của tôi. Rất hài lòng với kết quả.",
      position: "Khách hàng",
    },
    {
      name: "Lê Thị Hương",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      comment:
        "Từ khi sử dụng dịch vụ của HD-Care, tôi không còn lo lắng về các vấn đề da nữa. Cảm ơn đội ngũ bác sĩ!",
      position: "Khách hàng",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${images.home_banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "70vh", md: "85vh" },
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={6}>
              <Box
                sx={{
                  color: "white",
                  textAlign: { xs: "center", md: "left" },
                  animation: "fadeIn 1s ease-in-out",
                  mt: -30,
                  // minWidth: 800,
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "2.2rem", sm: "2.5rem", md: "3.5rem" },
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  Vẻ đẹp <span style={{ color: "#FAC41C" }}>& </span>
                  sự tự tin
                </Typography>
                <Typography
                  variant="h3"
                  component="p"
                  sx={{
                    fontWeight: 500,
                    mb: 2,
                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  của bạn là niềm hạnh phúc{" "}
                  <Typography
                    sx={{
                      color: "#FAC41C",
                      fontWeight: 500,
                      fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    của chúng tôi
                  </Typography>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    maxWidth: "600px",
                    mx: { xs: "auto", md: 0 },
                    fontWeight: 400,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                  }}
                >
                  HD-Care là nơi hội tụ các bác sĩ da liễu hàng đầu Việt Nam với
                  nhiều năm kinh nghiệm trong nghề
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Floating Cards */}
        <Container
          maxWidth="lg"
          sx={{
            position: "absolute",
            bottom: { xs: "-250px", md: "-100px" },
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={10} lg={10}>
              <Paper
                elevation={4}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "white",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Grid container>
                  {!isSmall && (
                    <Grid
                      item
                      md={5}
                      sx={{
                        background: `url(${
                          images.home_banner ||
                          "https://img.freepik.com/free-photo/dermatologist-examining-patient-skin_23-2149353393.jpg"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: 300,
                      }}
                    />
                  )}
                  <Grid item xs={12} md={7}>
                    <Box sx={{ p: 4 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
                      >
                        LỢI ÍCH{" "}
                        <span style={{ color: "#FAC41C" }}>CỦA CHÚNG TÔI</span>
                      </Typography>
                      <Divider sx={{ mb: 3 }} />

                      <Stack spacing={2.5}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <CheckCircleIcon
                            sx={{ color: "primary.main", mr: 2, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Đặt lịch khám da mặt
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Dễ dàng đặt lịch với bác sĩ chuyên khoa da liễu
                              hàng đầu
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <CheckCircleIcon
                            sx={{ color: "primary.main", mr: 2, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Quy trình đặt lịch hẹn tiết kiệm thời gian
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Chỉ mất vài phút để hoàn tất đặt lịch và nhận xác
                              nhận
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <CheckCircleIcon
                            sx={{ color: "primary.main", mr: 2, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              Đặt lịch trực tuyến dễ dàng
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Đặt lịch qua website hoặc ứng dụng điện thoại mọi
                              lúc mọi nơi
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>

                      <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        sx={{
                          mt: 4,
                          mr: 2,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1.2,
                          px: 3,
                          boxShadow: "0 4px 14px rgba(250, 196, 28, 0.4)",
                          bgcolor: "#FAC41C",
                          transition: "all 0.3s ease",
                        }}
                        onClick={handleSocialClick}
                      >
                        CỘNG ĐỒNG
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          mt: 4,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1.2,
                          px: 3,
                          boxShadow: "0 4px 14px rgba(0, 118, 255, 0.3)",
                        }}
                        onClick={handleBookingClick}
                      >
                        ĐẶT LỊCH NGAY
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 20, md: 16 }, bgcolor: "#fafafa" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: "#FAC41C",
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
              }}
            >
              DỊCH VỤ CỦA CHÚNG TÔI
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Chăm sóc sức khỏe làn da của bạn
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: "auto",
                mb: 2,
              }}
            >
              HD-Care cung cấp các dịch vụ chăm sóc da chuyên nghiệp với đội ngũ
              bác sĩ giàu kinh nghiệm và trang thiết bị y tế hiện đại.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    p: 3,
                    transition: "all 0.3s ease",
                    border: "1px solid #eaeaea",
                    "&:hover": {
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      transform: "translateY(-10px)",
                      borderColor: "transparent",
                    },
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "white",
                  }}
                >
                  <Box sx={{ mb: 2 }}>{service.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 600, mb: 1.5 }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {service.description}
                  </Typography>
                  <Box sx={{ mt: "auto" }}>
                    <Button
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        p: 0,
                        "&:hover": {
                          background: "none",
                          color: "#FAC41C",
                        },
                      }}
                    >
                      Tìm hiểu thêm
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: "#f2f7ff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                  }}
                >
                  500+
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Khách hàng
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                  }}
                >
                  20+
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Bác sĩ
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                  }}
                >
                  15+
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Dịch vụ
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                  }}
                >
                  98%
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Khách hàng hài lòng
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: "#FAC41C",
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
              }}
            >
              KHÁCH HÀNG NÓI GÌ
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Phản hồi từ khách hàng
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: "auto",
                mb: 2,
              }}
            >
              Những chia sẻ từ khách hàng đã trải nghiệm dịch vụ của chúng tôi
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    p: 4,
                    border: "1px solid #eaeaea",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      transform: "translateY(-10px)",
                      borderColor: "transparent",
                    },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      mb: 4,
                      fontStyle: "italic",
                      fontSize: "1.05rem",
                      lineHeight: 1.6,
                    }}
                  >
                    "{testimonial.comment}"
                  </Typography>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mt: "auto" }}
                  >
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.position}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          bgcolor: "primary.main",
          color: "white",
          background: `linear-gradient(rgba(0, 66, 165, 0.9), rgba(0, 38, 97, 0.95)), url(${images.home_banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Bắt đầu hành trình chăm sóc sức khỏe làn da của bạn
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 700,
                mx: "auto",
                mb: 5,
                opacity: 0.9,
              }}
            >
              Đội ngũ bác sĩ chuyên môn cao của chúng tôi sẵn sàng tư vấn và
              điều trị các vấn đề về da giúp bạn lấy lại vẻ đẹp tự nhiên và sự
              tự tin.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  bgcolor: "#FAC41C",
                  color: "black",
                  "&:hover": {
                    bgcolor: "#e9b415",
                  },
                }}
                onClick={handleBookingClick}
              >
                Đặt lịch khám
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "#FAC41C",
                    color: "#FAC41C",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
                onClick={handleNewsClick}
              >
                Đọc bài viết
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

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
