import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import ConfirmScheduleDialog from "./ConfirmScheduleDialog";
import CancelScheduleDialog from "./CancelScheduleDialog";
import { schedule } from "../../api/schedule";
import { doctor } from "../../api/doctor";
import { toast } from "react-toastify";

const DoctorSchedule = ({ type }) => {
  const [timeActiveDoctor, setTimeActiveDoctor] = useState(); // schedule của doctor
  const [filteredSlots, setFilteredSlots] = useState(); // dữ liệu sau khi filter thời gian vs schedule của doctor
  const [doctorId, setDoctorId] = useState();

  const [selectedSlots, setSelectedSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const today = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(new Date().getDate() + 7);

  const timeActiveSlots = (selectedDate) => {
    let slots = [];
    const startTime = new Date();

    if (selectedDate === today) {
      // Nếu chọn ngày hiện tại, khung giờ từ giờ hiện tại đến 20h
      startTime.setMinutes(0);
      startTime.setSeconds(0);
      startTime.setHours(startTime.getHours() + 1);
      if (startTime.getHours() >= 20) return slots;

      if (startTime.getHours() < 7) startTime.setHours(7, 0, 0, 0);

      while (startTime.getHours() < 20) {
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);

        slots.push({
          start: startTime.toTimeString().slice(0, 5),
          end: endTime.toTimeString().slice(0, 5),
        });

        startTime.setHours(startTime.getHours() + 1);
      }
    } else if (selectedDate > today) {
      // Nếu chọn ngày khác, khung giờ từ 7h đến 20h
      startTime.setHours(7, 0, 0, 0); // Đặt giờ bắt đầu là 7:00
      while (startTime.getHours() < 20) {
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);

        slots.push({
          start: startTime.toTimeString().slice(0, 5),
          end: endTime.toTimeString().slice(0, 5),
        });

        startTime.setHours(startTime.getHours() + 1);
      }
    }

    return slots;
  };

  const getTimeActiveDoctor = async (doctorId, selectedDate) => {
    try {
      const response = await schedule.getScheduleByDoctorAndDate(
        doctorId, // doctorId
        selectedDate
      );
      if (response.code === 1000) {
        setTimeActiveDoctor(response.result);

        // Lọc các slot không trùng giờ
        const apiSlots = response.result.map((slot) => slot.start);
        const updatedSlots = timeActiveSlots(selectedDate).filter(
          (slot) => !apiSlots.includes(slot.start)
        );

        setFilteredSlots(updatedSlots);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    getTimeActiveDoctor(doctorId, selectedDate);
  }, [selectedDate, doctorId]);

  useEffect(() => {
    doctor
      .getInfo()
      .then((response) => {
        setDoctorId(response.result.id);
      })
      .catch((error) => console.error("Error getting doctor info:", error));

    getTimeActiveDoctor(doctorId, selectedDate);
  }, []);

  const handleConfirm = () => {
    setOpenConfirm(true);
  };

  const handleScheduleCreated = () => {
    getTimeActiveDoctor(doctorId, selectedDate);
    setSelectedSlots([]);
  };

  const handleScheduleCancelled = () => {
    getTimeActiveDoctor(doctorId, selectedDate);
    setSelectedSlots([]);
  };

  const handleCancel = () => {
    console.log(selectedSlots);
    setOpenCancel(true);
  };

  const handleCloseConfirm = () => {
    console.log(selectedSlots);
    setOpenConfirm(false);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
  };

  const handleChangeDate = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlots([]);
  };

  const slotsToDisplay = type === "add" ? filteredSlots : timeActiveDoctor;

  const handleSlotClick = (slot) => {
    setSelectedSlots(
      (prev) =>
        prev.some((s) => s.start === slot.start && s.end === slot.end)
          ? prev.filter((s) => s.start !== slot.start || s.end !== slot.end) // Bỏ slot nếu đã chọn
          : [...prev, slot] // Thêm slot nếu chưa chọn
    );
  };

  return (
    <Box width={"100%"}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
        <TextField
          label="Chọn ngày khám"
          type="date"
          value={selectedDate}
          onChange={handleChangeDate}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            shrink: true,
            min: today,
            max: maxDate.toISOString().split("T")[0],
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginY: 4 }}>
        {slotsToDisplay?.map((slot, index) => (
          <Button
            key={index}
            variant="contained"
            color={
              selectedSlots.some(
                (s) => s.start === slot.start && s.end === slot.end
              )
                ? type !== "add"
                  ? "error"
                  : "success"
                : type === "add"
                ? "inherit"
                : "success"
            }
            sx={{ minWidth: 100 }}
            onClick={() => handleSlotClick(slot)} // Xử lý khi nhấn nút
          >
            {slot.start} - {slot.end}
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
        onDateChange={(e) => setSelectedDate(e.target.value)}
        selectedSlots={selectedSlots}
        doctorId={doctorId}
        onScheduleCreated={handleScheduleCreated}
      />

      <CancelScheduleDialog
        open={openCancel}
        onClose={handleCloseCancel}
        selectedDate={selectedDate}
        onDateChange={(e) => setSelectedDate(e.target.value)}
        cancelReason={cancelReason}
        onReasonChange={(e) => setCancelReason(e.target.value)}
        selectedSlots={selectedSlots}
        timeActiveDoctor={timeActiveDoctor}
        onScheduleCancelled={handleScheduleCancelled}
        doctorId={doctorId}
      />
    </Box>
  );
};

export default DoctorSchedule;
