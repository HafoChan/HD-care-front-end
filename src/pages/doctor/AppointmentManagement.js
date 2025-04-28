import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  TextField,
  Button,
  Pagination,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  alpha,
  useTheme,
  Fade,
  Grid,
  Container,
  InputAdornment,
  Chip,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";

import Sidebar from "../../components/doctor/Sidebar";
import AppointmentTable from "../../components/doctor/AppointmentTable";
import { appointment } from "../../api/appointment";
import { doctor } from "../../api/doctor";
import { useNavigate } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AppointmentManagement = () => {
  const theme = useTheme();
  const [appointments, setAppointments] = useState();
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );

  const [value, setValue] = React.useState(0);
  const [dateFilter, setDateFilter] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);

  const [doctorId, setDoctorId] = useState();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPage(1);
    fetchData(newValue, 1);
  };

  const handleDateFilter = (e) => {
    console.log(e.target.value);
    setDateFilter(e.target.value);
  };

  const fetchData = async (value, page) => {
    const status = filterAppointment(value);
    let response;

    try {
      setLoading(true);
      if (dateFilter === "today" || dateFilter === "cancel") {
        response = await appointment.getAppointmentByDoctor(
          doctorId,
          status,
          selectedDate,
          page,
          keyword
        );
      } else {
        const week = dateFilter === "week" ? selectedDate : null;
        const month = dateFilter === "month" ? selectedDate : null;

        response = await appointment.getAppointmentFilter(
          doctorId,
          week,
          month,
          status,
          page,
          keyword
        );
      }

      if (response.code === 1000) {
        setAppointments(response.result);
        console.log(response.result.content);
        setTotalPages(response.result.totalPages || 1);
        setLoading(false);
      } else {
        console.error("Error fetching appointment data:", response.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchData(value, currentPage);
    }
  }, [value, dateFilter, selectedDate, currentPage, doctorId, keyword]);

  useEffect(() => {
    doctor
      .getInfo()
      .then((response) => {
        setDoctorId(response?.result.id);
      })
      .catch((error) => console.error("Error getting doctor info:", error));
  }, []);

  const filterAppointment = (value) => {
    if (value === 0) return "PENDING";
    else if (value === 1) return "CONFIRMED";
    else if (value === 2) return "COMPLETED";
    else return "CANCELLED";
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeSearch = (e) => {
    setKeyword(e.target.value);
  };

  const handleViewDetail = () => {
    if (selectedRow) {
      navigate(`/doctor/appointment-management/${selectedRow}`);
    } else {
      alert("Vui lòng chọn cuộc hẹn để xem chi tiết");
    }
  };

  const getStatusIcon = (index) => {
    switch (index) {
      case 0:
        return <PendingIcon />;
      case 1:
        return <CheckCircleIcon />;
      case 2:
        return <TaskAltIcon />;
      case 3:
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const getStatusColor = (index) => {
    switch (index) {
      case 0: // PENDING
        return theme.palette.warning.main;
      case 1: // CONFIRMED
        return theme.palette.info.main;
      case 2: // COMPLETED
        return theme.palette.success.main;
      case 3: // CANCELLED
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.98),
        minHeight: "100vh",
        display: "flex",
        padding: 0,
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0 },
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
                Quản Lý Lịch Hẹn
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Xem và quản lý lịch hẹn khám của bệnh nhân
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
                      placeholder="Tìm kiếm lịch hẹn..."
                      onChange={handleChangeSearch}
                      value={keyword}
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
                        value={dateFilter}
                        onChange={(e) => handleDateFilter(e)}
                        label="Lọc theo thời gian"
                        startAdornment={
                          <InputAdornment position="start">
                            <FilterListIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="cancel">Bỏ lọc</MenuItem>
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
                      onClick={handleViewDetail}
                      disabled={!selectedRow}
                      startIcon={<InfoIcon />}
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
                      Xem chi tiết
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
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="appointment tabs"
                sx={{
                  borderBottom: 1,
                  borderColor: alpha(theme.palette.divider, 0.1),
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                  },
                  px: 2,
                  pt: 1,
                }}
                variant="scrollable"
                scrollButtons="auto"
              >
                {["Chờ xác nhận", "Đã xác nhận", "Đã hoàn thành", "Đã hủy"].map(
                  (label, index) => (
                    <Tab
                      key={index}
                      icon={getStatusIcon(index)}
                      iconPosition="start"
                      label={label}
                      {...a11yProps(index)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color:
                          value === index
                            ? getStatusColor(index)
                            : "text.secondary",
                        "&.Mui-selected": {
                          color: getStatusColor(index),
                        },
                        minHeight: 48,
                        py: 1.5,
                      }}
                    />
                  )
                )}
              </Tabs>

              <Box sx={{ mt: 1 }}>
                <CustomTabPanel value={value} index={0}>
                  <AppointmentTable
                    appointments={appointments}
                    doctorId={doctorId}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    loading={loading}
                    status="PENDING"
                  />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                  <AppointmentTable
                    appointments={appointments}
                    doctorId={doctorId}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    loading={loading}
                    status="CONFIRMED"
                  />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={2}>
                  <AppointmentTable
                    appointments={appointments}
                    doctorId={doctorId}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    loading={loading}
                    status="COMPLETED"
                  />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={3}>
                  <AppointmentTable
                    appointments={appointments}
                    doctorId={doctorId}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    loading={loading}
                    status="CANCELLED"
                  />
                </CustomTabPanel>
              </Box>

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
                  count={totalPages}
                  page={currentPage}
                  onChange={handleChangePage}
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
    </Box>
  );
};

export default AppointmentManagement;
