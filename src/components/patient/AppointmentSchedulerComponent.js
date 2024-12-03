import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Divider } from "@mui/material";
import BookingForm from "../../pages/patient/BookingForm";
import { UserProvider } from "../../context/UserContext";

const AppointmentSchedulerComponent = ({
  doctorInfo,
  doctorId,
  selectedDate,
  setSelectedDate,
  fetchAvailableTimes,
  availableTimes,
}) => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [openBookingForm, setOpenBookingForm] = useState(false); // Trạng thái để mở form
  const [selectedSchedule, setSelectedSchedule] = useState(null); // Trạng thái để lưu thông tin lịch đã chọn

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    if (newDate !== selectedDate) {
      setSelectedDate(newDate);
      fetchAvailableTimes(newDate);
    }
  };

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule); // Lưu thông tin lịch đã chọn
    setOpenBookingForm(true); // Mở form
  };

  return (
    <Box sx={{ paddingX: "24px" }}>
      <TextField
        label="Chọn ngày khám"
        type="date"
        InputLabelProps={{ shrink: true }}
        inputProps={{
          shrink: true,
          min: today.toISOString().split("T")[0],
          max: maxDate.toISOString().split("T")[0],
        }}
        value={selectedDate}
        onChange={handleDateChange}
        style={{ marginTop: "20px" }}
      />
      <Box
        container
        spacing={2}
        sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Box>
          {availableTimes.map((time, index) => (
            <Button
              key={index}
              variant="outlined"
              style={{ margin: "5px" }}
              onClick={() => handleScheduleClick(time)}
            >
              {time.start} - {time.end}
            </Button>
          ))}
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 4 }} />
        <Box width={"35%"}>
          <Typography fontSize={18} fontWeight={"bold"}>
            ĐỊA CHỈ KHÁM
          </Typography>
          <Typography fontWeight={"bold"}>{doctorInfo?.address}</Typography>
          <Typography>
            {doctorInfo?.district}, {doctorInfo?.city}
          </Typography>
          <Typography fontWeight={"bold"} display={"flex"}>
            GIÁ KHÁM:
            <Typography
              color="#ffc300"
              fontWeight={"bold"}
              sx={{ marginLeft: "8px" }}
            >
              {doctorInfo?.price}đ
            </Typography>
          </Typography>
        </Box>
      </Box>

      {/* Hiển thị BookingForm khi openBookingForm là true */}
      {openBookingForm && (
        <UserProvider>
          <BookingForm
            open={openBookingForm}
          onClose={() => setOpenBookingForm(false)} // Đóng form
          selectedDate={selectedDate}
          doctor={doctorId} // Truyền thông tin bác sĩ
          schedule={selectedSchedule} // Truyền thông tin lịch đã chọn
          />
        </UserProvider>
      )}
    </Box>
  );
};

export default AppointmentSchedulerComponent;
