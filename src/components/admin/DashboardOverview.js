import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Divider,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaNewspaper,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdFavorite, MdPendingActions, MdSearch } from "react-icons/md";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { doctor } from "../../api/doctor";
import { styled } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  getVisitStats,
  getRevenueStats,
  getNewsCountStats,
  getFavoriteNewsStats,
  getNewUsersStats,
  getAppointmentStats,
} from "../../api/statistics";
import { getAllDoctors } from "../../api/newsApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const StyledCard = styled(Paper)(() => ({
  height: "100%",
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(149, 157, 165, 0.1)",
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(149, 157, 165, 0.15)",
  },
}));

const IconBox = styled(Box)(({ bgcolor }) => ({
  width: 60,
  height: 60,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: bgcolor || "#1976d215",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StatCard = ({ icon, title, value, color }) => (
  <StyledCard>
    <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
      <IconBox bgcolor={`${color}15`}>{icon}</IconBox>
      <Box>
        <Typography variant="body2" color="#666666" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 600 }}>
          {value !== undefined ? value : <Skeleton width={50} />}
        </Typography>
      </Box>
    </CardContent>
  </StyledCard>
);

const TopDoctorCard = styled(Card)(({ rank }) => ({
  height: "100%",
  borderRadius: 16,
  overflow: "hidden",
  position: "relative",
  transition: "transform 0.3s, box-shadow 0.3s",
  boxShadow: "0 8px 24px rgba(149, 157, 165, 0.1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px rgba(149, 157, 165, 0.15)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: rank === 0 ? "#FFD700" : rank === 1 ? "#C0C0C0" : "#CD7F32",
  },
}));

const RankBadge = styled(Box)(({ bgcolor }) => ({
  position: "absolute",
  top: 20,
  right: 20,
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: bgcolor || "#1976d2",
  color: "white",
  fontWeight: "bold",
  fontSize: 18,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

const DoctorCardContent = ({ doctor, rank }) => (
  <Box sx={{ p: 3, textAlign: "center", position: "relative" }}>
    <RankBadge
      bgcolor={rank === 0 ? "#FFD700" : rank === 1 ? "#C0C0C0" : "#CD7F32"}
    >
      {rank + 1}
    </RankBadge>

    <Avatar
      src={doctor.img}
      alt={doctor.name}
      sx={{
        width: 120,
        height: 120,
        margin: "0 auto 16px",
        border: 3,
        borderColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    />
    <Typography variant="h6" fontWeight={600}>
      {doctor.name}
    </Typography>

    <Box
      sx={{
        mt: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <FaCalendarCheck color="#1976d2" />
      <Typography color="#666666" fontWeight={500}>
        {doctor.count} lượt khám
      </Typography>
    </Box>

    <Divider sx={{ my: 2 }} />

    <Box
      sx={{
        mt: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <EmojiEventsIcon
        sx={{
          fontSize: 20,
          color: rank === 0 ? "#FFD700" : rank === 1 ? "#C0C0C0" : "#CD7F32",
        }}
      />
      <Typography
        fontWeight={600}
        color={rank === 0 ? "#FFD700" : rank === 1 ? "#9e9e9e" : "#CD7F32"}
      >
        Top {rank + 1} Bác sĩ
      </Typography>
    </Box>
  </Box>
);

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

const SectionTitle = styled(Typography)(() => ({
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 24,
}));

// Chart wrapper with click handler
const ChartContainer = styled(Box)(({ theme }) => ({
  height: 300,
  position: "relative",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  "&::after": {
    content: '"Click để xem chi tiết"',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0.7)",
    color: "white",
    padding: "8px 16px",
    borderRadius: 4,
    opacity: 0,
    transition: "opacity 0.2s",
  },
  "&:hover::after": {
    opacity: 1,
  },
}));

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

const DashboardOverview = ({ totalDoctor, totalPatient }) => {
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);

  // Statistics states
  const [visitStats, setVisitStats] = useState([]);
  const [revenueStats, setRevenueStats] = useState([]);
  const [newsStats, setNewsStats] = useState([]);
  const [favoriteNews, setFavoriteNews] = useState([]);
  const [newUsers, setNewUsers] = useState({ newPatients: 0, newDoctors: 0 });
  const [appointmentStats, setAppointmentStats] = useState([]);

  // Navigate to statistics management with specific tab
  const navigateToStatistics = (statType) => {
    navigate(`/admin/statistics/${statType}`);
  };

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctor.getStatistic();
        setTopDoctors(response.result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch doctor statistics:", error);
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const doctorsList = await getAllDoctors();
        setDoctors(doctorsList || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchTopDoctors();
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true);

        const formattedFromDate = fromDate.format("YYYY-MM-DD");
        const formattedToDate = toDate.format("YYYY-MM-DD");

        // Fetch all statistics data
        const [
          visitsResponse,
          revenueResponse,
          newsCountResponse,
          favoriteNewsResponse,
          newUsersResponse,
          appointmentsResponse,
        ] = await Promise.all([
          getVisitStats(selectedDoctor, formattedFromDate, formattedToDate),
          getRevenueStats(selectedDoctor, formattedFromDate, formattedToDate),
          getNewsCountStats(selectedDoctor, formattedFromDate, formattedToDate),
          getFavoriteNewsStats(formattedFromDate, formattedToDate),
          getNewUsersStats(formattedFromDate, formattedToDate),
          getAppointmentStats(
            selectedDoctor,
            formattedFromDate,
            formattedToDate
          ),
        ]);

        console.log("Favorite News:", favoriteNewsResponse);
        console.log("News Count:", newsCountResponse);

        // Cập nhật cách xử lý response
        setVisitStats(visitsResponse?.result || []);
        setRevenueStats(revenueResponse?.result || []);
        setNewsStats(newsCountResponse?.result || []);
        setFavoriteNews(favoriteNewsResponse?.result || []);
        setNewUsers(
          newUsersResponse?.result || { newPatients: 0, newDoctors: 0 }
        );
        setAppointmentStats(appointmentsResponse?.result || []);

        setStatsLoading(false);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, [fromDate, toDate, selectedDoctor]);

  // Cập nhật cách xử lý dữ liệu cho biểu đồ
  const visitChartData = {
    labels: visitStats.map((stat) => {
      // Kiểm tra xem date có phải chuỗi hay đối tượng
      const dateStr =
        typeof stat.date === "string"
          ? stat.date
          : stat.date?.toISOString?.() || "";
      return dateStr.split("T")[0]; // Lấy phần ngày từ ISO string
    }),
    datasets: [
      {
        label: "Lượt truy cập",
        data: visitStats.map((stat) => stat.visits),
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // Cập nhật tương tự cho các biểu đồ khác
  const revenueChartData = {
    labels: revenueStats.map((stat) => {
      const dateStr =
        typeof stat.date === "string"
          ? stat.date
          : stat.date?.toISOString?.() || "";
      return dateStr.split("T")[0];
    }),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenueStats.map((stat) => stat.revenue),
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46, 125, 50, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const newsChartData = {
    labels: newsStats.map((stat) => {
      const dateStr =
        typeof stat.date === "string"
          ? stat.date
          : stat.date?.toISOString?.() || "";
      return dateStr.split("T")[0];
    }),
    datasets: [
      {
        label: "Số bài đăng",
        data: newsStats.map((stat) => stat.newsCount),
        borderColor: "#f57c00",
        backgroundColor: "rgba(245, 124, 0, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const appointmentChartData = {
    labels: appointmentStats.map((stat) => stat.status),
    datasets: [
      {
        label: "Số lịch hẹn",
        data: appointmentStats.map((stat) => stat.count),
        backgroundColor: [
          "rgba(25, 118, 210, 0.6)",
          "rgba(46, 125, 50, 0.6)",
          "rgba(245, 124, 0, 0.6)",
          "rgba(211, 47, 47, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate total statistics
  const totalVisits = visitStats.reduce(
    (total, stat) => total + stat.visits,
    0
  );
  const totalRevenue = revenueStats.reduce(
    (total, stat) => total + stat.revenue,
    0
  );
  const totalNews = newsStats.reduce(
    (total, stat) => total + stat.newsCount,
    0
  );

  return (
    <Box>
      <PageTitle variant="h4">Bảng điều khiển</PageTitle>

      {/* Filter controls */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Từ ngày"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Đến ngày"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              id="doctor-select"
              options={doctors}
              getOptionLabel={(option) => option.name || ""}
              value={doctors.find((doc) => doc.id === selectedDoctor) || null}
              onChange={(event, newValue) =>
                setSelectedDoctor(newValue ? newValue.id : "")
              }
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
                    src={option.img}
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
        </Grid>
      </Paper>

      {/* Main statistics cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<FaUserMd size={28} color="#1976d2" />}
            title="Tổng số bác sĩ"
            value={totalDoctor}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<FaUsers size={28} color="#2e7d32" />}
            title="Tổng số khách hàng"
            value={totalPatient}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<FaMoneyBillWave size={28} color="#f57c00" />}
            title="Doanh thu"
            value={
              statsLoading ? undefined : `${totalRevenue.toLocaleString()} VND`
            }
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<FaCalendarCheck size={28} color="#d32f2f" />}
            title="Lượt truy cập"
            value={statsLoading ? undefined : totalVisits}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* New users statistics */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <SectionTitle>Người dùng mới</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatCard
              icon={<FaUsers size={28} color="#5e35b1" />}
              title="Bệnh nhân mới"
              value={statsLoading ? undefined : newUsers.newPatients}
              color="#5e35b1"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatCard
              icon={<FaUserMd size={28} color="#00897b" />}
              title="Bác sĩ mới"
              value={statsLoading ? undefined : newUsers.newDoctors}
              color="#00897b"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Charts */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <SectionTitle>Thống kê lượt truy cập</SectionTitle>
            {statsLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Tooltip
                title="Click để xem chi tiết thống kê lượt truy cập"
                arrow
              >
                <ChartContainer onClick={() => navigateToStatistics("visits")}>
                  <Line
                    data={visitChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </Tooltip>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <SectionTitle>Thống kê doanh thu</SectionTitle>
            {statsLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Tooltip title="Click để xem chi tiết thống kê doanh thu" arrow>
                <ChartContainer onClick={() => navigateToStatistics("revenue")}>
                  <Bar
                    data={revenueChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </Tooltip>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <SectionTitle>Thống kê bài đăng</SectionTitle>
            {statsLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Tooltip title="Click để xem chi tiết thống kê bài đăng" arrow>
                <ChartContainer onClick={() => navigateToStatistics("news")}>
                  <Line
                    data={newsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </Tooltip>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <SectionTitle>Thống kê lịch hẹn</SectionTitle>
            {statsLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Tooltip title="Click để xem chi tiết thống kê lịch hẹn" arrow>
                <ChartContainer
                  onClick={() => navigateToStatistics("appointments")}
                >
                  <Pie
                    data={appointmentChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                </ChartContainer>
              </Tooltip>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Top news section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <SectionTitle sx={{ mb: 0 }}>Bài viết được yêu thích</SectionTitle>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 500 }}
            onClick={() => navigateToStatistics("favoriteNews")}
          >
            Xem tất cả
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {statsLoading
            ? Array.from(new Array(5)).map((_, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="20%" height={24} />
                  </Paper>
                </Grid>
              ))
            : favoriteNews.slice(0, 5).map((news, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                    onClick={() => navigateToStatistics("favoriteNews")}
                  >
                    <Typography variant="subtitle1" fontWeight={500}>
                      {news.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MdFavorite color="#d32f2f" />
                      <Typography color="text.secondary">
                        {news.favoriteCount} lượt thích
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
        </Grid>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <SectionTitle>Bác sĩ nổi bật</SectionTitle>

        <Grid container spacing={3}>
          {loading
            ? // Skeleton loading state
              Array.from(new Array(3)).map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <StyledCard>
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Skeleton
                        variant="circular"
                        width={120}
                        height={120}
                        sx={{ mx: "auto" }}
                      />
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={30}
                        sx={{ mx: "auto", mt: 2 }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={24}
                        sx={{ mx: "auto", mt: 1 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={1}
                        sx={{ my: 2 }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={24}
                        sx={{ mx: "auto", mt: 1 }}
                      />
                    </Box>
                  </StyledCard>
                </Grid>
              ))
            : topDoctors.map((doctor, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <TopDoctorCard rank={index}>
                    <DoctorCardContent doctor={doctor} rank={index} />
                  </TopDoctorCard>
                </Grid>
              ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardOverview;
