import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Divider } from "@mui/material";
import BookingForm from "../../pages/patient/BookingForm";

const AppointmentSchedulerComponent = ({
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

  useEffect(() => {
    if (selectedDate) {
      // Chỉ gọi nếu selectedDate có giá trị
      fetchAvailableTimes(selectedDate);
      console.log("Appointment schedule component");
    }
  }, [selectedDate, fetchAvailableTimes]);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    fetchAvailableTimes(newDate);
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
        value={selectedDate}
        onChange={handleDateChange}
        style={{ marginTop: "20px" }}
        inputProps={{ shrink: true }}
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
              150.000đ
            </Typography>
          </Typography>
        </Box>
      </Box>

      {/* Hiển thị BookingForm khi openBookingForm là true */}
      <BookingForm
        open={openBookingForm}
        onClose={() => setOpenBookingForm(false)} // Đóng form
        selectedDate={selectedDate}
        doctor={doctorId} // Truyền thông tin bác sĩ
        schedule={selectedSchedule} // Truyền thông tin lịch đã chọn
      />
    </Box>
  );
};

export default AppointmentSchedulerComponent;
