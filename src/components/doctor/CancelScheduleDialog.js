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

const CancelScheduleDialog = ({
  open,
  onClose,
  selectedDate,
  times,
  onDateChange,
  cancelReason,
  onReasonChange,
}) => (
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
          sx={{ mt: 2, mb: 4 }}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {times.map((slot, index) => (
            <Button
              key={index}
              variant="contained"
              color="error"
              sx={{ minWidth: 100 }}
            >
              {slot.time}
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
      <Button onClick={onClose} sx={{ mr: 2 }} color="error">
        Xác nhận hủy
      </Button>
    </DialogActions>
  </Dialog>
);

export default CancelScheduleDialog;
