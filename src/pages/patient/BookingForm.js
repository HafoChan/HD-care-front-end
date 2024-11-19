import React from "react";
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
  Avatar,
} from "@mui/material";

const BookingForm = ({ open, onClose, selectedDate, doctor, schedule }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogContent
        sx={{
          width: "800px",
          maxWidth: "1000px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
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
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 4,
          }}
        >
          {doctor?.avatar != null ? (
            <Avatar
              alt="Avatar"
              src={doctor?.avatar}
              sx={{ width: 56, height: 56 }}
            />
          ) : null}

          <Box>
            <Typography variant="h6" fontWeight={"bold"}>
              {doctor?.name}
            </Typography>
            <Typography>
              {doctor?.district} {doctor?.city}
            </Typography>
          </Box>
        </Box>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField label="Họ và tên" fullWidth required />
          <FormControl>
            <FormLabel>Giới tính</FormLabel>
            <RadioGroup row>
              <FormControlLabel value="male" control={<Radio />} label="Nam" />
              <FormControlLabel value="female" control={<Radio />} label="Nữ" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Ngày"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              value: selectedDate,
              readOnly: true,
            }}
            required
          />
          <TextField
            label="Giờ bắt đầu"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              value: schedule?.start,
              readOnly: true,
            }}
            required
          />
          <TextField
            label="Giờ kết thúc"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              value: schedule?.end,
              readOnly: true,
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
