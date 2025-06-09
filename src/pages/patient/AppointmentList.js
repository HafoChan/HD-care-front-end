import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  Card,
  Avatar,
  Pagination,
  Container,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Button,
  TextField,
  Paper,
  Chip,
  Divider,
  Stack,
  useTheme,
  alpha,
  InputAdornment,
  Fade,
} from "@mui/material";
import PropTypes from "prop-types";
import HeaderComponent from "../../components/patient/HeaderComponent";
import { appointment } from "../../api/appointment";
import patientApi from "../../api/patient";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const getStatusColor = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "primary";
    case "PENDING":
      return "warning";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

const AppointmentCard = ({
  doctor,
  date,
  time,
  email,
  avatar,
  isActive,
  title,
  status,
  onclick,
}) => {
  const theme = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card
        onClick={onclick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
          marginBottom: 2,
          borderRadius: 2,
          border: isActive
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          boxShadow: isActive
            ? `0px 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`
            : `0px 1px 8px ${alpha(theme.palette.common.black, 0.05)}`,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0px 4px 16px ${alpha(
              theme.palette.primary.main,
              0.15
            )}`,
          },
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src={avatar}
            alt={doctor}
            sx={{
              width: 72,
              height: 72,
              mr: 3,
              boxShadow: `0px 2px 8px ${alpha(
                theme.palette.common.black,
                0.1
              )}`,
            }}
          />
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              Bác sĩ {doctor}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: 16,
                    mr: 0.5,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {date}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: 16,
                    mr: 0.5,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {time}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <EmailIcon
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: 16,
                  mr: 0.5,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Chip
            label={status}
            size="small"
            color={getStatusColor(status)}
            sx={{ mb: 1.5 }}
          />
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: "bold",
              mb: 1.5,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<VisibilityIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              fontSize: 12,
              px: 1.5,
            }}
          >
            Xem chi tiết
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

const AppointmentList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [localDate, setLocalDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );
  const [selectedDate, setSelectedDate] = useState(localDate);

  const [status, setStatus] = useState();
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);
  const [appointmentList, setAppointmentList] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  const fetchData = async () => {
    try {
      let response;
      if (week === null && month === null) {
        response = await appointment.getAppointmentByPatientId(
          id,
          selectedDate,
          null,
          null,
          status,
          currentPage
        );
      } else {
        response = await appointment.getAppointmentByPatientId(
          id,
          selectedDate,
          week,
          month,
          status,
          currentPage
        );
      }

      if (response.code === 1000) {
        console.log(response);
        setAppointmentList(response.result.content);
        setTotalPages(response.result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterMonth = (e) => {
    if (e.target.value === "month") {
      setMonth(selectedDate);
      setWeek(null);
    } else if (e.target.value === "week") {
      setWeek(selectedDate);
      setMonth(null);
    } else {
      setWeek(null);
      setMonth(null);
      setSelectedDate(selectedDate);
    }
  };

  const handleFilterStatus = (e) => {
    if (e.target.value === "CONFIRMED") setStatus("CONFIRMED");
    else if (e.target.value === "PENDING") setStatus("PENDING");
    else if (e.target.value === "COMPLETED") setStatus("COMPLETED");
    else if (e.target.value === "CANCELLED") setStatus("CANCELLED");
    else setStatus(null);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (month !== null) {
      setMonth(e.target.value);
    }
    if (week !== null) {
      setWeek(e.target.value);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleDetailClick = () => {
    if (selectedRow) {
      navigate(`/appointment-list/${selectedRow}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, selectedDate, week, month, status, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await patientApi.getInfo();
        console.log(response);
        if (response.code === 1000) setId(response.result.id);
      } catch (e) {
        console.error("Error fetching patient info:", e);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ bgcolor: alpha(theme.palette.background.default, 0.8) }}>
      <Container sx={{ maxWidth: 1200, py: 6 }}>
        <Divider sx={{ mb: 5 }} />

        <Fade in timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              mb: 4,
              background: `linear-gradient(120deg, ${alpha(
                theme.palette.primary.main,
                0.08
              )} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="700"
              color="primary.main"
              gutterBottom
            >
              Lịch hẹn của bạn
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 700 }}
            >
              Quản lý tất cả các cuộc hẹn của bạn với bác sĩ. Bạn có thể xem chi
              tiết, lọc theo ngày hoặc trạng thái, và theo dõi lịch sử các cuộc
              hẹn.
            </Typography>
          </Paper>
        </Fade>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="filter-time-label" size="small">
                Khoảng thời gian
              </InputLabel>
              <Select
                labelId="filter-time-label"
                size="small"
                onChange={(e) => handleFilterMonth(e)}
                label="Khoảng thời gian"
                IconComponent={FilterListIcon}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="cancel">Tất cả thời gian</MenuItem>
                <MenuItem value="week">Tuần này</MenuItem>
                <MenuItem value="month">Tháng này</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="filter-status-label" size="small">
                Trạng thái
              </InputLabel>
              <Select
                labelId="filter-status-label"
                size="small"
                onChange={(e) => handleFilterStatus(e)}
                label="Trạng thái"
                IconComponent={FilterListIcon}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="noFilter">Tất cả trạng thái</MenuItem>
                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                <MenuItem value="PENDING">Đang chờ</MenuItem>
                <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                height: "100%",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: `0px 4px 8px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
              }}
              onClick={handleDetailClick}
              disabled={!selectedRow}
              startIcon={<VisibilityIcon />}
            >
              Xem chi tiết lịch hẹn
            </Button>
          </Grid>
        </Grid>

        <Fade in timeout={800}>
          <Box>
            {appointmentList?.length > 0 ? (
              appointmentList?.map((item, index) => (
                <AppointmentCard
                  key={item?.id}
                  doctor={item?.nameDoctor}
                  date={item?.start?.split(" ")[0]}
                  time={`${item?.start?.split(" ")[1]} - ${
                    item?.end?.split(" ")[1]
                  }`}
                  email={item?.email}
                  avatar={item?.img}
                  title={item?.title}
                  status={item?.status}
                  isActive={selectedRow === item?.id}
                  onclick={() => handleRowClick(item?.id)}
                />
              ))
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: "center",
                  border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Không tìm thấy lịch hẹn nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bạn chưa có lịch hẹn nào hoặc không có lịch hẹn phù hợp với
                  các bộ lọc đã chọn
                </Typography>
              </Paper>
            )}

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" marginTop={4}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  size="large"
                />
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AppointmentList;
