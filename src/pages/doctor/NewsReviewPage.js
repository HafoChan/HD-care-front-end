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
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  getAssignedNewsToDoctor,
  getNewsReviewedByDoctor,
  approveNews,
} from "../../api/newsApi";
import { format } from "date-fns";
import Layout from "../../components/doctor/Layout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "react-toastify";

const NewsReviewPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const theme = useTheme();

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  useEffect(() => {
    fetchNews();
  }, [activeTab, currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      let data;

      switch (activeTab) {
        case "assigned":
          data = await getAssignedNewsToDoctor(currentPage, pageSize);
          break;
        case "approved":
          data = await getNewsReviewedByDoctor(true, currentPage, pageSize);
          break;
        case "rejected":
          data = await getNewsReviewedByDoctor(false, currentPage, pageSize);
          break;
        default:
          data = [];
      }

      setNews(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Không thể tải tin tức. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveNews = async (newsId) => {
    try {
      await approveNews(newsId, true);
      toast.success("Bài viết đã được duyệt thành công");
      fetchNews();
    } catch (error) {
      console.error("Error approving news:", error);
      toast.error("Không thể duyệt bài viết. Vui lòng thử lại sau.");
    }
  };

  const handleRejectNews = async (newsId) => {
    try {
      await approveNews(newsId, false);
      toast.success("Bài viết đã bị từ chối");
      fetchNews();
    } catch (error) {
      console.error("Error rejecting news:", error);
      toast.error("Không thể từ chối bài viết. Vui lòng thử lại sau.");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip
            icon={<CheckCircleIcon sx={{ pl: 1 }} fontSize="small" />}
            label="Đã duyệt"
            color="success"
            variant="outlined"
            size="medium"
          />
        );
      case "REJECTED":
        return (
          <Chip
            icon={<CancelIcon sx={{ pl: 1 }} fontSize="small" />}
            label="Đã từ chối"
            color="error"
            variant="outlined"
            size="medium"
          />
        );
      case "REVIEW":
        return (
          <Chip
            icon={<RateReviewIcon sx={{ pl: 1 }} fontSize="small" />}
            label="Đang xét duyệt"
            color="warning"
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
            Duyệt bài viết
          </Typography>
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
            <Tab value="assigned" label="Chờ duyệt" />
            <Tab value="approved" label="Đã duyệt" />
            <Tab value="rejected" label="Đã từ chối" />
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
                            {getStatusChip(item.status)}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <PersonIcon
                              sx={{
                                fontSize: 16,
                                mr: 0.5,
                                color: "text.secondary",
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Tác giả: {item.author?.name || "N/A"}
                            </Typography>
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
                              ? stripHtmlTags(item.content).substring(0, 150)
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
                            Xem chi tiết
                          </Button>

                          {activeTab === "assigned" && (
                            <>
                              <Button
                                startIcon={<CheckCircleIcon />}
                                variant="outlined"
                                color="success"
                                size="small"
                                onClick={() => handleApproveNews(item.id)}
                                sx={{ ml: 1, borderRadius: 8 }}
                              >
                                Duyệt
                              </Button>
                              <Button
                                startIcon={<CancelIcon />}
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleRejectNews(item.id)}
                                sx={{ ml: 1, borderRadius: 8 }}
                              >
                                Từ chối
                              </Button>
                            </>
                          )}
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
      </Box>
    </Layout>
  );
};

export default NewsReviewPage;
