import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Paper,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import HeaderComponent from "../../components/patient/HeaderComponent";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { doctor } from "../../api/doctor";
import { schedule } from "../../api/schedule";
import BookingForm from "./BookingForm";

const TeamOfDoctors = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Trang chủ");
  const [doctors, setDoctors] = useState([]);
  const [doctorSelected, setDoctorSelected] = useState();
  const [selectedDates, setSelectedDates] = useState({});

  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [selectedDateClick, setSelectedDateClick] = useState();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const handleDateChange = async (doctorId, date) => {
    setSelectedDates((prev) => ({ ...prev, [doctorId]: date }));

    try {
      const response = await schedule.getScheduleByDoctorAndDate(
        doctorId,
        date
      );
      if (response.code === 1000) {
        const updatedSchedules = response.result; // Lịch mới từ API

        // Tạo bản sao danh sách bác sĩ và chỉ cập nhật lịch của bác sĩ được chọn
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.id === doctorId
              ? { ...doctor, schedules: updatedSchedules }
              : doctor
          )
        );
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await doctor.filterDoctor(1);
      console.log(response);
      setDoctors(response.result);

      // Khởi tạo selectedDates với ngày hiện tại cho tất cả bác sĩ
      const initialSelectedDates = {};
      response.result.forEach((doctor) => {
        const today = new Date();
        // Điều chỉnh thời gian theo múi giờ Việt Nam (UTC+7)
        const localDate = new Date(today.getTime() + 7 * 60 * 60 * 1000);
        const formattedDate = localDate.toISOString().split("T")[0];
        initialSelectedDates[doctor.id] = formattedDate;
      });
      setSelectedDates(initialSelectedDates);
    };
    fetchDoctors();
  }, []);

  const handleScheduleClick = (date, doctor, scheduleId) => {
    const selectedSchedule = doctor.schedules.find(
      (schedule) => schedule.id === scheduleId
    ); // Tìm lịch đã chọn
    setSelectedDateClick(date);
    setDoctorSelected(doctor);
    setSelectedSchedule(selectedSchedule);
    setIsBookingFormOpen(true);
  };

  const handleDoctorClick = (doctor) => {
    navigate(`/doctor/${doctor.id}`); // Điều hướng đến trang DoctorDetail
  };

  return (
    <Box align="center" backgroundColor="#c1e3ff" sx={{ minHeight: "100vh" }}>
      {/* Header */}
      <HeaderComponent
        selectedTab={selectedTab}
        handleTabClick={handleTabClick}
      />

      <Box container maxWidth={"1200px"}>
        <Box
          display={"flex"}
          item
          xs={12}
          sm={6}
          md={4}
          maxWidth={"1200px"}
          paddingX={"24px"}
          marginY={"24px"}
          alignItems={"center"}
        >
          <Box>
            <FormControl
              sx={{
                m: 1,
                minWidth: 180,
                backgroundColor: "white",
                borderRadius: "4px",
                ml: 0,
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label">Chuyên khoa</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Chuyên khoa"
              >
                <MenuItem value={1}>Chuyên khoa 1</MenuItem>
                <MenuItem value={2}>Chuyên khoa 2</MenuItem>
                <MenuItem value={3}>Chuyên khoa 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              sx={{
                m: 1,
                minWidth: 160,
                backgroundColor: "white",
                borderRadius: "4px",
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label">Khu vực</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Khu vực"
              >
                <MenuItem value={1}>Khu vực 1</MenuItem>
                <MenuItem value={2}>Khu vực 2</MenuItem>
                <MenuItem value={3}>Khu vực 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              sx={{
                m: 1,
                minWidth: 250,
                backgroundColor: "white",
                borderRadius: "4px",
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label">Giá</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Giá"
              >
                <MenuItem value={1}>Dưới 200.000đ</MenuItem>
                <MenuItem value={2}>Từ 200.000đ - 500.000đ</MenuItem>
                <MenuItem value={3}>Trên 500.000đ</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            sx={{
              height: "40px",
              justifyContent: "center",
              flexGrow: 1,
              backgroundColor: "white",
              borderRadius: "4px",
              ml: 1,
            }}
            variant="outlined"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <Box
                  style={{
                    marginRight: "20px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <SearchIcon style={{ color: "#576064" }} />
                </Box>
              ),
              sx: { height: "40px" },
            }}
          />
        </Box>
      </Box>

      <Box container spacing={3} maxWidth={"1200px"} align="center">
        {doctor &&
          doctors.map((doctor) => (
            <Box
              item
              xs={12}
              sm={6}
              md={4}
              key={doctor.id}
              maxWidth={"1200px"}
              padding={"24px"}
            >
              <Paper
                elevation={3}
                style={{
                  display: "flex",
                  padding: "20px",
                  justifyContent: "space-around",
                  cursor: "pointer",
                }}
                onClick={() => handleDoctorClick(doctor)}
              >
                <img
                  src={doctor.imageUrl || "default_image_url"} // Thay đổi theo cấu trúc dữ liệu của bạn
                  style={{
                    width: "150px",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
                <Box align="left" width={"600px"} paddingX={"10px"}>
                  <Typography
                    variant="h6"
                    fontWeight={"bold"}
                    style={{ margin: "2px 0" }}
                  >
                    {doctor.name}
                  </Typography>
                  <Typography variant="body2" style={{ margin: "2px 0" }}>
                    {doctor.experience}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={"bold"}
                    style={{ margin: "2px 0" }}
                  >
                    LỊCH KHÁM
                  </Typography>
                  {doctor.schedules.map((schedule, index) => (
                    <Button
                      key={schedule.id}
                      variant="outlined"
                      style={{ margin: "5px" }}
                      onClick={() =>
                        handleScheduleClick(
                          selectedDates[doctor.id],
                          doctor,
                          schedule.id
                        )
                      }
                    >
                      {schedule.start} - {schedule.end}
                    </Button>
                  ))}
                </Box>

                <Box align="left" width={"230px"}>
                  <TextField
                    label="Chọn ngày khám"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginTop: "20px" }}
                    inputProps={{
                      min: today.toISOString().split("T")[0],
                      max: maxDate.toISOString().split("T")[0],
                    }}
                    value={
                      selectedDates[doctor.id] ||
                      today.toISOString().split("T")[0]
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateChange(doctor.id, selectedDates[doctor.id]);
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1,
                      marginY: 2,
                    }}
                  >
                    <LocationOnIcon fontSize="small" />
                    <Typography
                      variant="body2"
                      fontWeight={"bold"}
                      style={{ margin: "2px 0" }}
                    >
                      {doctor.district} - {doctor.city}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="#ff9c00"
                    fontWeight={"bold"}
                    style={{ margin: "2px 4px" }}
                  >
                    <span style={{ color: "#000000" }}>Giá khám:</span>{" "}
                    {doctor.price}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
      </Box>

      <BookingForm
        open={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        doctor={doctorSelected}
        schedule={selectedSchedule}
        selectedDate={selectedDateClick}
      />
    </Box>
  );
};

export default TeamOfDoctors;
