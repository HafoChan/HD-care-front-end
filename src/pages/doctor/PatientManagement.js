import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Pagination,
  Card,
  CardContent,
  InputAdornment,
  Paper,
  alpha,
  Divider,
  useTheme,
  Container,
  Grid,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from "@mui/icons-material/Info";
import Sidebar from "../../components/doctor/Sidebar";
import PatientTable from "../../components/doctor/PatientTable";
import { doctor } from "../../api/doctor";
import { useNavigate } from "react-router-dom";

const PatientManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );
  const [doctorId, setDoctorId] = useState();
  const [patients, setPatients] = useState();
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [keyword, setKeyword] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await doctor.getInfo();
        setDoctorId(response.result.id);
      } catch (error) {
        console.error("Error getting doctor info:", error);
      }
    };

    fetchDoctorInfo();
  }, []);

  // Thêm lọc thì sẽ thêm điều kiện để useEffect load
  useEffect(() => {
    if (doctorId) {
      fetchData(currentPage);
    }
  }, [selectedDate, doctorId, currentPage, keyword]);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      console.log(doctorId);
      const response = await doctor.getPatient(doctorId, page, keyword);
      if (response?.code === 1000) {
        setPatients(response?.result?.content);
        setTotalPages(response?.result?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
  };

  const handleViewDetail = () => {
    if (selectedPatientId) {
      navigate(`/doctor/patient-management/${selectedPatientId}`);
    } else {
      // Có thể hiển thị thông báo yêu cầu chọn bệnh nhân
      alert("Vui lòng chọn bệnh nhân để xem chi tiết");
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Box
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.98),
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Box maxWidth={200}>
        <Sidebar />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: "200px" },
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
                Quản Lý Bệnh Nhân
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Xem và quản lý danh sách bệnh nhân của bạn
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Tìm kiếm bệnh nhân..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
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
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleViewDetail}
                      disabled={!selectedPatientId}
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
                backgroundColor: "background.paper",
                boxShadow: theme.shadows[2],
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: theme.shadows[5],
                  transform: "translateY(-4px)",
                },
              }}
            >
              <PatientTable
                patients={patients}
                selectedPatientId={selectedPatientId}
                onPatientSelect={handlePatientSelect}
                loading={loading}
              />

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

export default PatientManagement;
