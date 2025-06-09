import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
  IconButton,
  Skeleton,
  Avatar,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import {
  getVisitStats,
  getRevenueStats,
  getNewsCountStats,
  getFavoriteNewsStats,
  getNewUsersStats,
  getAppointmentStats,
} from "../../api/statistics";
import { getAllDoctors } from "../../api/newsApi";
import { Link } from "react-router-dom";

const PageTitle = styled(Typography)(() => ({
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 24,
  position: "relative",
  paddingBottom: 12,
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1976d2",
  },
}));

// Function to export table data to CSV
const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;

  // Determine headers from first object keys
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((field) => {
          const value = row[field];
          // Handle values with commas by wrapping in quotes
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    ),
  ].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Doctor option with avatar display
const DoctorOption = styled("li")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const StatisticsManagement = ({ statType = "visits" }) => {
  const [activeTab, setActiveTab] = useState(statType);
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Statistics data states
  const [visitStats, setVisitStats] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);
  const [newsStats, setNewsStats] = useState([]);
  const [favoriteNews, setFavoriteNews] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState([]);

  // Sorting states
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("");

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Helper function for sorting
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedData = (array) => {
    if (!orderBy) return array;
    return [...array].sort(getComparator(order, orderBy));
  };

  // Load doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsList = await getAllDoctors();
        setDoctors(doctorsList || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Load statistics data based on active tab and filters
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        const formattedFromDate = fromDate.format("YYYY-MM-DD");
        const formattedToDate = toDate.format("YYYY-MM-DD");

        // Fetch statistics based on active tab
        switch (activeTab) {
          case "visits":
            const visitsResponse = await getVisitStats(
              selectedDoctor,
              formattedFromDate,
              formattedToDate
            );
            console.log("Visits response:", visitsResponse);
            setVisitStats(visitsResponse?.result || []);
            break;

          case "revenue":
            const revenueResponse = await getRevenueStats(
              selectedDoctor,
              formattedFromDate,
              formattedToDate
            );
            console.log("Revenue response:", revenueResponse);
            setRevenueStats(revenueResponse?.result || []);
            break;

          case "news":
            const newsResponse = await getNewsCountStats(
              selectedDoctor,
              formattedFromDate,
              formattedToDate
            );
            console.log("News response:", newsResponse);
            setNewsStats(newsResponse?.result || []);
            break;

          case "favoriteNews":
            const favoriteNewsResponse = await getFavoriteNewsStats(
              formattedFromDate,
              formattedToDate
            );
            console.log("Favorite news response:", favoriteNewsResponse);
            setFavoriteNews(favoriteNewsResponse?.result || []);
            break;

          case "appointments":
            const appointmentsResponse = await getAppointmentStats(
              selectedDoctor,
              formattedFromDate,
              formattedToDate
            );
            console.log("Appointments response:", appointmentsResponse);
            setAppointmentStats(appointmentsResponse?.result || []);
            break;

          default:
            break;
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [activeTab, fromDate, toDate, selectedDoctor]);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "visits":
        return sortedData(visitStats);
      case "revenue":
        return sortedData(revenueStats);
      case "news":
        return sortedData(newsStats);
      case "favoriteNews":
        return sortedData(favoriteNews);
      case "appointments":
        return sortedData(appointmentStats);
      default:
        return [];
    }
  };

  // Table headers based on active tab
  const getTableHeaders = () => {
    switch (activeTab) {
      case "visits":
        return [
          { id: "doctorName", label: "Bác sĩ" },
          { id: "date", label: "Ngày" },
          { id: "visits", label: "Lượt truy cập", numeric: true },
        ];
      case "revenue":
        return [
          { id: "doctorName", label: "Bác sĩ" },
          { id: "date", label: "Ngày" },
          { id: "revenue", label: "Doanh thu (VND)", numeric: true },
        ];
      case "news":
        return [
          { id: "doctorName", label: "Bác sĩ" },
          { id: "date", label: "Ngày" },
          { id: "newsCount", label: "Số bài đăng", numeric: true },
        ];
      case "favoriteNews":
        return [
          { id: "newsId", label: "ID" },
          { id: "title", label: "Tiêu đề" },
          { id: "favoriteCount", label: "Lượt thích", numeric: true },
        ];
      case "appointments":
        return [
          { id: "doctorName", label: "Bác sĩ" },
          { id: "status", label: "Trạng thái" },
          { id: "count", label: "Số lượng", numeric: true },
        ];
      default:
        return [];
    }
  };

  // Get active tab name for display
  const getActiveTabName = () => {
    switch (activeTab) {
      case "visits":
        return "Lượt truy cập";
      case "revenue":
        return "Doanh thu";
      case "news":
        return "Bài đăng";
      case "favoriteNews":
        return "Bài viết được yêu thích";
      case "appointments":
        return "Lịch hẹn";
      default:
        return "";
    }
  };

  // Export current data
  const handleExport = () => {
    exportToCSV(
      getCurrentData(),
      `thong-ke-${activeTab}-${fromDate.format("YYYY-MM-DD")}-${toDate.format(
        "YYYY-MM-DD"
      )}`
    );
  };

  // Xử lý hiển thị ngày đúng cách cho các hàng dữ liệu
  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    try {
      // Kiểm tra xem date có phải chuỗi hay đối tượng
      const dateStr =
        typeof dateValue === "string"
          ? dateValue
          : dateValue?.toISOString?.() || "";

      // Nếu là chuỗi ISO date hoặc có thể chuyển đổi
      if (dateStr) {
        return dayjs(dateStr).format("DD/MM/YYYY");
      }

      return "";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            component={Link}
            to="/admin"
            sx={{ mr: 2 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <PageTitle variant="h4">
            Quản lý thống kê: {getActiveTabName()}
          </PageTitle>
        </Box>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={loading || !getCurrentData().length}
        >
          Xuất CSV
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Lượt truy cập" value="visits" />
          <Tab label="Doanh thu" value="revenue" />
          <Tab label="Bài đăng" value="news" />
          <Tab label="Bài viết được yêu thích" value="favoriteNews" />
          <Tab label="Lịch hẹn" value="appointments" />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Từ ngày"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Đến ngày"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              id="doctor-select"
              options={doctors}
              getOptionLabel={(option) => option.name || ""}
              value={doctors.find((doc) => doc.id === selectedDoctor) || null}
              onChange={(event, newValue) =>
                setSelectedDoctor(newValue ? newValue.id : "")
              }
              disabled={activeTab === "favoriteNews"}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bác sĩ"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        <SearchIcon color="action" sx={{ mr: 1 }} />
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <DoctorOption {...props}>
                  <Avatar
                    src={option.avatar}
                    alt={option.name}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2">{option.name}</Typography>
                </DoctorOption>
              )}
              fullWidth
              freeSolo
              disableClearable={false}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setLoading(true)} // This will trigger the useEffect
              sx={{ height: "56px" }}
            >
              Áp dụng bộ lọc
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              {getTableHeaders().map((header) => (
                <TableCell
                  key={header.id}
                  align={header.numeric ? "right" : "left"}
                  sortDirection={orderBy === header.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === header.id}
                    direction={orderBy === header.id ? order : "asc"}
                    onClick={() => handleRequestSort(header.id)}
                  >
                    {header.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width={20} />
                  </TableCell>
                  {getTableHeaders().map((header, i) => (
                    <TableCell
                      key={i}
                      align={header.numeric ? "right" : "left"}
                    >
                      <Skeleton width={header.numeric ? 80 : 150} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : getCurrentData().length === 0 ? (
              // No data
              <TableRow>
                <TableCell
                  colSpan={getTableHeaders().length + 1}
                  align="center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              // Actual data
              getCurrentData().map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{index + 1}</TableCell>
                  {getTableHeaders().map((header) => (
                    <TableCell
                      key={header.id}
                      align={header.numeric ? "right" : "left"}
                    >
                      {header.id === "date"
                        ? formatDate(row[header.id])
                        : header.id === "revenue"
                        ? row[header.id].toLocaleString()
                        : row[header.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatisticsManagement;
