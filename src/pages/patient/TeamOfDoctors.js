import React, { useState } from "react";
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

const doctors = [
  {
    id: 1,
    name: "Tiến sĩ, Bác sĩ chuyên khoa II Lê Quốc Việt",
    experience:
      "Hơn 30 năm kinh nghiệm khám và điều trị các bệnh nội cơ xương khớp.",
    location: "Hà Nội",
    availableTimes: ["16:30 - 17:00", "17:00 - 17:30", "17:30 - 18:00"],
    price: "350.000đ",
  },
  {
    id: 2,
    name: "BSCKII Dương Minh Trí",
    experience:
      "Experience: Bác sĩ có 25 năm kinh nghiệm về bệnh lý liên quan cột sống Hiện là Trưởng khoa Phẫu thuật Cột sống, Bệnh viện Việt Đức Bác sĩ nhận khám từ 7 tuổi trở lên",
    location: "Thành phố Hồ Chí Minh",
    availableTimes: [
      "18:30 - 19:00",
      "19:00 - 19:30",
      "19:00 - 19:30",
      "19:00 - 19:30",
      "19:00 - 19:30",
      "19:00 - 19:30",
      "19:00 - 19:30",
      "19:00 - 19:30",
    ],
    price: "300.000đ - 400.000đ",
  },
];

const TeamOfDoctors = () => {
  const [selectedTab, setSelectedTab] = useState("Trang chủ");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const [selectedDates, setSelectedDates] = useState({}); // State để lưu ngày đã chọn cho từng bác sĩ

  const handleDateChange = (doctorId, date) => {
    setSelectedDates((prev) => ({ ...prev, [doctorId]: date })); // Cập nhật ngày cho bác sĩ tương ứng
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
        {doctors.map((doctor) => (
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
              }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq5aoPDi_WOhlc3vAAk0SE_7bkMiyO8PC9Ag&s"
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
                {doctor.availableTimes.map((time, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    style={{ margin: "5px" }}
                  >
                    {time}
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
                  } // Hiển thị ngày đã chọn hoặc ngày hiện tại
                  onChange={(e) => handleDateChange(doctor.id, e.target.value)} // Cập nhật ngày cho bác sĩ tương ứng
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
                    {doctor.location}
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
    </Box>
  );
};

export default TeamOfDoctors;
