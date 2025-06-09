import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/patient/HeaderComponent";
import DoctorProfileComponent from "../../components/patient/DoctorProfileComponent";
import AppointmentSchedulerComponent from "../../components/patient/AppointmentSchedulerComponent";
import { doctor } from "../../api/doctor";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Rating,
  Pagination,
  Container,
  Divider,
  Chip,
  Paper,
  alpha,
  useTheme,
  LinearProgress,
  Stack,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import { schedule } from "../../api/schedule";
import reviewApi from "../../api/reviewApi";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VideocamIcon from "@mui/icons-material/Videocam";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

function ReviewSection() {
  const theme = useTheme();
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({
    sortBy: null,
    rating: null,
  });
  const [page, setPage] = useState(1);
  const doctorId = window.location.pathname.split("/")[2];

  const getReview = async () => {
    const response = await reviewApi.getReview(
      doctorId,
      filter.sortBy,
      filter.rating,
      page
    );
    setReviews(response?.result);
    setTotalPages(response?.result?.pageMax);
  };

  useEffect(() => {
    getReview();
  }, [filter, page]);

  const handleSort = (type) => {
    setFilter((prev) => ({ ...prev, sortBy: type }));
  };

  const handleRatingFilter = (rating) => {
    const newRating = rating === filter.rating ? null : rating;
    setFilter((prev) => ({ ...prev, rating: newRating }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStarCount = (star) => {
    const ratingEntry = reviews?.countRating?.find(
      ([rating]) => rating === star
    );
    return ratingEntry ? ratingEntry[1] : 0;
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: theme.palette.primary.contrastText,
        py: 8,
        borderRadius: { xs: 0, md: "0 0 60px 60px" },
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg">
        <Zoom in timeout={800}>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={5}
            mt={2}
            align="center"
            sx={{
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                width: "60px",
                height: "4px",
                backgroundColor: theme.palette.primary.contrastText,
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "4px",
              },
            }}
          >
            Đánh giá của bệnh nhân
          </Typography>
        </Zoom>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Fade in timeout={1000}>
              <Box
                sx={{
                  textAlign: "center",
                  mb: 3,
                  p: 3,
                  backgroundColor: alpha(theme.palette.background.paper, 0.08),
                  borderRadius: 3,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: `1px solid ${alpha(
                    theme.palette.primary.contrastText,
                    0.1
                  )}`,
                  transform: "translateY(0)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#FFD700",
                    textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  {reviews?.countAvg || "0.0"}
                </Typography>
                <Rating
                  value={parseFloat(reviews?.countAvg) || 0}
                  precision={0.1}
                  readOnly
                  size="large"
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                  sx={{
                    my: 1,
                    "& .MuiRating-iconFilled": {
                      color: "#FFD700",
                    },
                    "& .MuiRating-iconEmpty": {
                      color: alpha(theme.palette.primary.contrastText, 0.3),
                    },
                  }}
                />
                <Typography sx={{ fontSize: "0.95rem", opacity: 0.9 }}>
                  ({reviews?.countReview || 0} đánh giá)
                </Typography>
              </Box>
            </Fade>

            <Fade in timeout={1200}>
              <Stack spacing={1.5} sx={{ px: 1 }}>
                {[5, 4, 3, 2, 1, 0].map((star) => (
                  <Box
                    key={star}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 2,
                      cursor: "pointer",
                      backgroundColor:
                        filter.rating === star
                          ? alpha(theme.palette.background.paper, 0.15)
                          : "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.1
                        ),
                      },
                    }}
                    onClick={() => handleRatingFilter(star)}
                  >
                    <Typography
                      sx={{
                        minWidth: "60px",
                        fontWeight: filter.rating === star ? 700 : 500,
                        color:
                          filter.rating === star
                            ? "#FFD700"
                            : theme.palette.primary.contrastText,
                      }}
                    >
                      {star} sao
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        mx: 1.5,
                        height: 8,
                        bgcolor: alpha(theme.palette.background.paper, 0.1),
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${
                            reviews?.countReview
                              ? (getStarCount(star) / reviews.countReview) * 100
                              : 0
                          }%`,
                          height: "100%",
                          bgcolor:
                            filter.rating === star
                              ? "#FFD700"
                              : alpha(theme.palette.primary.contrastText, 0.7),
                          borderRadius: 4,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        minWidth: "40px",
                        fontWeight: filter.rating === star ? 600 : 400,
                      }}
                    >
                      {getStarCount(star) || 0}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Fade>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Fade in timeout={1000}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    mb: 3,
                    p: 0.5,
                    borderRadius: 3,
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      0.08
                    ),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(
                      theme.palette.primary.contrastText,
                      0.1
                    )}`,
                  }}
                >
                  <Button
                    variant={!filter.sortBy ? "contained" : "text"}
                    onClick={() => handleSort(null)}
                    startIcon={<FilterListIcon />}
                    sx={{
                      flex: 1,
                      color: !filter.sortBy
                        ? theme.palette.primary.main
                        : theme.palette.primary.contrastText,
                      backgroundColor: !filter.sortBy
                        ? theme.palette.primary.contrastText
                        : "transparent",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: !filter.sortBy
                          ? theme.palette.primary.contrastText
                          : alpha(theme.palette.primary.contrastText, 0.1),
                      },
                    }}
                  >
                    Tất cả
                  </Button>
                  <Button
                    variant={filter.sortBy === "desc" ? "contained" : "text"}
                    onClick={() => handleSort("desc")}
                    startIcon={
                      <SortIcon sx={{ transform: "rotate(180deg)" }} />
                    }
                    sx={{
                      flex: 1,
                      color:
                        filter.sortBy === "desc"
                          ? theme.palette.primary.main
                          : theme.palette.primary.contrastText,
                      backgroundColor:
                        filter.sortBy === "desc"
                          ? theme.palette.primary.contrastText
                          : "transparent",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor:
                          filter.sortBy === "desc"
                            ? theme.palette.primary.contrastText
                            : alpha(theme.palette.primary.contrastText, 0.1),
                      },
                    }}
                  >
                    Mới nhất
                  </Button>
                  <Button
                    variant={filter.sortBy === "asc" ? "contained" : "text"}
                    onClick={() => handleSort("asc")}
                    startIcon={<SortIcon />}
                    sx={{
                      flex: 1,
                      color:
                        filter.sortBy === "asc"
                          ? theme.palette.primary.main
                          : theme.palette.primary.contrastText,
                      backgroundColor:
                        filter.sortBy === "asc"
                          ? theme.palette.primary.contrastText
                          : "transparent",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor:
                          filter.sortBy === "asc"
                            ? theme.palette.primary.contrastText
                            : alpha(theme.palette.primary.contrastText, 0.1),
                      },
                    }}
                  >
                    Cũ nhất
                  </Button>
                </Stack>
              </Fade>

              <Stack spacing={2} sx={{ mt: 3 }}>
                {reviews?.reviewList?.length === 0 && (
                  <Fade in timeout={800}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 5,
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.08
                        ),
                        borderRadius: 3,
                        border: `1px solid ${alpha(
                          theme.palette.primary.contrastText,
                          0.1
                        )}`,
                      }}
                    >
                      <Typography variant="h6">Chưa có đánh giá nào</Typography>
                      <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                        Hãy là người đầu tiên đánh giá bác sĩ này.
                      </Typography>
                    </Box>
                  </Fade>
                )}

                {reviews?.reviewList?.map((review, index) => (
                  <Fade key={index} in timeout={800 + index * 100}>
                    <Card
                      sx={{
                        mb: 2,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                        },
                        position: "relative",
                      }}
                    >
                      <FormatQuoteIcon
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          fontSize: 40,
                          color: alpha(theme.palette.primary.main, 0.1),
                          transform: "scaleX(-1)",
                        }}
                      />
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1.5,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                fontWeight: 600,
                                mr: 1.5,
                              }}
                            >
                              {review.patient?.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                color="text.primary"
                                fontWeight={600}
                              >
                                {review.patient.name}
                              </Typography>
                              <Rating
                                value={parseFloat(review.rating)}
                                precision={0.5}
                                readOnly
                                size="small"
                                sx={{ mt: 0.2 }}
                              />
                            </Box>
                          </Box>
                          <Chip
                            label={new Date(review.date).toLocaleString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                            size="small"
                            icon={<AccessTimeIcon fontSize="small" />}
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                              fontSize: "0.75rem",
                              mr: 4,
                            }}
                          />
                        </Box>

                        <Typography
                          color="text.primary"
                          variant="body2"
                          sx={{
                            mt: 1.5,
                            mb: 1,
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {review.content}
                        </Typography>

                        {review?.img && review?.img?.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mt: 2,
                              flexWrap: "wrap",
                            }}
                          >
                            {review?.img?.map((image, imgIndex) => (
                              <Box
                                key={imgIndex}
                                component="img"
                                src={image}
                                alt={`Review image ${imgIndex + 1}`}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 2,
                                  cursor: "pointer",
                                  border: `1px solid ${alpha(
                                    theme.palette.primary.main,
                                    0.2
                                  )}`,
                                  transition: "transform 0.2s ease",
                                  "&:hover": {
                                    transform: "scale(1.05)",
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Fade>
                ))}
              </Stack>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages || 1}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: theme.palette.primary.contrastText,
                    borderColor: alpha(theme.palette.primary.contrastText, 0.5),
                  },
                  "& .Mui-selected": {
                    backgroundColor: `${theme.palette.primary.contrastText} !important`,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                  "& .MuiPaginationItem-ellipsis": {
                    color: theme.palette.primary.contrastText,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function OtherDoctorsSection() {
  const theme = useTheme();
  const [otherDoctors, setOtherDoctors] = useState([]);
  const doctorId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchOtherDoctors = async () => {
      try {
        const response = await doctor.getOtherDoctor(doctorId);
        if (response?.result) {
          setOtherDoctors(response.result);
        }
      } catch (error) {
        console.error("Error fetching other doctors:", error);
      }
    };

    fetchOtherDoctors();
  }, [doctorId]);

  const handleDoctorClick = (doctorId) => {
    window.location.href = `/doctor/${doctorId}`;
  };

  return (
    <Box
      sx={{
        py: 8,
        px: { xs: 2, md: "32px" },
        backgroundColor: alpha(theme.palette.background.default, 0.5),
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight={700}
          mb={5}
          align="center"
          sx={{
            position: "relative",
            color: theme.palette.primary.main,
            "&:after": {
              content: '""',
              position: "absolute",
              width: "60px",
              height: "4px",
              backgroundColor: theme.palette.primary.main,
              bottom: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: "4px",
            },
          }}
        >
          Các Bác Sĩ Khác
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {otherDoctors.map((doctor, index) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              key={doctor.id || index}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                  },
                }}
                onClick={() => handleDoctorClick(doctor.id)}
              >
                <Box sx={{ position: "relative", pt: "100%" }}>
                  <Box
                    component="img"
                    src={doctor.img || "#"}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      mt: 1,
                      fontSize: "1rem",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {doctor.name}
                  </Typography>
                  {doctor.specialization && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mt: 0.5,
                        fontSize: "0.85rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {doctor.specialization}
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={5}>
          <Button
            onClick={() => (window.location.href = "/team-of-doctors")}
            variant="contained"
            color="primary"
            sx={{
              py: 1.2,
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: theme.shadows[4],
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            Xem tất cả bác sĩ
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

function DoctorDetail() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState();
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const doctorId = window.location.pathname.split("/")[2];

  const today = new Date();

  const [formattedDate] = useState(() => {
    const localDate = new Date(today.getTime() + 7 * 60 * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  });

  useEffect(() => {
    document.title = "Chi tiết bác sĩ | HD-Care";

    const fetchDoctorData = async () => {
      setLoading(true);
      try {
        const [scheduleResponse, doctorResponse] = await Promise.all([
          schedule.getScheduleByDoctorAndDate(doctorId, formattedDate),
          doctor.getDoctorById(doctorId),
        ]);

        if (scheduleResponse.code === 1000) {
          setDoctorSchedule(scheduleResponse.result);
          setAvailableTimes(scheduleResponse.result);
        }

        setDoctorInfo(doctorResponse.result);
        setSelectedDate(formattedDate);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();

    return () => {
      document.title = "HD-Care";
    };
  }, [doctorId, formattedDate]);

  const fetchAvailableTimes = async (date) => {
    if (!date) return; // Tránh gọi API nếu không có ngày

    try {
      const response = await schedule.getScheduleByDoctorAndDate(
        doctorId,
        date
      );
      console.log(response);

      if (response.code === 1000) {
        console.log(response.result);
        setAvailableTimes(response.result); // Cập nhật lịch khả dụng
      }
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  const handleVideoCall = () => {
    navigate(`/video-call/${doctorId}`);
  };

  const handleChat = () => {
    navigate(`/chat/${doctorId}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        position: "relative",
      }}
    >
      {/* Doctor Profile Section - Gradient Background */}
      <Box
        sx={{
          width: "100%",
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          py: 6,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "600px",
            height: "600px",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.primary.contrastText,
              0.1
            )} 0%, ${alpha(theme.palette.primary.contrastText, 0)} 70%)`,
            top: "-300px",
            right: "-100px",
            borderRadius: "50%",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "400px",
            height: "400px",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.primary.contrastText,
              0.05
            )} 0%, ${alpha(theme.palette.primary.contrastText, 0)} 70%)`,
            bottom: "-200px",
            left: "10%",
            borderRadius: "50%",
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box>
              <DoctorProfileComponent doctorInfo={doctorInfo} />
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Appointment Scheduler Section */}
      <Box sx={{ width: "100%", py: 6 }} id="appointment-scheduler">
        <Container maxWidth="lg">
          <Zoom in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                transform: "translateY(-40px)",
                mb: 3,
              }}
            >
              <AppointmentSchedulerComponent
                doctorInfo={doctorInfo}
                doctorId={doctorId}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                fetchAvailableTimes={fetchAvailableTimes}
                availableTimes={availableTimes} // Truyền lịch khả dụng
              />
            </Paper>
          </Zoom>
        </Container>
      </Box>

      {/* Specialization Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
          py: 6,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${alpha(
              theme.palette.primary.main,
              0.3
            )}, transparent)`,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(to right, transparent, ${alpha(
              theme.palette.primary.main,
              0.3
            )}, transparent)`,
          },
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                mb={4}
                color={theme.palette.primary.main}
              >
                Trình độ chuyên môn
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {doctorInfo?.specialization?.split("\\").map(
                  (exp, index) =>
                    exp.trim() && (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Zoom in timeout={800 + index * 150}>
                          <Box
                            sx={{
                              borderRadius: 3,
                              p: 3,
                              height: "100%",
                              backgroundColor: theme.palette.background.paper,
                              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                                borderColor: alpha(
                                  theme.palette.primary.main,
                                  0.5
                                ),
                              },
                              border: `1px solid ${alpha(
                                theme.palette.divider,
                                0.15
                              )}`,
                              position: "relative",
                              overflow: "hidden",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "4px",
                                height: "100%",
                                backgroundColor: theme.palette.primary.main,
                              },
                            }}
                          >
                            <Typography
                              fontSize={"1rem"}
                              textAlign={"left"}
                              fontWeight={500}
                              lineHeight={1.6}
                              pl={1}
                            >
                              {exp.trim()}
                            </Typography>
                          </Box>
                        </Zoom>
                      </Grid>
                    )
                )}
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Description and Experience Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={3}
                    color={theme.palette.primary.main}
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        width: "100%",
                        height: "3px",
                        backgroundColor: theme.palette.primary.main,
                        bottom: "-8px",
                        left: 0,
                        borderRadius: "2px",
                      },
                    }}
                  >
                    Mô tả
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: alpha(
                        theme.palette.background.default,
                        0.5
                      ),
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    }}
                  >
                    {doctorInfo?.description?.split("\\").map(
                      (sentence, index) =>
                        sentence.trim() && (
                          <Fade key={index} in timeout={800 + index * 100}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 1.5,
                                p: 1.5,
                                borderRadius: 2,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.05
                                  ),
                                },
                                transition: "background-color 0.2s ease",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor: theme.palette.primary.main,
                                  mt: 1,
                                  mr: 1.5,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: theme.palette.text.primary,
                                  lineHeight: 1.6,
                                }}
                              >
                                {sentence.trim()}
                              </Typography>
                            </Box>
                          </Fade>
                        )
                    )}
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={3}
                    color={theme.palette.primary.main}
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        width: "100%",
                        height: "3px",
                        backgroundColor: theme.palette.primary.main,
                        bottom: "-8px",
                        left: 0,
                        borderRadius: "2px",
                      },
                    }}
                  >
                    Kinh nghiệm
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: alpha(
                        theme.palette.background.default,
                        0.5
                      ),
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    }}
                  >
                    {doctorInfo?.experience?.split("\\").map(
                      (specialty, index) =>
                        specialty.trim() && (
                          <Fade key={index} in timeout={1000 + index * 100}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 1.5,
                                p: 1.5,
                                borderRadius: 2,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.05
                                  ),
                                },
                                transition: "background-color 0.2s ease",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor: theme.palette.primary.main,
                                  mt: 1,
                                  mr: 1.5,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  color: theme.palette.text.primary,
                                  lineHeight: 1.6,
                                }}
                              >
                                {specialty.trim()}
                              </Typography>
                            </Box>
                          </Fade>
                        )
                    )}
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Reviews Section */}
      <ReviewSection />

      {/* Other Doctors Section */}
      <OtherDoctorsSection />

      {/* Video Call Button */}
      <Fab
        color="primary"
        aria-label="video call"
        onClick={handleVideoCall}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <VideocamIcon />
      </Fab>

      {/* Chat Button */}
      <Fab
        color="secondary"
        aria-label="chat"
        onClick={handleChat}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 90,
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <ChatIcon />
      </Fab>
    </Box>
  );
}

export default DoctorDetail;
