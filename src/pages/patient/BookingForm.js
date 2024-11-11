import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const BookingForm = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    const [hours, minutes] = newStartTime.split(":").map(Number);
    const newEndTime = new Date(0, 0, 0, hours + 1, minutes)
      .toTimeString()
      .slice(0, 5);
    setEndTime(newEndTime);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogContent
        sx={{
          width: "800px",
          maxWidth: "1000px",
          maxHeight: "80vh",
          overflowY: "auto",
        }} // Thêm maxHeight và overflowY
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          fontWeight={"bold"}
        >
          ĐĂNG KÝ LỊCH KHÁM
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField label="Họ và tên" fullWidth required />

          <FormControl>
            <FormLabel>Giới tính</FormLabel>
            <RadioGroup row>
              <FormControlLabel
                value="male"
                control={<Radio />} // Thay đổi từ Checkbox thành Radio
                label="Nam"
              />
              <FormControlLabel
                value="female"
                control={<Radio />} // Thay đổi từ Checkbox thành Radio
                label="Nữ"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Ngày"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }} // Thêm thuộc tính này để nhãn không bị che
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split("T")[0], // Ngày hiện tại
                max: new Date(new Date().setDate(new Date().getDate() + 7))
                  .toISOString()
                  .split("T")[0], // Ngày tối đa là 7 ngày sau
              },
              value: selectedDate, // Sử dụng state để quản lý giá trị
              onChange: (e) => setSelectedDate(e.target.value), // Cập nhật state khi chọn ngày
            }}
            required
          />
          <TextField
            label="Giờ bắt đầu"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }} // Thêm thuộc tính này để nhãn không bị che
            InputProps={{
              inputProps: {
                step: 3600, // Chỉ cho phép chọn theo giờ (3600 giây)
              },
              value: startTime, // Sử dụng state để quản lý giá trị
              onChange: handleStartTimeChange, // Cập nhật state khi chọn giờ bắt đầu
            }}
            required
          />
          <TextField
            label="Giờ kết thúc"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }} // Thêm thuộc tính này để nhãn không bị che
            InputProps={{
              inputProps: {
                step: 3600, // Chỉ cho phép chọn theo giờ (3600 giây)
              },
              value: endTime, // Sử dụng state để quản lý giá trị
              readOnly: true, // Không cho phép chỉnh sửa giờ kết thúc
            }}
            required
          />
          <TextField label="Email xác nhận" fullWidth required />
          <TextField label="Địa chỉ" fullWidth required />
          <TextField label="Tiêu đề buổi khám" fullWidth required />
          <TextField
            label="Mô tả triệu chứng và nhu cầu thăm khám"
            multiline
            rows={4}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button variant="contained" color="primary">
          Xác nhận đặt lịch
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingForm;
