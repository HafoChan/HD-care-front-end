import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { appointment } from "../../api/appointment";

const AppointmentTable = ({
  appointments,
  doctorId,
  selectedRow,
  setSelectedRow,
}) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [rowStatuses, setRowStatuses] = useState({}); // Trạng thái ban đầu trống
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [statusToChange, setStatusToChange] = useState(null);

  // Đồng bộ hóa rowStatuses với appointments khi appointments thay đổi
  useEffect(() => {
    if (appointments?.content) {
      const initialStatuses = appointments.content.reduce(
        (acc, appointment) => {
          acc[appointment.id] = appointment.status;
          return acc;
        },
        {}
      );
      setRowStatuses(initialStatuses);
    }
  }, [appointments]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning"; // Orange
      case "CONFIRMED":
        return "primary"; // Blue
      case "COMPLETED":
        return "success"; // Green
      case "CANCELLED":
        return "error"; // Red
      default:
        return "default";
    }
  };

  const handleRowClick = (appointment) => {
    setSelectedRow(appointment.id);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedRow) return;

    const data = {
      idDoctor: doctorId,
      status: newStatus,
      note: `Status updated to ${newStatus}`,
    };

    try {
      await changeStatusFetchApi(selectedRow, data);

      setRowStatuses((prevStatuses) => ({
        ...prevStatuses,
        [selectedRow]: newStatus,
      }));

      toast.success(`Status updated to: ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
      console.error("Error updating status:", error);
    } finally {
      handleMenuClose();
    }
  };

  const changeStatusFetchApi = async (appointmentId, data) => {
    try {
      const response = await appointment.changeAppointmentStatus(
        appointmentId,
        data
      );

      if (response.code === 1000) {
        return response.result;
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleMenuClick = (event, appointmentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(appointmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleStatusClick = (status) => {
    if (status === "CANCELLED") {
      setStatusToChange(status);
      setOpenCancelDialog(true);
    } else {
      handleStatusChange(status);
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy lịch hẹn");
      return;
    }

    const data = {
      idDoctor: doctorId,
      status: statusToChange,
      note: cancelReason,
    };

    try {
      await changeStatusFetchApi(selectedRow, data);

      setRowStatuses((prevStatuses) => ({
        ...prevStatuses,
        [selectedRow]: statusToChange,
      }));

      toast.success("Đã hủy lịch hẹn thành công");
      handleCloseCancelDialog();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
      console.error("Error updating status:", error);
    }
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setCancelReason("");
    setStatusToChange(null);
    handleMenuClose();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID bệnh nhân</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ngày khám</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tiêu đề</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email LH</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments?.content?.map((appointment) => (
              <TableRow
                key={appointment.id}
                sx={{
                  cursor: "pointer",
                  fontWeight:
                    selectedRow === appointment.id ? "bold" : "normal",
                  backgroundColor:
                    selectedRow === appointment.id
                      ? "#edf4fc !important"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "#f0f0f0 !important",
                    fontWeight: "bold",
                  },
                }}
                onClick={() => handleRowClick(appointment)}
              >
                <TableCell>{appointment.id}</TableCell>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.start.split(" ")[0]}</TableCell>
                <TableCell>
                  {appointment.start.split(" ")[1]} -{" "}
                  {appointment.end.split(" ")[1]}
                </TableCell>
                <TableCell>{appointment.title}</TableCell>
                <TableCell>{appointment.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={getStatusColor(rowStatuses[appointment.id])}
                    onClick={(e) =>
                      // Chỉ mở menu nếu trạng thái không phải COMPLETED hoặc CANCELLED
                      ["PENDING", "CONFIRMED"].includes(
                        rowStatuses[appointment.id]
                      ) && handleMenuClick(e, appointment.id)
                    }
                  >
                    {rowStatuses[appointment.id] || appointment.status}
                  </Button>
                  {/* Ẩn menu nếu trạng thái là COMPLETED hoặc CANCELLED */}
                  {["COMPLETED", "CANCELLED"].includes(
                    rowStatuses[appointment.id]
                  ) ? null : (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl && selectedRow === appointment.id)}
                      onClose={handleMenuClose}
                    >
                      {(() => {
                        const currentStatus = rowStatuses[appointment.id];
                        let allowedStatuses = [];

                        switch (currentStatus) {
                          case "PENDING":
                            allowedStatuses = ["CONFIRMED", "CANCELLED"];
                            break;
                          case "CONFIRMED":
                            allowedStatuses = ["COMPLETED", "CANCELLED"];
                            break;
                          default:
                            allowedStatuses = [];
                        }

                        return allowedStatuses.map((status) => (
                          <MenuItem
                            key={status}
                            onClick={() => handleStatusClick(status)}
                          >
                            {status}
                          </MenuItem>
                        ));
                      })()}
                    </Menu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog xác nhận hủy lịch */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận hủy lịch hẹn</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do hủy"
            fullWidth
            multiline
            rows={4}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleCancelSubmit}
            color="error"
            variant="contained"
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentTable;
