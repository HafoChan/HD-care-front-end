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
  alpha,
  Box,
  styled,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import { appointment } from "../../api/appointment";

// Styled components for consistent table styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  border: "1px solid rgba(224, 224, 224, 0.3)",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
  },
}));

const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: "rgba(245, 245, 245, 0.8)",
}));

const StyledTableRow = styled(TableRow)(({ selected }) => ({
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: selected
    ? "rgba(237, 244, 252, 1) !important"
    : "transparent",
  borderLeft: selected ? "4px solid #1976d2" : "4px solid transparent",
  "&:hover": {
    backgroundColor: "rgba(240, 240, 240, 0.8) !important",
  },
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  padding: "12px 16px",
  borderBottom: "1px solid rgba(224, 224, 224, 0.3)",
  fontSize: "0.875rem",
}));

const StyledHeaderCell = styled(TableCell)(() => ({
  padding: "14px 16px",
  fontWeight: 600,
  fontSize: "0.875rem",
  color: "#333",
  borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
}));

const StatusButton = styled(Button)(({ color }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  padding: "4px 10px",
  borderRadius: "6px",
  textTransform: "uppercase",
  minWidth: "100px",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
}));

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
    console.log(appointments);
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
      note: `Cập nhật trạng thái ${newStatus} cho cuộc hẹn thành công`,
    };

    console.log(data);

    try {
      await changeStatusFetchApi(selectedRow, data);

      setRowStatuses((prevStatuses) => ({
        ...prevStatuses,
        [selectedRow]: newStatus,
      }));

      toast.success(`Cập nhật trạng thái ${newStatus} cho cuộc hẹn thành công`);
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
      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderCell>Họ và tên</StyledHeaderCell>
              <StyledHeaderCell>Ngày khám</StyledHeaderCell>
              <StyledHeaderCell>Thời gian</StyledHeaderCell>
              <StyledHeaderCell>Tiêu đề</StyledHeaderCell>
              <StyledHeaderCell>Email LH</StyledHeaderCell>
              <StyledHeaderCell>Trạng thái</StyledHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {appointments?.content?.map((appointment) => (
              <StyledTableRow
                key={appointment.id}
                selected={selectedRow === appointment.id}
                onClick={() => handleRowClick(appointment)}
              >
                <StyledTableCell>
                  <Box
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      "& > *": { whiteSpace: "normal" },
                    }}
                  >
                    {appointment.name}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  {appointment.start.split(" ")[0]}
                </StyledTableCell>
                <StyledTableCell>
                  {appointment.start.split(" ")[1]} -{" "}
                  {appointment.end.split(" ")[1]}
                </StyledTableCell>
                <StyledTableCell>
                  <Box
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      "& > *": { whiteSpace: "normal" },
                    }}
                  >
                    {appointment.title}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Box
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      "& > *": { whiteSpace: "normal" },
                    }}
                  >
                    {appointment.email}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <StatusButton
                    variant="contained"
                    color={getStatusColor(rowStatuses[appointment.id])}
                    onClick={(e) =>
                      ["PENDING", "CONFIRMED"].includes(
                        rowStatuses[appointment.id]
                      ) && handleMenuClick(e, appointment.id)
                    }
                  >
                    {rowStatuses[appointment.id] || appointment.status}
                  </StatusButton>
                  {["COMPLETED", "CANCELLED"].includes(
                    rowStatuses[appointment.id]
                  ) ? null : (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl && selectedRow === appointment.id)}
                      onClose={handleMenuClose}
                      elevation={3}
                      PaperProps={{
                        sx: {
                          borderRadius: "8px",
                          minWidth: "120px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        },
                      }}
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
                            sx={{
                              fontSize: "0.875rem",
                              py: 1,
                              transition: "background-color 0.2s ease",
                              "&:hover": {
                                backgroundColor: alpha("#1976d2", 0.08),
                              },
                            }}
                          >
                            {status}
                          </MenuItem>
                        ));
                      })()}
                    </Menu>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Dialog xác nhận hủy lịch */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 1,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
          Xác nhận hủy lịch hẹn
        </DialogTitle>
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
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseCancelDialog}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleCancelSubmit}
            color="error"
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 8px rgba(211, 47, 47, 0.2)",
              "&:hover": {
                boxShadow: "0 6px 12px rgba(211, 47, 47, 0.3)",
              },
            }}
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentTable;
