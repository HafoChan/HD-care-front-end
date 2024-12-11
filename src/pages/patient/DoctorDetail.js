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
} from "@mui/material";
import { schedule } from "../../api/schedule";
import reviewApi from "../../api/reviewApi";

const doctors = [
  { name: "BS CKII Lê Thị Thanh Thảo" },
  { name: "BS CKII Lê Thị Thanh Thảo" },
  { name: "BS CKII Lê Thị Thanh Thảo" },
  { name: "BS CKII Lê Thị Thanh Thảo" },
];

function ReviewSection() {
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
    <Box paddingX={"24px"} sx={{ bgcolor: "#1d8be4", color: "white", py: 4 }}>
      <Typography variant="h5" fontWeight={"bold"} mb={4} mt={2} align="center">
        Đánh giá của bệnh nhân
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3">{reviews.countAvg}</Typography>
            <Rating
              value={parseFloat(reviews.countAvg)}
              precision={0.1}
              readOnly
              size="large"
            />
            <Typography>({reviews.countReview} đánh giá)</Typography>
          </Box>

          {[5, 4, 3, 2, 1, 0].map((star) => (
            <Box
              key={star}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={() => handleRatingFilter(star)}
            >
              <Typography
                sx={{
                  minWidth: "60px",
                  color: filter.rating === star ? "#FFD700" : "white",
                }}
              >
                {star} sao
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  mx: 1,
                  height: 8,
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${
                      (getStarCount(star) / reviews.countReview) * 100
                    }%`,
                    height: "100%",
                    bgcolor: filter.rating === star ? "#FFD700" : "white",
                  }}
                />
              </Box>
              <Typography sx={{ minWidth: "40px" }}>
                {getStarCount(star)}
              </Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <select
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                }}
                onChange={(e) => handleSort(e.target.value)}
                value={filter.sortBy || ""}
              >
                <option
                  value=""
                  style={{ backgroundColor: "#077CDB", color: "white" }}
                >
                  Sắp xếp theo
                </option>
                <option
                  value="desc"
                  style={{ backgroundColor: "#077CDB", color: "white" }}
                >
                  Mới nhất
                </option>
                <option
                  value="asc"
                  style={{ backgroundColor: "#077CDB", color: "white" }}
                >
                  Cũ nhất
                </option>
              </select>

              <select
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                }}
                onChange={(e) => handleRatingFilter(Number(e.target.value))}
                value={filter.rating !== null ? filter.rating : ""}
              >
                <option
                  value=""
                  style={{ backgroundColor: "#077CDB", color: "white" }}
                >
                  Tất cả sao
                </option>
                {[5, 4, 3, 2, 1, 0].map((star) => (
                  <option
                    key={star}
                    value={star}
                    style={{ backgroundColor: "#077CDB", color: "white" }}
                  >
                    {star} sao
                  </option>
                ))}
              </select>
            </Box>
          </Box>

          {reviews?.reviewList?.map((review, index) => (
            <Card key={index} sx={{ mb: 2, bgcolor: "white" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight="bold"
                  >
                    {review.patient.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.date).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
                <Rating
                  value={parseFloat(review.rating)}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography color="text.primary" sx={{ mt: 1 }}>
                  {review.content}
                </Typography>
                {review?.img && review?.img?.length > 0 && (
                  <Box
                    sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}
                  >
                    {review?.img?.map((image, imgIndex) => (
                      <Box
                        key={imgIndex}
                        component="img"
                        src={image}
                        alt={`Review image ${imgIndex + 1}`}
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 1,
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "white",
                  borderColor: "white",
                },
                "& .Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2) !important",
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function OtherDoctorsSection() {
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

  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let scrollAmount = 0;
    const scrollStep = 1; // Adjust the scroll speed
    const scrollInterval = 20; // Adjust the scroll interval

    const scroll = () => {
      if (scrollContainer) {
        scrollAmount += scrollStep;
        scrollContainer.scrollLeft = scrollAmount;
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0; // Reset scroll amount to loop
        }
      }
    };

    const intervalId = setInterval(scroll, scrollInterval);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box sx={{ py: 4, px: "32px" }}>
      <Typography variant="h5" fontWeight={"bold"} mb={4} align="center" gutterBottom>
        Các Bác Sĩ Khác
      </Typography>

      <Grid container spacing={0} justifyContent="center">
        {otherDoctors.map((doctor, index) => (
          <Grid
            item
            xs={6}
            sm={3}
            key={doctor.id || index}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              sx={{
                textAlign: "center",
                py: 2,
                width: "180px",
                boxShadow: "none",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s ease-in-out"
                }
              }}
              onClick={() => handleDoctorClick(doctor.id)}
            >
              <Box
                component="img"
                src={doctor.img || "#"}
                sx={{
                  width: "160px",
                  height: "160px",
                  backgroundColor: "#cccccc",
                  margin: "0 auto",
                  borderRadius: "20px",
                  objectFit: "cover",
                }}
              />
              <Typography
                variant="subtitle1"
                fontWeight={"bold"}
                marginX={2}
                sx={{ mt: 1 }}
              >
                {doctor.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          onClick={() => window.location.href = '/team-of-doctors'}
          variant="contained"
          sx={{
            bgcolor: "#077CDB",
            color: "white",
            mt: 2,
            width: "150px",
          }}
        >
          Xem tất cả
        </Button>
      </Box>
    </Box>
  );
}

function DoctorDetail() {
  const [doctorInfo, setDoctorInfo] = useState();
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);

  const doctorId = window.location.pathname.split("/")[2];

  const today = new Date();

  const [formattedDate] = useState(() => {
    const localDate = new Date(today.getTime() + 7 * 60 * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
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
      }
    };

    fetchDoctorData();
  }, [doctorId]); // Chỉ phụ thuộc vào `doctorId`

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
        setAvailableTimes(response.result); // Cp nhật lịch khả dụng
      }
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  return (
    <Box width={"100%"} align="center">
      <Box maxWidth={"1200px"}>
        <HeaderComponent />
      </Box>

      <Box width={"100%"} backgroundColor="#1d8be4">
        <Box maxWidth={"1200px"} align="left">
          <DoctorProfileComponent doctorInfo={doctorInfo} />
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="white">
        <Box maxWidth={"1200px"} align="left">
          <AppointmentSchedulerComponent
            doctorInfo={doctorInfo}
            doctorId={doctorId}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            fetchAvailableTimes={fetchAvailableTimes}
            availableTimes={availableTimes} // Truyền lịch khả dụng
          />
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="#1d8be4">
        <Box maxWidth={"1200px"} align="left">
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#1d8be4",
              margin: "24px",
              boxShadow: "none",
              paddingY: "24px",
            }}
          >
            <CardContent sx={{ padding: "0px", color: "white" }}>
              <Typography
                variant="h5"
                fontWeight={"bold"}
                mb={4}
                mt={2}
                align="center"
              >
                {doctorInfo?.specialization}
              </Typography>
              <Box display={"flex"} gap={6} marginX={6}>
                {doctorInfo?.experience?.split(".").map((exp, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "2px solid white",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      justifyContent: "center",
                    }}
                  >
                    <Typography fontSize={"18px"} textAlign={"center"}>
                      {exp.trim()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="white" pb={4}>
        <Box maxWidth={"1200px"} align="left" paddingX={24}>
          <Typography variant="h5" fontWeight={"bold"} mb={2} mt={4}>
            Mô tả
          </Typography>
          <Typography
            component="span"
            sx={{ display: "block", marginBottom: "8px" }}
          >
            {doctorInfo?.description?.split(".").map(
              (sentence, index) =>
                sentence.trim() && (
                  <Typography
                    key={index}
                    component="span"
                    sx={{ display: "block", marginBottom: "8px" }}
                  >
                    • {sentence.trim()}
                  </Typography>
                )
            )}
          </Typography>

          <Typography variant="h5" fontWeight={"bold"} mb={2} mt={4}>
            Kinh nghiệm
          </Typography>
          <Typography>
            {doctorInfo?.experience?.split(".").map(
              (specialty, index) =>
                specialty.trim() && (
                  <Typography
                    key={index}
                    component="span"
                    sx={{ display: "block", marginBottom: "8px" }}
                  >
                    • {specialty.trim()}
                  </Typography>
                )
            )}
          </Typography>
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="#1d8be4">
        <Box maxWidth={"1200px"} align="left">
          <ReviewSection />
        </Box>
      </Box>

      <Box width={"100%"} backgroundColor="white">
        <Box maxWidth={"1200px"} align="left">
          <OtherDoctorsSection />
        </Box>
      </Box>
    </Box>
  );
}

export default DoctorDetail;
