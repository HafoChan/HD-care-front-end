import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  Autocomplete,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Pagination,
} from "@mui/material";
import HeaderComponent from "../../components/patient/HeaderComponent";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { doctor } from "../../api/doctor";
import { schedule } from "../../api/schedule";
import BookingForm from "./BookingForm";
import { UserProvider } from "../../context/UserContext";
import axios from "axios";

const TeamOfDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [doctorSelected, setDoctorSelected] = useState();
  const [selectedDates, setSelectedDates] = useState({});
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDateClick, setSelectedDateClick] = useState();
  const [selectedProvince, setSelectedProvince] = useState(null); // Lưu tỉnh đã chọn
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Lưu huyện đã chọn
  const [fullname, setFullName] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Thêm trạng thái cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMax, setPageMax] = useState(1);
  const searchParams = new URLSearchParams();

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const [options, setOptions] = useState([]); // State to store city options

  const getCity = async () => {
    const data = await axios.get(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    );
    setOptions(data.data); // Set the fetched options
  };

  useEffect(() => {
    const getAllDoctor = async () => {
      try {
        const data = await doctor.filterDoctor(
          currentPage,
          fullname,
          selectedDistrict && selectedDistrict.Name,
          selectedProvince && selectedProvince.Name,
          sortOrder && sortOrder
        );
        setDoctors(data.result?.typeResponse);
        setPageMax(data.result?.pageMax); // Cập nhật tổng số trang

        // Khởi tạo selectedDates với ngày hiện tại cho tất cả bác sĩ
        const initialSelectedDates = {};
        data.result?.typeResponse.forEach((doctor) => {
          const localDate = new Date(today.getTime() + 7 * 60 * 60 * 1000);
          const formattedDate = localDate.toISOString().split("T")[0];
          initialSelectedDates[doctor.id] = formattedDate;
        });
        setSelectedDates(initialSelectedDates);
      } catch (error) {
        console.log(error);
      }
    };
    getAllDoctor();
    getCity();
  }, [currentPage, fullname]);

  const handleSortChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);
  };

  const handleSelectChange = (type, newValue) => {
    if (type === "province") {
      setSelectedProvince(newValue);
      setSelectedDistrict(null); // Reset huyện khi thay đổi tỉnh
    } else if (type === "district") {
      setSelectedDistrict(newValue);
    }
  };

  const handleDateChange = async (doctorId, date) => {
    setSelectedDates((prev) => ({ ...prev, [doctorId]: date }));

    try {
      const response = await schedule.getScheduleByDoctorAndDate(
        doctorId,
        date
      );
      if (response.code === 1000) {
        const updatedSchedules = response.result; // Lịch mới từ API
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

  const handleSubmit = async (event) => {
    if (fullname) {
      searchParams.append("keyword", fullname); // Thêm query string ?keyword=a
    }
    let data;
    const provinceSlug = selectedProvince
      ? selectedProvince.Name.toLowerCase().replace(/\s+/g, "-")
      : "";
    const districtSlug = selectedDistrict
      ? selectedDistrict.Name.toLowerCase().replace(/\s+/g, "-")
      : "";
    const url = districtSlug
      ? `/doctor/${provinceSlug}/${districtSlug}?${searchParams.toString()}`
      : provinceSlug
      ? `/doctor/${provinceSlug}?${searchParams.toString()}`
      : `/doctor?${searchParams.toString()}`;

    data = await doctor.filterDoctor(
      currentPage,
      fullname,
      selectedDistrict && selectedDistrict.Name,
      selectedProvince && selectedProvince.Name,
      sortOrder && sortOrder
    );
    setCurrentPage(1);
    setDoctors(data.result.typeResponse);
    setPageMax(data.result?.pageMax); // Cập nhật tổng số trang
    // navigate(url);
  };

  // Hàm để chuyển trang
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Box
      align="center"
      backgroundColor="#c1e3ff"
      sx={{ minHeight: "100vh", paddingBottom: 8 }}
    >
      {/* Header */}
      <HeaderComponent />

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
          marginBottom={2}
          alignItems={"center"}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Autocomplete
                size="small"
                value={selectedProvince}
                onChange={(event, newValue) =>
                  handleSelectChange("province", newValue)
                }
                options={options}
                getOptionLabel={(option) => option.Name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tỉnh thành"
                    sx={{ backgroundColor: "white", borderRadius: "4px" }}
                  />
                )}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                size="small"
                value={selectedDistrict}
                onChange={(event, newValue) =>
                  handleSelectChange("district", newValue)
                }
                options={(selectedProvince && selectedProvince.Districts) || []}
                getOptionLabel={(option) => option.Name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Huyện"
                    sx={{ backgroundColor: "white", borderRadius: "4px" }}
                  />
                )}
                style={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={2}>
              <FormControl
                component="fieldset"
                sx={{
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: "4px",
                }}
              >
                <Autocomplete
                  size="small"
                  options={[
                    { label: "Giá tăng dần", value: "asc" },
                    { label: "Giá giảm dần", value: "desc" },
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={
                    sortOrder
                      ? {
                          label:
                            sortOrder === "asc"
                              ? "Giá tăng dần"
                              : "Giá giảm dần",
                          value: sortOrder,
                        }
                      : null
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleSortChange({ target: { value: newValue.value } });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Sắp xếp giá" />
                  )}
                  disableClearable
                  sx={{ width: "100%" }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                sx={{
                  height: "56px",
                  justifyContent: "center",
                  flexGrow: 1,
                  backgroundColor: "white",
                  borderRadius: "4px",
                  height: 40,
                  width: "100%",
                }}
                size="small"
                variant="outlined"
                placeholder="Search"
                onChange={(e) => setFullName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box
                      style={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <SearchIcon style={{ color: "#576064" }} />
                    </Box>
                  ),
                  sx: { height: "56px" },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Di chuyển nút lọc xuống dưới tỉnh thành và huyện */}
        <Box display={"flex"} justifyContent="flex-end" sx={{ mx: 3, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit();
            }}
            sx={{ width: "20%" }}
          >
            Lọc
          </Button>
        </Box>
      </Box>

      <Box container maxWidth={"1200px"}>
        <Box container spacing={3} maxWidth={"1200px"} align="center">
          {doctors?.map((doctor) => (
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
                  src={doctor.img || "default_image_url"} // Thay đổi theo cấu trúc dữ liệu của bạn
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
                  {doctor.schedules.map((schedule) => {
                    // Tạo đối tượng Date cho thời gian hiện tại
                    const now = new Date();

                    // Tạo đối tượng Date cho thời gian của lịch khám
                    const scheduleDate = new Date(selectedDates[doctor.id]);
                    const [scheduleHour] = schedule.start
                      .split(":")
                      .map(Number);
                    scheduleDate.setHours(scheduleHour, 0, 0, 0);

                    // Kiểm tra xem lịch có phải trong quá khứ không
                    const isPastSchedule = scheduleDate < now;

                    return (
                      <Button
                        key={schedule.id}
                        variant="outlined"
                        style={{ margin: "5px" }}
                        disabled={isPastSchedule}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleClick(
                            selectedDates[doctor.id],
                            doctor,
                            schedule.id
                          );
                        }}
                      >
                        {schedule.start} - {schedule.end}
                      </Button>
                    );
                  })}
                </Box>
                <Box align="left" width={"230px"}>
                  <TextField
                    label="Chọn ngày khám"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    style={{ marginTop: "20px" }}
                    inputProps={{
                      min: today.toISOString().split("T")[0],
                      max: maxDate.toISOString().split("T")[0],
                    }}
                    value={
                      selectedDates[doctor.id] ||
                      today.toISOString().split("T")[0]
                    }
                    onChange={(e) => {
                      const newDate = e.target.value;
                      handleDateChange(doctor.id, newDate);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1,
                      marginY: 2,
                    }}
                  >
                    <LocationOnIcon fontSize="medium" sx={{ mr: 2 }} />
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={"bold"}
                        sx={{ margin: "2px 0", mb: 0.5 }}
                      >
                        {doctor.district}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={"bold"}
                        style={{ margin: "2px 0" }}
                      >
                        {doctor.city}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="#ff9c00"
                    fontWeight={"bold"}
                    style={{ margin: "2px 4px", fontSize: 18 }}
                  >
                    <span style={{ color: "#000000" }}>Giá khám:</span>{" "}
                    {doctor.price}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>

        {/* Phân trang */}
        <Box display="flex" justifyContent="center" marginTop={3}>
          <Pagination
            count={pageMax}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>

      {isBookingFormOpen && (
        <UserProvider>
          <BookingForm
            open={isBookingFormOpen}
            onClose={() => setIsBookingFormOpen(false)}
            doctor={doctorSelected}
            schedule={selectedSchedule}
            selectedDate={selectedDateClick}
          />
        </UserProvider>
      )}
    </Box>
  );
};

export default TeamOfDoctors;
