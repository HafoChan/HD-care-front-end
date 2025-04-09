import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
  Typography,
  alpha,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  styled,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Styled components for consistent table styling
const StyledTableContainer = styled(TableContainer)(() => ({
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

const PatientTable = ({
  patients,
  selectedPatientId,
  onPatientSelect,
  loading,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Loading skeletons
  if (loading) {
    return (
      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderCell>ID</StyledHeaderCell>
              <StyledHeaderCell>Họ và tên</StyledHeaderCell>
              <StyledHeaderCell>Ngày sinh</StyledHeaderCell>
              <StyledHeaderCell>Ngày khám</StyledHeaderCell>
              <StyledHeaderCell>Địa chỉ</StyledHeaderCell>
              <StyledHeaderCell>Email LH</StyledHeaderCell>
              <StyledHeaderCell>SĐT</StyledHeaderCell>
              <StyledHeaderCell sx={{ textAlign: "center" }}>
                Số lần khám
              </StyledHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <Skeleton animation="wave" height={30} />
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Skeleton
                      variant="circular"
                      width={36}
                      height={36}
                      sx={{ mr: 2 }}
                    />
                    <Skeleton animation="wave" height={30} width="70%" />
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  <Skeleton animation="wave" height={30} />
                </StyledTableCell>
                <StyledTableCell>
                  <Skeleton animation="wave" height={30} />
                </StyledTableCell>
                <StyledTableCell>
                  <Skeleton animation="wave" height={30} width="80%" />
                </StyledTableCell>
                <StyledTableCell>
                  <Skeleton animation="wave" height={30} />
                </StyledTableCell>
                <StyledTableCell>
                  <Skeleton animation="wave" height={30} />
                </StyledTableCell>
                <StyledTableCell>
                  <Skeleton animation="wave" height={30} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    );
  }

  // Empty state
  if (!patients || patients.length === 0) {
    return (
      <Box
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid rgba(224, 224, 224, 0.3)",
        }}
      >
        <PersonIcon
          sx={{
            fontSize: 60,
            color: "rgba(0, 0, 0, 0.3)",
            mb: 2,
          }}
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Không tìm thấy bệnh nhân
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Không có bệnh nhân nào trong danh sách hoặc phù hợp với bộ lọc của
          bạn.
        </Typography>
      </Box>
    );
  }

  // Function to get a color based on ID (consistent color for same ID)
  const getAvatarColor = (id) => {
    const colors = [
      "#1976d2",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#5e35b1",
    ];
    return colors[id % colors.length];
  };

  return (
    <StyledTableContainer>
      <Table>
        <StyledTableHead>
          <TableRow>
            <StyledHeaderCell>Họ và tên</StyledHeaderCell>
            <StyledHeaderCell>Ngày sinh</StyledHeaderCell>
            <StyledHeaderCell>Ngày khám</StyledHeaderCell>
            <StyledHeaderCell>Email</StyledHeaderCell>
            <StyledHeaderCell>SĐT</StyledHeaderCell>
            <StyledHeaderCell sx={{ textAlign: "center" }}>
              Số lần khám
            </StyledHeaderCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {patients?.map((patient) => {
            const isSelected = selectedPatientId === patient.id;

            return (
              <StyledTableRow
                key={patient.id}
                onClick={() => onPatientSelect(patient.id)}
                selected={isSelected}
              >
                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        mr: 1.5,
                        backgroundColor: getAvatarColor(patient.id),
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {patient.name
                        ? patient.name.charAt(0).toUpperCase()
                        : "P"}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#333",
                          maxWidth: 200,
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          "& > *": { whiteSpace: "normal" },
                        }}
                      >
                        {patient.name}
                      </Typography>
                    </Box>
                  </Box>
                </StyledTableCell>

                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EventIcon
                      sx={{
                        fontSize: 18,
                        color: "#666666",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">
                      {formatDate(patient.dob)}
                    </Typography>
                  </Box>
                </StyledTableCell>

                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EventIcon
                      sx={{
                        fontSize: 18,
                        color: "#666666",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">
                      {formatDate(patient.date)}
                    </Typography>
                  </Box>
                </StyledTableCell>

                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon
                      sx={{
                        fontSize: 18,
                        color: "#666666",
                        mr: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        "& > *": { whiteSpace: "normal" },
                      }}
                    >
                      {patient.email || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </StyledTableCell>

                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon
                      sx={{
                        fontSize: 18,
                        color: "#666666",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">
                      {patient.phone || "Chưa cập nhật"}
                    </Typography>
                  </Box>
                </StyledTableCell>

                <StyledTableCell sx={{ textAlign: "center" }}>
                  <Chip
                    label={patient.count}
                    size="small"
                    color={
                      patient.count > 5
                        ? "success"
                        : patient.count > 2
                        ? "info"
                        : "default"
                    }
                    sx={{
                      fontWeight: 600,
                      minWidth: 30,
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default PatientTable;
