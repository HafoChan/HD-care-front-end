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
  LinearProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  getNewsByDoctorAndStatus,
  createNews,
  deleteNews,
  getAllDoctors,
  updateNews,
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
import ImageIcon from "@mui/icons-material/Image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import RichTextEditor from "../../components/news/RichTextEditor";
import DOMPurify from "dompurify";
import UploadFilesService from "../../service/otherService/upload";
import UploadFiles from "../../components/patient/uploadFile";

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

  // State for edit news dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentNews, setCurrentNews] = useState({
    id: "",
    title: "",
    content: "",
    category: "",
    coverImageUrl: "",
    isDraft: true,
  });
  const [categories] = useState([
    "Sức khỏe tổng quát",
    "Dinh dưỡng",
    "Thuốc và điều trị",
    "Chăm sóc da mặt cơ bản",
    "Dưỡng ẩm và làm sạch",
    "Da mụn và điều trị mụn",
    "Da nhạy cảm và cách xử lý",
    "Chống lão hóa da",
    "Thải độc và phục hồi da",
    "Dinh dưỡng cho làn da khỏe",
    "Thực phẩm tốt cho da mặt",
    "Thói quen sống và làn da",
    "Sức khỏe tổng thể và ảnh hưởng đến da",
    "Tư vấn da liễu chuyên sâu",
    "Cách lựa chọn mỹ phẩm phù hợp",
    "Skincare theo mùa",
    "Bảo vệ da khỏi tia UV",
    "Chăm sóc da sau điều trị thẩm mỹ",
    "Căng bóng – trẻ hóa da",
    "Lỗ chân lông và kiểm soát dầu",
    "Da khô, da dầu, da hỗn hợp – phân loại & chăm sóc",
  ]);

  // Cover image states for dialog
  const [coverImagePath, setCoverImagePath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Cover image states for edit dialog
  const [editCoverImagePath, setEditCoverImagePath] = useState("");
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadError, setEditUploadError] = useState("");

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
    // Reset upload states
    setCoverImagePath("");
    setUploading(false);
    setUploadError("");
  };

  // Handle file upload from UploadFiles component
  const handleCoverImageUpload = (fileInfos) => {
    if (fileInfos && fileInfos.length > 0) {
      setCoverImagePath(fileInfos[0]);
      setNewArticle((prev) => ({
        ...prev,
        coverImageUrl: fileInfos[0],
      }));
      setUploadError("");
    }
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
        coverImageUrl: coverImagePath || "",
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
        coverImageUrl: coverImagePath || "",
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

  // Handle file selection for cover image
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Vui lòng chọn file ảnh");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Kích thước file không được vượt quá 5MB");
        return;
      }

      setCoverImagePath(URL.createObjectURL(file));
      setUploadError("");
      setUploading(false);
    }
  };

  // Upload cover image
  const handleUploadImage = async () => {
    if (!coverImagePath) return;

    setUploading(true);
    setUploadError("");

    try {
      const response = await UploadFilesService.uploadSingleImage(
        coverImagePath, // Upload 1 ảnh
        (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      );

      if (response?.result?.fileLinks && response.result.fileLinks.length > 0) {
        const uploadedPath = response.result.fileLinks[0];
        setCoverImagePath(uploadedPath);
        setUploading(false);
        toast.success("Tải ảnh lên thành công");
      } else {
        throw new Error("Không nhận được URL ảnh từ server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Không thể upload ảnh. Vui lòng thử lại.");
      setUploading(false);
      toast.error("Không thể tải ảnh lên");
    }
  };

  // Remove cover image
  const handleRemoveImage = () => {
    setCoverImagePath("");
    setNewArticle((prev) => ({
      ...prev,
      coverImageUrl: "",
    }));
    setUploading(false);
    setUploadError("");
  };

  // Handle file upload from UploadFiles component for edit dialog
  const handleEditCoverImageUpload = (fileInfos) => {
    if (fileInfos && fileInfos.length > 0) {
      setEditCoverImagePath(fileInfos[0]);
      setCurrentNews((prev) => ({
        ...prev,
        coverImageUrl: fileInfos[0],
      }));
      setEditUploadError("");
    }
  };

  // Open edit dialog handler
  const handleOpenEditDialog = (article) => {
    setCurrentNews({
      id: article.id,
      title: article.title,
      content: article.content,
      category: article.category,
      coverImageUrl: article.coverImageUrl || "",
      isDraft: true, // Giữ nguyên là draft
    });
    setEditCoverImagePath(article.coverImageUrl || "");
    setOpenEditDialog(true);
  };

  // Close edit dialog handler
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentNews({
      id: "",
      title: "",
      content: "",
      category: "",
      coverImageUrl: "",
      isDraft: true,
    });
    // Reset upload states
    setEditCoverImagePath("");
    setEditUploading(false);
    setEditUploadError("");
  };

  // Handle edit input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNews((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle edit rich text change
  const handleEditRichTextChange = (content) => {
    setCurrentNews((prev) => ({
      ...prev,
      content,
    }));
  };

  // Handle update article
  const handleUpdateArticle = async () => {
    try {
      if (!currentNews.title || !currentNews.content || !currentNews.category) {
        toast.error(
          "Vui lòng điền đầy đủ thông tin bắt buộc (tiêu đề, nội dung, danh mục)"
        );
        return;
      }

      const updateData = {
        title: currentNews.title,
        content: currentNews.content,
        category: currentNews.category,
        coverImageUrl: editCoverImagePath || "",
        isDraft: true,
      };

      const response = await updateNews(currentNews.id, updateData);
      toast.success("Cập nhật bài viết thành công");
      handleCloseEditDialog();
      fetchNews();
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Không thể cập nhật bài viết. Vui lòng thử lại sau.");
    }
  };

  // Handle update and publish article
  const handleUpdateAndPublish = async () => {
    try {
      if (!currentNews.title || !currentNews.content || !currentNews.category) {
        toast.error(
          "Vui lòng điền đầy đủ thông tin bắt buộc (tiêu đề, nội dung, danh mục)"
        );
        return;
      }

      const updateData = {
        title: currentNews.title,
        content: currentNews.content,
        category: currentNews.category,
        coverImageUrl: editCoverImagePath || "",
        isDraft: false,
      };

      await updateNews(currentNews.id, updateData);
      toast.success("Bài viết đã được cập nhật và gửi để xét duyệt");
      handleCloseEditDialog();
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
                            to={`/news/review/${item.id}`}
                            startIcon={<VisibilityIcon />}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 8 }}
                          >
                            Xem
                          </Button>

                          {activeTab === "draft" && (
                            <Button
                              startIcon={<EditIcon />}
                              variant="outlined"
                              color="secondary"
                              size="small"
                              sx={{ ml: 1, borderRadius: 8 }}
                              onClick={() => handleOpenEditDialog(item)}
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

              {/* Cover Image Upload Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Ảnh bìa
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <UploadFiles
                    askUrl={handleCoverImageUpload}
                    coverImageUpload={true}
                  />
                  {uploadError && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {uploadError}
                    </Typography>
                  )}
                </Box>
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

        {/* Edit Article Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight={600}>
              Chỉnh sửa bài viết
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Tiêu đề bài viết"
                  value={currentNews.title}
                  onChange={handleEditInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="edit-category-label">Danh mục</InputLabel>
                  <Select
                    labelId="edit-category-label"
                    name="category"
                    value={currentNews.category}
                    onChange={handleEditInputChange}
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

              {/* Cover Image Upload Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Ảnh bìa
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <UploadFiles
                    askUrl={handleEditCoverImageUpload}
                    coverImageUpload={true}
                    initialImage={currentNews.coverImageUrl}
                  />
                  {editUploadError && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {editUploadError}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Nội dung bài viết
                </Typography>
                <RichTextEditor
                  value={currentNews.content}
                  onChange={handleEditRichTextChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={handleCloseEditDialog}
              variant="outlined"
              sx={{ borderRadius: 8 }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateArticle}
              variant="outlined"
              color="primary"
              sx={{ borderRadius: 8, ml: 1 }}
            >
              Lưu nháp
            </Button>
            <Button
              onClick={handleUpdateAndPublish}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 8, ml: 1 }}
            >
              Cập nhật và đăng bài
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default NewsManagementPage;
