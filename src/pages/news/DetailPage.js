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
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getNewsById,
  interactWithNews,
  toggleFavoriteNews,
} from "../../api/newsApi";
import NewsCard from "../../components/news/NewsCard";

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useful, setUseful] = useState(false);
  const [useless, setUseless] = useState(false);
  const [saved, setSaved] = useState(false);
  const [usefulCount, setUsefulCount] = useState(0);
  const [uselessCount, setUselessCount] = useState(0);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      try {
        const newsData = await getNewsById(id);
        setNews(newsData);
        setUseful(newsData.userInteraction === "USEFUL");
        setUseless(newsData.userInteraction === "USELESS");
        setSaved(newsData.isSaved || false);
        setUsefulCount(newsData.usefulCount || 0);
        setUselessCount(newsData.uselessCount || 0);
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

  const handleUseful = async () => {
    try {
      await interactWithNews(news.id, true);
      if (useful) {
        setUsefulCount(usefulCount - 1);
      } else {
        setUsefulCount(usefulCount + 1);
        if (useless) {
          setUselessCount(uselessCount - 1);
          setUseless(false);
        }
      }
      setUseful(!useful);
    } catch (error) {
      console.error("Error marking article as useful:", error);
    }
  };

  const handleUseless = async () => {
    try {
      await interactWithNews(news.id, false);
      if (useless) {
        setUselessCount(uselessCount - 1);
      } else {
        setUselessCount(uselessCount + 1);
        if (useful) {
          setUsefulCount(usefulCount - 1);
          setUseful(false);
        }
      }
      setUseless(!useless);
    } catch (error) {
      console.error("Error marking article as useless:", error);
    }
  };

  const handleSave = async () => {
    try {
      await toggleFavoriteNews(news.id);
      setSaved(!saved);
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <Button variant="contained" component={Link} to="/news" sx={{ mt: 2 }}>
          Return to News
        </Button>
      </Container>
    );
  }

  if (!news) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          News article not found
        </Typography>
        <Button variant="contained" component={Link} to="/news" sx={{ mt: 2 }}>
          Return to News
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
              to="/news"
              style={{
                textDecoration: "none",
                color: "#757575",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
              Back to News
            </Link>
          </Breadcrumbs>
        </Box>

        <Paper
          elevation={0}
          sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}
        >
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              {news.title}
            </Typography>

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
                    {news.author?.name || "Unknown author"}
                  </Typography>
                  {news.author?.clinicName && (
                    <Chip
                      label={news.author.clinicName}
                      size="small"
                      sx={{ ml: 1, fontSize: "0.7rem", height: 20 }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(news.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

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
                  margin: "16px 0",
                  padding: "8px 16px",
                  fontStyle: "italic",
                  bgcolor: "#f5f5f5",
                  borderRadius: "0 4px 4px 0",
                },
              }}
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={handleUseful}
                  color={useful ? "primary" : "default"}
                  sx={{ mr: 1 }}
                >
                  {useful ? <ThumbUpAltIcon /> : <ThumbUpAltOutlinedIcon />}
                </IconButton>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 3 }}
                >
                  {usefulCount}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={handleUseless}
                  color={useless ? "error" : "default"}
                  sx={{ mr: 1 }}
                >
                  {useless ? (
                    <ThumbDownAltIcon />
                  ) : (
                    <ThumbDownAltOutlinedIcon />
                  )}
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {uselessCount}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Button
                variant={saved ? "contained" : "outlined"}
                startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleSave}
                sx={{
                  textTransform: "none",
                  borderRadius: 8,
                  px: 3,
                }}
              >
                {saved ? "Saved" : "Save"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default NewsDetailPage;
