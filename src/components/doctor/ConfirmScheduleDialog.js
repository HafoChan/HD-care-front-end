import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { schedule } from "../../api/schedule";
import { toast } from "react-toastify";

const ConfirmScheduleDialog = ({
  open,
  onClose,
  selectedDate,
  onDateChange,
  selectedSlots,
  doctorId,
  onScheduleCreated,
}) => {
  const schedules = selectedSlots.map((slot) => `${slot.start}-${slot.end}`);

  const data = {
    date: selectedDate,
    idDoctor: doctorId,
    schedules: schedules,
  };

  const handleSubmitForm = async () => {
    try {
      const createSchedule = async () => {
        try {
          const response = await schedule.postCreateSchedule(doctorId, data);
          if (response.code === 1000) {
            toast.success("Lịch khám đã được tạo thành công!");
            onScheduleCreated();
            onClose();
          } else {
            toast.error("Có lỗi xảy ra khi tạo lịch khám.");
          }
        } catch (error) {
          console.log(error);
          toast.error("Có lỗi xảy ra khi tạo lịch khám.");
        }
      };
      await createSchedule(); // Gọi hàm tạo lịch
    } catch (err) {
      console.error("Error submitting form: ", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận thêm khung giờ khám</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <TextField
            label="Ngày khám"
            type="date"
            value={selectedDate}
            onChange={onDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2, mb: 4 }}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {selectedSlots?.map((slot, index) => (
              <Button
                key={index}
                variant="contained"
                color="success"
                sx={{ minWidth: 100 }}
              >
                {slot.start} - {slot.end}
              </Button>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ mr: 2 }} color="error">
          Đóng
        </Button>
        <Button onClick={handleSubmitForm} sx={{ mr: 2 }} color="primary">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmScheduleDialog;
