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

const ConfirmScheduleDialog = ({
  open,
  onClose,
  selectedDate,
  times,
  onDateChange,
}) => (
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
          {times.map((slot, index) => (
            <Button
              key={index}
              variant="contained"
              color="success"
              sx={{ minWidth: 100 }}
            >
              {slot.time}
            </Button>
          ))}
        </Box>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{ mr: 2 }} color="primary">
        Xác nhận
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmScheduleDialog;
