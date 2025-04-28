import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import {
  getPendingNews,
  assignNewsToDoctor,
  getAllDoctors,
} from "../../api/newsApi";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";

const NewsManagementPage = () => {
  const [pendingNews, setPendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const theme = useTheme();

  const stripHtmlTags = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  useEffect(() => {
    fetchPendingNews();
    fetchDoctors();
  }, [currentPage]);

  const fetchPendingNews = async () => {
    try {
      setLoading(true);
      const data = await getPendingNews(currentPage, pageSize);
      setPendingNews(data || []);
    } catch (error) {
      console.error("Error fetching pending news:", error);
      toast.error("Không thể tải tin tức. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      console.log(data);
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const openAssignModal = (newsId) => {
    setSelectedNewsId(newsId);
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!doctorId) {
      toast.error("Vui lòng chọn bác sĩ");
      return;
    }

    try {
      await assignNewsToDoctor(selectedNewsId, doctorId);
      toast.success("Đã phân công bác sĩ duyệt tin tức thành công");
      setShowAssignModal(false);
      fetchPendingNews();
    } catch (error) {
      console.error("Error assigning news to doctor:", error);
      toast.error("Không thể phân công bác sĩ. Vui lòng thử lại sau.");
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={600} mb={3} color="primary.main">
        Quản lý tin tức
      </Typography>

      <Alert
        severity="info"
        variant="outlined"
        sx={{
          mb: 4,
          borderRadius: 2,
          "& .MuiAlert-icon": {
            alignItems: "center",
          },
        }}
      >
        Trang quản lý tin tức cho phép bạn xem các bài viết đang chờ duyệt và
        phân công cho bác sĩ duyệt.
      </Alert>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={3}>
          Bài viết đang chờ duyệt
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        ) : pendingNews.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Không có bài viết nào đang chờ duyệt.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {pendingNews.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: theme.shadows[2],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                      }}
                    >
                      {item.coverImageUrl && (
                        <CardMedia
                          component="img"
                          sx={{
                            width: { xs: "100%", md: 250 },
                            height: { xs: 200, md: "100%" },
                            objectFit: "cover",
                          }}
                          image={item.coverImageUrl}
                          alt={item.title}
                        />
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            component="div"
                            fontWeight={600}
                            gutterBottom
                          >
                            {item.title}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <PersonIcon
                                sx={{
                                  fontSize: 18,
                                  mr: 0.5,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Tác giả: {item.author?.fullName || "N/A"}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CategoryIcon
                                sx={{
                                  fontSize: 18,
                                  mr: 0.5,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Danh mục: {item.category}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <AccessTimeIcon
                                sx={{
                                  fontSize: 18,
                                  mr: 0.5,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(item.createdAt)}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {stripHtmlTags(item.content)
                              ? stripHtmlTags(item.content).substring(0, 300)
                              : ""}
                            {stripHtmlTags(item.content)?.length > 150
                              ? "..."
                              : ""}
                          </Typography>
                        </CardContent>

                        <Box sx={{ flexGrow: 1 }} />
                        <Divider />

                        <CardActions sx={{ p: 2 }}>
                          <Button
                            component={Link}
                            to={`/news/${item.id}`}
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            sx={{ borderRadius: 8 }}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<PersonAddIcon />}
                            onClick={() => openAssignModal(item.id)}
                            sx={{ ml: 1, borderRadius: 8 }}
                          >
                            Phân công duyệt
                          </Button>
                        </CardActions>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                sx={{ borderRadius: 8 }}
              >
                Trang trước
              </Button>
              <Typography variant="body1">Trang {currentPage + 1}</Typography>
              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={pendingNews.length < pageSize}
                sx={{ borderRadius: 8 }}
              >
                Trang sau
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Modal phân công bác sĩ */}
      <Dialog
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Phân công bác sĩ duyệt tin tức
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel id="doctor-select-label">Chọn bác sĩ</InputLabel>
            <Select
              labelId="doctor-select-label"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              label="Chọn bác sĩ"
            >
              <MenuItem value="" disabled>
                <em>-- Chọn bác sĩ --</em>
              </MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowAssignModal(false)}
            sx={{ borderRadius: 8 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssign}
            sx={{ ml: 1, borderRadius: 8 }}
          >
            Phân công
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsManagementPage;
