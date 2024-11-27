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

  return (
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
                fontWeight: selectedRow === appointment.id ? "bold" : "normal",
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
                  onClick={(e) => handleMenuClick(e, appointment.id)}
                >
                  {rowStatuses[appointment.id] || appointment.status}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl && selectedRow === appointment.id)}
                  onClose={handleMenuClose}
                >
                  {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
                    (status) => (
                      <MenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                      >
                        {status}
                      </MenuItem>
                    )
                  )}
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppointmentTable;
