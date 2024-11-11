import React, { useState } from "react";
import { TextField, Button, Box, Typography, Divider } from "@mui/material";

const doctor = {
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
};

function AppointmentSchedulerComponent() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <Box sx={{ paddingX: "24px" }}>
      <TextField
        label="Chọn ngày khám"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginTop: "20px" }}
        inputProps={{ shrink: true }}
      />
      <Box
        container
        spacing={2}
        sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Box>
          {doctor.availableTimes.map((time, index) => (
            <Button key={index} variant="outlined" style={{ margin: "5px" }}>
              {time}
            </Button>
          ))}
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 4 }} />
        <Box width={"35%"}>
          <Typography fontSize={18} fontWeight={"bold"}>
            ĐỊA CHỈ KHÁM
          </Typography>
          <Typography fontWeight={"bold"}>
            Hệ thống Y tế Thu Cúc cơ sở Thụy Khuê
          </Typography>
          <Typography>286 Thụy Khuê, quận Tây Hồ, Hà Nội</Typography>
          <Typography fontWeight={"bold"} display={"flex"}>
            GIÁ KHÁM:
            <Typography
              color="#ffc300"
              fontWeight={"bold"}
              sx={{ marginLeft: "8px" }}
            >
              150.00đ
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default AppointmentSchedulerComponent;
