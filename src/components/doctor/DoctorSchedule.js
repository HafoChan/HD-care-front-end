import * as React from "react";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import ConfirmScheduleDialog from "./ConfirmScheduleDialog";
import CancelScheduleDialog from "./CancelScheduleDialog";

const DoctorSchedule = ({ times, type }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCancel = () => {
    setOpenCancel(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
  };

  return (
    <Box width={"100%"}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
        <TextField
          label="Chọn ngày khám"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginY: 4 }}>
        {times.map((slot, index) => (
          <Button
            key={index}
            variant="contained"
            color={
              slot.status === "available"
                ? "success"
                : slot.status === "deleted"
                ? "error"
                : "inherit"
            }
            sx={{ minWidth: 100 }}
          >
            {slot.time}
          </Button>
        ))}
      </Box>

      <Button
        variant="contained"
        color={type === "add" ? "primary" : "warning"}
        sx={{ width: "fit-content" }}
        onClick={type === "add" ? handleConfirm : handleCancel}
      >
        {type === "add" ? "Xác nhận" : "Hủy ca khám"}
      </Button>

      <ConfirmScheduleDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        selectedDate={selectedDate}
        times={times}
        onDateChange={(e) => setSelectedDate(e.target.value)}
      />

      <CancelScheduleDialog
        open={openCancel}
        onClose={handleCloseCancel}
        selectedDate={selectedDate}
        times={times}
        onDateChange={(e) => setSelectedDate(e.target.value)}
        cancelReason={cancelReason}
        onReasonChange={(e) => setCancelReason(e.target.value)}
      />
    </Box>
  );
};

export default DoctorSchedule;
