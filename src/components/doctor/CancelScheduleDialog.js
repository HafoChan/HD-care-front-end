import React, { useState } from "react";
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

const CancelScheduleDialog = ({
  open,
  onClose,
  selectedDate,
  onDateChange,
  cancelReason,
  onReasonChange,
  selectedSlots,
  timeActiveDoctor,
  onScheduleCancelled,
  doctorId,
}) => {
  const handleCancelSchedule = async () => {
    try {
      // Thực hiện xử lý để lọc lại timeActiveDoctor
      const slotsToCancel = timeActiveDoctor.filter((slot) =>
        selectedSlots.some(
          (selectedSlot) =>
            selectedSlot.start === slot.start && selectedSlot.end === slot.end
        )
      );

      // Xóa trường date khỏi các phần tử trong slotsToCancel
      const slotsToCancelWithIdOnly = slotsToCancel.map(({ id }) => ({ id }));

      // Tạo object deleteScheduleData trực tiếp
      const deleteScheduleData = {
        scheduleList: slotsToCancelWithIdOnly,
        note: cancelReason,
      };

      // Gọi API với deleteScheduleData
      const response = await schedule.deleteSchedule(
        doctorId,
        deleteScheduleData
      );

      if (response.code === 1000) {
        toast.success("Xóa lịch khám thành công!");
        onScheduleCancelled();
        onClose();
      } else {
        toast.error("Có lỗi xảy ra khi xóa lịch khám.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi xóa lịch khám.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận hủy khung giờ khám</DialogTitle>
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
            disabled={true}
            sx={{ mt: 2, mb: 4 }}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {selectedSlots?.map((slot, index) => (
              <Button
                key={index}
                variant="contained"
                color="error"
                sx={{ minWidth: 100 }}
              >
                {slot.start} - {slot.end}
              </Button>
            ))}
          </Box>
          <TextField
            label="Lý do hủy"
            multiline
            rows={3}
            value={cancelReason}
            onChange={onReasonChange}
            sx={{ mt: 2, width: "100%" }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ mr: 2 }} color="primary">
          Đóng
        </Button>
        <Button onClick={handleCancelSchedule} sx={{ mr: 2 }} color="error">
          Xác nhận hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelScheduleDialog;
