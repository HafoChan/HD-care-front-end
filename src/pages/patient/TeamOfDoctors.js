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
  IconButton,
  Avatar,
  Chip,
  Divider,
  CardActions,
  CardHeader,
  useTheme,
  alpha,
  InputAdornment,
  FormLabel,
  Breadcrumbs,
  Badge,
  Tooltip,
} from "@mui/material";
import HeaderComponent from "../../components/patient/HeaderComponent";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SortIcon from "@mui/icons-material/Sort";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VerifiedIcon from "@mui/icons-material/Verified";
import { doctor } from "../../api/doctor";
import { schedule } from "../../api/schedule";
import BookingForm from "./BookingForm";
import { UserProvider } from "../../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const TeamOfDoctors = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    // Set document title
    document.title = "Đội ngũ bác sĩ | HD-Care";

    getAllDoctor();
    getCity();

    // Restore original title when component unmounts
    return () => {
      document.title = "HD-Care";
    };
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
    console.log("Date:", date);
    console.log("Doctor:", doctor);
    console.log("ScheduleId:", scheduleId);

    // Make sure schedules exist and are in an array format
    if (!doctor.schedules || !Array.isArray(doctor.schedules)) {
      console.error("Doctor schedules not found or not in the correct format");
      toast.error("Không thể tìm thấy lịch khám. Vui lòng thử lại.");
      return;
    }

    // Find the selected schedule by ID
    const selectedSchedule = doctor.schedules.find(
      (schedule) => schedule.id === scheduleId
    );

    // Validate the selected schedule has all required properties
    if (
      !selectedSchedule ||
      !selectedSchedule.id ||
      !selectedSchedule.start ||
      !selectedSchedule.end
    ) {
      console.error("Invalid schedule data:", selectedSchedule);
      toast.error("Thông tin lịch không hợp lệ. Vui lòng chọn lịch khác.");
      return;
    }

    console.log("Selected schedule:", selectedSchedule);

    // Set state with valid data
    setSelectedDateClick(date);
    setDoctorSelected(doctor);
    setSelectedSchedule(selectedSchedule);
    setIsBookingFormOpen(true);
  };

  const handleDoctorClick = (doctor) => {
    navigate(`/doctor/${doctor.id}`); // Điều hướng đến trang DoctorDetail
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

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

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  // Get the day of the week
  const getDayOfWeek = (dateString) => {
    const daysOfWeek = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.9)
            : alpha(theme.palette.grey[100], 0.5),
        minHeight: "100vh",
        paddingBottom: 8,
      }}
    >
      {/* Header */}
      <HeaderComponent />

      <Container maxWidth="lg" sx={{ pt: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Button
            component={Link}
            to="/"
            startIcon={<HomeOutlinedIcon />}
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "text.secondary",
              "&:hover": {
                color: theme.palette.primary.main,
                backgroundColor: "transparent",
              },
            }}
          >
            Trang chủ
          </Button>
          <Typography color="text.primary" fontWeight={600}>
            Đội ngũ bác sĩ
          </Typography>
        </Breadcrumbs>

        {/* Page Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "text.primary",
          }}
        >
          Đội ngũ bác sĩ chuyên khoa
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Tìm kiếm và đặt lịch với các bác sĩ da liễu hàng đầu tại HD-Care
        </Typography>

        {/* Search and Filter */}
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.12)
                : alpha(theme.palette.common.black, 0.08),
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Tên bác sĩ..."
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={options || []}
                getOptionLabel={(option) => option.Name || ""}
                isOptionEqualToValue={(option, value) => option.Id === value.Id}
                value={selectedProvince}
                onChange={(e, newValue) =>
                  handleSelectChange("province", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Chọn tỉnh/thành phố"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOnIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={selectedProvince?.Districts || []}
                getOptionLabel={(option) => option.Name || ""}
                isOptionEqualToValue={(option, value) => option.Id === value.Id}
                value={selectedDistrict}
                onChange={(e, newValue) =>
                  handleSelectChange("district", newValue)
                }
                disabled={!selectedProvince}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Chọn quận/huyện"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOnIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Tìm kiếm
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SortIcon sx={{ mr: 1, fontSize: 20 }} /> Sắp xếp theo:
              </FormLabel>
              <RadioGroup row value={sortOrder} onChange={handleSortChange}>
                <FormControlLabel
                  value="rating_desc"
                  control={
                    <Radio
                      sx={{
                        color: theme.palette.primary.main,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label="Đánh giá cao nhất"
                />
                <FormControlLabel
                  value="price_asc"
                  control={
                    <Radio
                      sx={{
                        color: theme.palette.primary.main,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label="Giá thấp đến cao"
                />
                <FormControlLabel
                  value="price_desc"
                  control={
                    <Radio
                      sx={{
                        color: theme.palette.primary.main,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label="Giá cao đến thấp"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Paper>

        {/* Doctor List */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
              Đang tải danh sách bác sĩ...
            </Typography>
          </Box>
        ) : doctors.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
              Không tìm thấy bác sĩ phù hợp với tiêu chí tìm kiếm.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setFullName("");
                setSelectedProvince(null);
                setSelectedDistrict(null);
                setSortOrder("");
                handleSubmit();
              }}
              sx={{ mt: 2 }}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {doctors.map((doctor) => (
              <Grid item xs={12} key={doctor.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.12)
                        : alpha(theme.palette.common.black, 0.08),
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Grid container>
                    <Grid item xs={12} md={3}>
                      <Box
                        sx={{
                          position: "relative",
                          height: "100%",
                          minHeight: 200,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          p: { xs: 2, md: 0 },
                          bgcolor: "background.paper",
                        }}
                      >
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          badgeContent={
                            doctor.rating && doctor.rating >= 4.5 ? (
                              <Tooltip title="Bác sĩ được đánh giá cao">
                                <VerifiedIcon
                                  sx={{
                                    color: theme.palette.primary.main,
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                    fontSize: 24,
                                  }}
                                />
                              </Tooltip>
                            ) : null
                          }
                        >
                          <Avatar
                            src={doctor.img}
                            alt={doctor.name}
                            sx={{
                              width: 180,
                              height: 180,
                              border: "3px solid",
                              borderColor: theme.palette.primary.main,
                              boxShadow: "0 4px 14px rgba(0,118,255,0.1)",
                            }}
                            onClick={() => handleDoctorClick(doctor)}
                          />
                        </Badge>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: "1.25rem", md: "1.5rem" },
                              cursor: "pointer",
                              "&:hover": {
                                color: theme.palette.primary.main,
                              },
                            }}
                            onClick={() => handleDoctorClick(doctor)}
                          >
                            {doctor.name || "Bác sĩ chưa cập nhật tên"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {doctor.rating && (
                              <>
                                <StarIcon
                                  sx={{
                                    color: "#FFD700",
                                    mr: 0.5,
                                    fontSize: 20,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, mr: 1 }}
                                >
                                  {doctor.rating.toFixed(1)}
                                </Typography>
                              </>
                            )}
                          </Box>
                          {doctor.specialist && (
                            <Chip
                              label={doctor.specialist}
                              size="small"
                              color="primary"
                              sx={{
                                fontSize: "0.75rem",
                                height: 24,
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Box>

                        {doctor.address && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              mt: 1.5,
                              color: "text.secondary",
                            }}
                          >
                            <LocationOnIcon
                              sx={{
                                fontSize: 18,
                                mt: 0.3,
                                mr: 1,
                                color: theme.palette.primary.main,
                                opacity: 0.7,
                              }}
                            />
                            <Typography variant="body2">
                              {doctor.address}, {doctor?.district},{" "}
                              {doctor?.city}
                            </Typography>
                          </Box>
                        )}

                        {doctor.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 2,
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 3,
                            }}
                          >
                            {doctor.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 3,
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <CalendarMonthIcon
                            sx={{ color: theme.palette.primary.main, mr: 1 }}
                          />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {getDayOfWeek(selectedDates[doctor.id])} -{" "}
                            {formatDate(selectedDates[doctor.id])}
                          </Typography>
                        </Box>

                        <TextField
                          type="date"
                          fullWidth
                          value={selectedDates[doctor.id] || ""}
                          onChange={(e) =>
                            handleDateChange(doctor.id, e.target.value)
                          }
                          InputProps={{
                            inputProps: {
                              min: today.toISOString().split("T")[0],
                              max: maxDate.toISOString().split("T")[0],
                            },
                          }}
                          sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{ mb: 1.5, color: "text.secondary" }}
                        >
                          {doctor.schedules && doctor.schedules.length > 0
                            ? "Chọn thời gian khám:"
                            : "Không có lịch khám vào ngày này"}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          {doctor.schedules &&
                            doctor.schedules.map((schedule) => (
                              <Chip
                                key={schedule.id}
                                label={`${schedule.start} - ${schedule.end}`}
                                onClick={() =>
                                  handleScheduleClick(
                                    selectedDates[doctor.id],
                                    doctor,
                                    schedule.id
                                  )
                                }
                                color="primary"
                                variant="outlined"
                                size="small"
                                icon={<AccessTimeIcon fontSize="small" />}
                                sx={{
                                  borderRadius: 1.5,
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                    transform: "scale(1.05)",
                                  },
                                }}
                              />
                            ))}
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Chi phí thăm khám:
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="primary.main"
                          >
                            {formatNumber(doctor.price || 0)} VNĐ
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleDoctorClick(doctor)}
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pageMax > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pageMax}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Container>

      {/* Booking Form Dialog */}
      {isBookingFormOpen && (
        <UserProvider>
          <BookingForm
            open={isBookingFormOpen}
            onClose={() => setIsBookingFormOpen(false)}
            selectedDate={selectedDateClick}
            doctor={doctorSelected}
            schedule={selectedSchedule}
          />
        </UserProvider>
      )}
    </Box>
  );
};

export default TeamOfDoctors;
