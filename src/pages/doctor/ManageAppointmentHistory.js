import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Checkbox,
  Chip,
  Pagination,
  Tooltip,
  Container,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Fade,
  alpha,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/doctor/Sidebar";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import appointApi from "../../api/appointApi";
import { doctor } from "../../api/doctor";
import { appointment } from "../../api/appointment";
import { alpha as muiAlpha } from "@mui/material/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTheme } from "@mui/material/styles";

// Styled components for consistent table styling
const StyledTableContainer = styled(TableContainer)(() => ({
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
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

const ManageAppointmentHistory = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    dateFilter: "all",
    searchTerm: "",
    currentPage: 1,
  });
  const [selected, setSelected] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState({});
  const [pageMax, setPageMax] = useState(1);
  const [userInfo, setUserInfo] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  const getData = async (doctorId) => {
    const today = new Date().toISOString().split("T")[0];
    let response;

    try {
      switch (filters.dateFilter) {
        case "today":
          response = await appointment.filterByToday(
            doctorId,
            "COMPLETED",
            today,
            filters.currentPage,
            filters.searchTerm
          );
          break;
        case "week":
          response = await appointment.filterByWeekAndMonth(
            doctorId,
            today,
            null,
            "COMPLETED",
            filters.currentPage,
            filters.searchTerm
          );
          break;
        case "month":
          response = await appointment.filterByWeekAndMonth(
            doctorId,
            null,
            today,
            "COMPLETED",
            filters.currentPage,
            filters.searchTerm
          );
          break;
        default:
          response = await appointApi.getAppointmentById(
            doctorId,
            filters.currentPage,
            filters.searchTerm,
            "COMPLETED"
          );
      }

      setMedicalRecords(response.result?.content);
      setPageMax(response.result?.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDateFilter = (value) => {
    setFilters((prev) => ({
      ...prev,
      dateFilter: value,
      currentPage: 1, // Reset về trang 1 khi thay đổi bộ lọc
    }));
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: value,
      currentPage: 1, // Reset về trang 1 khi tìm kiếm
    }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  useEffect(() => {
    doctor
      .getInfo()
      .then((response) => {
        setUserInfo(response.result);
        getData(response.result.id);
      })
      .catch((error) => console.error("Error getting doctor info:", error));
  }, [filters]); // Chạy lại effect khi filters thay đổi

  const handleSelect = (id) => {
    // Nếu id đã được chọn thì bỏ chọn
    if (selected.includes(id)) {
      setSelected([]);
    } else {
      // Nếu id chưa được chọn thì chọn nó và bỏ chọn các id khác
      setSelected([id]);
    }
  };

  const handlePrescription = () => {
    if (selected.length === 1) {
      const record = medicalRecords.find((r) => r.id === selected[0]);
      navigate("/doctor/prescription-management", {
        state: { appointment: record },
      });
    }
  };

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

  const getNextStatus = (currentStatus) => {
    const statuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  const handleStatusChange = (id, newStatus) => {
    setMedicalRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, status: newStatus } : record
      )
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.98),
        minHeight: "100vh",
        display: "flex",
        pb: 10,
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: "280px" },
          transition: "margin 0.2s ease",
          py: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Fade in timeout={800}>
          <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              >
                Lịch Sử Khám
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Xem và quản lý lịch sử khám của bệnh nhân
              </Typography>

              <Card
                elevation={0}
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(20px)",
                  border: "1px solid",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.12)
                      : alpha(theme.palette.common.black, 0.08),
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Tìm kiếm lịch sử khám..."
                      value={filters.searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          backgroundColor: theme.palette.background.paper,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.divider, 0.3),
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon
                              sx={{ color: "text.secondary" }}
                            />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          backgroundColor: theme.palette.background.paper,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.divider, 0.3),
                          },
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: theme.palette.background.paper,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.divider, 0.3),
                          },
                        },
                      }}
                    >
                      <InputLabel id="appointment-filter-label" size="small">
                        Lọc theo thời gian
                      </InputLabel>
                      <Select
                        labelId="appointment-filter-label"
                        size="small"
                        value={filters.dateFilter}
                        onChange={(e) => handleDateFilter(e.target.value)}
                        label="Lọc theo thời gian"
                        startAdornment={
                          <InputAdornment position="start">
                            <FilterListIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="all">Tất cả ngày</MenuItem>
                        <MenuItem value="today">Hôm nay</MenuItem>
                        <MenuItem value="week">Tuần này</MenuItem>
                        <MenuItem value="month">Tháng này</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handlePrescription}
                      disabled={selected.length !== 1}
                      startIcon={<MedicalServicesIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: theme.shadows[3],
                        transition: "all 0.2s ease",
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: theme.shadows[6],
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Kê đơn thuốc
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Box>

            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(20px)",
                boxShadow: theme.shadows[2],
                border: "1px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.12)
                    : alpha(theme.palette.common.black, 0.08),
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: theme.shadows[4],
                  transform: "translateY(-4px)",
                },
              }}
            >
              <StyledTableContainer>
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <StyledHeaderCell>Họ và tên</StyledHeaderCell>
                      <StyledHeaderCell>Ngày sinh</StyledHeaderCell>
                      <StyledHeaderCell>Ngày khám</StyledHeaderCell>
                      <StyledHeaderCell>Tiêu đề</StyledHeaderCell>
                      <StyledHeaderCell>Email LH</StyledHeaderCell>
                      <StyledHeaderCell>Trạng thái</StyledHeaderCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {medicalRecords &&
                      medicalRecords.length > 0 &&
                      medicalRecords.map((record) => (
                        <StyledTableRow
                          key={record.id}
                          hover
                          selected={selected.indexOf(record.id) !== -1}
                          onClick={() => handleSelect(record.id)}
                        >
                          <StyledTableCell>{record.name}</StyledTableCell>
                          <StyledTableCell>{record.dob}</StyledTableCell>
                          <StyledTableCell>
                            {record.start.split(" ")[0]}{" "}
                            {record.start.split(" ")[1].split(":")[0]}:00 -{" "}
                            {record.end.split(" ")[1].split(":")[0]}:00
                          </StyledTableCell>
                          <StyledTableCell>
                            {record.description}
                          </StyledTableCell>
                          <StyledTableCell>{record.email}</StyledTableCell>
                          <StyledTableCell>
                            <Chip
                              label={record.status}
                              color={getStatusColor(record.status)}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                borderRadius: "6px",
                              }}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>

              <Box
                display="flex"
                justifyContent="center"
                sx={{
                  py: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                  borderTop: "1px solid",
                  borderTopColor: alpha(theme.palette.divider, 0.1),
                }}
              >
                <Pagination
                  count={pageMax}
                  page={filters.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  siblingCount={1}
                  size="medium"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: 500,
                      borderRadius: 1.5,
                      "&.Mui-selected": {
                        fontWeight: 600,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Fade>
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "calc(100% - 280px)",
          bgcolor: "background.paper",
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} HD-Care. Bảo lưu mọi quyền.
        </Typography>
      </Box>
    </Box>
  );
};

export default ManageAppointmentHistory;
