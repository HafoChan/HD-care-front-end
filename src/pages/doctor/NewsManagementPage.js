import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Tab,
  Tabs,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  alpha,
  useTheme,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  getNewsByDoctorAndStatus,
  createNews,
  deleteNews,
  getAllDoctors,
} from "../../api/newsApi";
import { format } from "date-fns";
import Layout from "../../components/doctor/Layout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DraftsIcon from "@mui/icons-material/Drafts";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { toast } from "react-toastify";
import RichTextEditor from "../../components/news/RichTextEditor";
import DOMPurify from "dompurify";

const NewsManagementPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("draft");
  const [currentPage, setCurrentPage] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const pageSize = 5;
  const theme = useTheme();
  const navigate = useNavigate();

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  // State for create news dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "",
    coverImageUrl: "",
    isDraft: true,
  });
  const [categories] = useState([
    "Sức khỏe tổng quát",
    "Dinh dưỡng",
    "Sức khỏe tâm thần",
    "Bệnh mãn tính",
    "COVID-19",
    "Y học phòng ngừa",
    "Thuốc và điều trị",
    "Sức khỏe phụ nữ",
    "Sức khỏe nam giới",
    "Sức khỏe người cao tuổi",
    "Sức khỏe trẻ em",
  ]);

  useEffect(() => {
    fetchNews();
  }, [activeTab, currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getNewsByDoctorAndStatus(
        activeTab,
        currentPage,
        pageSize
      );
      setNews(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Không thể tải tin tức. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin tức này?")) {
      try {
        await deleteNews(newsId);
        toast.success("Xóa tin tức thành công");
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
        toast.error("Không thể xóa tin tức. Vui lòng thử lại sau.");
      }
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return (
          <Chip
            icon={<CheckCircleIcon sx={{ pl: 1 }} fontSize="small" />}
            label="Đã duyệt"
            color="success"
            variant="outlined"
            size="medium"
          />
        );
      case "rejected":
        return (
          <Chip
            icon={<CancelIcon sx={{ pl: 1 }} fontSize="small" />}
            label="Từ chối"
            color="error"
            variant="outlined"
            size="medium"
          />
        );
      case "review":
        return (
          <Chip
            icon={<RateReviewIcon sx={{ pl: 1 }} fontSize="small" />}
            label="Đang xét duyệt"
            color="warning"
            variant="outlined"
            size="medium"
          />
        );
      case "draft":
        return (
          <Chip
            icon={<DraftsIcon sx={{ pl: 1 }} fontSize="small" />}
            label="Bản nháp"
            color="default"
            variant="outlined"
            size="medium"
          />
        );
      default:
        return null;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(0);
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

  // Create article dialog handlers
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setSelectedDoctor("");
    setNewArticle({
      title: "",
      content: "",
      category: "",
      coverImageUrl: "",
      isDraft: true,
    });
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRichTextChange = (content) => {
    setNewArticle((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleCreateArticle = async () => {
    try {
      if (!newArticle.title || !newArticle.content || !newArticle.category) {
        toast.error(
          "Vui lòng điền đầy đủ thông tin bắt buộc (tiêu đề, nội dung, danh mục)"
        );
        return;
      }

      const articleData = {
        ...newArticle,
        reviewerDoctorId: selectedDoctor || null,
      };

      await createNews(articleData);
      toast.success("Tạo bài viết thành công");
      handleCloseCreateDialog();
      fetchNews();
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error("Không thể tạo bài viết. Vui lòng thử lại sau.");
    }
  };

  const handleCreateAndPublish = async () => {
    try {
      if (!newArticle.title || !newArticle.content || !newArticle.category) {
        toast.error(
          "Vui lòng điền đầy đủ thông tin bắt buộc (tiêu đề, nội dung, danh mục)"
        );
        return;
      }

      const publishedArticle = {
        ...newArticle,
        isDraft: false,
        reviewerDoctorId: selectedDoctor || null,
      };

      await createNews(publishedArticle);
      toast.success("Bài viết đã được tạo và gửi để xét duyệt");
      handleCloseCreateDialog();
      setActiveTab("review");
      setCurrentPage(0);
      fetchNews();
    } catch (error) {
      console.error("Error publishing news:", error);
      toast.error("Không thể gửi bài viết. Vui lòng thử lại sau.");
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={600} color="primary.main">
            Quản lý bài viết
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ borderRadius: 8, textTransform: "none", px: 2, py: 1 }}
          >
            Tạo bài viết mới
          </Button>
        </Box>

        <Paper elevation={0} sx={{ mb: 3, p: 1, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 500,
                fontSize: "0.95rem",
                textTransform: "none",
              },
            }}
          >
            <Tab value="draft" label="Bản nháp" />
            <Tab value="review" label="Đang xét duyệt" />
            <Tab value="approved" label="Đã duyệt" />
            <Tab value="rejected" label="Bị từ chối" />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        ) : news.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Không có bài viết nào trong mục này.
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {news.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      ":hover": {
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
                            width: { xs: "100%", md: 200 },
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
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              component="div"
                              gutterBottom
                              fontWeight={600}
                            >
                              {item.title}
                            </Typography>
                            {getStatusChip(activeTab)}
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Danh mục: {item.category}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <AccessTimeIcon
                              sx={{
                                fontSize: 16,
                                mr: 0.5,
                                color: "text.secondary",
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(item.createdAt)}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            component="div"
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
                        <CardActions sx={{ px: 2, py: 1.5 }}>
                          <Button
                            component={Link}
                            to={`/news/${item.id}`}
                            startIcon={<VisibilityIcon />}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 8 }}
                          >
                            Xem
                          </Button>

                          {activeTab === "draft" && (
                            <Button
                              component={Link}
                              to={`/news/edit/${item.id}`}
                              startIcon={<EditIcon />}
                              variant="outlined"
                              color="secondary"
                              size="small"
                              sx={{ ml: 1, borderRadius: 8 }}
                            >
                              Sửa
                            </Button>
                          )}

                          <Button
                            startIcon={<DeleteIcon />}
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteNews(item.id)}
                            sx={{ ml: 1, borderRadius: 8 }}
                          >
                            Xóa
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
              <Typography variant="body1" sx={{ alignSelf: "center" }}>
                Trang {currentPage + 1}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={news.length < pageSize}
                sx={{ borderRadius: 8 }}
              >
                Trang sau
              </Button>
            </Box>
          </>
        )}

        {/* Create Article Dialog */}
        <Dialog
          open={openCreateDialog}
          onClose={handleCloseCreateDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight={600}>
              Tạo bài viết mới
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Tiêu đề bài viết"
                  value={newArticle.title}
                  onChange={handleCreateInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="category-label">Danh mục</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={newArticle.category}
                    onChange={handleCreateInputChange}
                    label="Danh mục"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="coverImageUrl"
                  label="Đường dẫn ảnh bìa"
                  value={newArticle.coverImageUrl}
                  onChange={handleCreateInputChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Nội dung bài viết
                </Typography>
                <RichTextEditor
                  value={newArticle.content}
                  onChange={handleRichTextChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={handleCloseCreateDialog}
              variant="outlined"
              sx={{ borderRadius: 8 }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateArticle}
              variant="outlined"
              color="primary"
              sx={{ borderRadius: 8, ml: 1 }}
            >
              Lưu nháp
            </Button>
            <Button
              onClick={handleCreateAndPublish}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 8, ml: 1 }}
            >
              Đăng bài viết
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default NewsManagementPage;
