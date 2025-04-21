import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Avatar,
  Button,
  Chip,
  IconButton,
  Breadcrumbs,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getNewsUnrestricted, approveNews } from "../../api/newsApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DraftsIcon from "@mui/icons-material/Drafts";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { toast } from "react-toastify";
import { getRole } from "../../service/otherService/localStorage";

const NewsDetailUnrestrictedPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const userRole = getRole();

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      try {
        const newsData = await getNewsUnrestricted(id);
        setNews(newsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news details:", error);
        setError(
          "Failed to load the article. It may have been removed or you don't have permission to view it."
        );
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      await approveNews(news.id, true);
      toast.success("Bài viết đã được duyệt thành công");
      const updatedNews = await getNewsUnrestricted(id);
      setNews(updatedNews);
    } catch (error) {
      console.error("Error approving article:", error);
      toast.error("Không thể duyệt bài viết. Vui lòng thử lại sau.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setRejecting(true);
      await approveNews(news.id, false);
      toast.success("Bài viết đã bị từ chối");
      const updatedNews = await getNewsUnrestricted(id);
      setNews(updatedNews);
    } catch (error) {
      console.error("Error rejecting article:", error);
      toast.error("Không thể từ chối bài viết. Vui lòng thử lại sau.");
    } finally {
      setRejecting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip
            icon={<CheckCircleIcon fontSize="small" />}
            label="Đã duyệt"
            color="success"
            variant="outlined"
            size="medium"
          />
        );
      case "REJECTED":
        return (
          <Chip
            icon={<CancelIcon fontSize="small" />}
            label="Từ chối"
            color="error"
            variant="outlined"
            size="medium"
          />
        );
      case "REVIEW":
        return (
          <Chip
            icon={<RateReviewIcon fontSize="small" />}
            label="Đang xét duyệt"
            color="warning"
            variant="outlined"
            size="medium"
          />
        );
      case "DRAFT":
        return (
          <Chip
            icon={<DraftsIcon fontSize="small" />}
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

  const getBackPath = () => {
    if (userRole === "DOCTOR") {
      return "/doctor/news-review";
    } else if (userRole === "ADMIN") {
      return "/admin/news-management";
    }
    return "/news";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={40} sx={{ color: "#262626" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to={getBackPath()}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  if (!news) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Không tìm thấy bài viết
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to={getBackPath()}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              to={getBackPath()}
              style={{
                textDecoration: "none",
                color: "#757575",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
              Quay lại
            </Link>
          </Breadcrumbs>
        </Box>

        <Paper
          elevation={0}
          sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}
        >
          <Box sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {news.title}
              </Typography>
              {getStatusChip(news.status)}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar
                src={news.author?.img}
                sx={{
                  width: 50,
                  height: 50,
                  mr: 2,
                }}
              >
                {news.author?.name?.[0] || "U"}
              </Avatar>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight="500">
                    {news.author?.name || "Tác giả không xác định"}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(news.createdAt)}
                </Typography>
              </Box>
            </Box>

            {news.reviewerDoctor && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Bài viết được giao cho bác sĩ{" "}
                <strong>{news.reviewerDoctor.name}</strong> duyệt
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" mb={2}>
              Danh mục: {news.category}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {news.coverImageUrl && (
              <Box
                component="img"
                src={news.coverImageUrl}
                alt={news.title}
                sx={{
                  width: "100%",
                  maxHeight: 500,
                  objectFit: "cover",
                  borderRadius: 2,
                  mb: 4,
                }}
              />
            )}

            <Box
              sx={{
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 1,
                },
                "& a": {
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
                "& blockquote": {
                  borderLeft: "4px solid #e0e0e0",
                  paddingLeft: 2,
                  fontStyle: "italic",
                  mx: 2,
                  my: 3,
                  color: "text.secondary",
                },
                "& ul, & ol": {
                  pl: 3,
                },
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  fontWeight: 600,
                  my: 2,
                },
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </Box>
          </Box>
        </Paper>

        {news.status === "REVIEW" && (
          <Box sx={{ mt: 2, mb: 6, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleApprove}
              disabled={approving}
              startIcon={<CheckCircleIcon />}
              sx={{ flex: 1, borderRadius: 8, py: 1.5 }}
            >
              {approving ? "Đang xử lý..." : "Duyệt bài viết"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleReject}
              disabled={rejecting}
              startIcon={<CancelIcon />}
              sx={{ flex: 1, borderRadius: 8, py: 1.5 }}
            >
              {rejecting ? "Đang xử lý..." : "Từ chối bài viết"}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NewsDetailUnrestrictedPage;
