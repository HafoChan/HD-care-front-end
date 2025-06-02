import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Button,
  Grid,
  Breadcrumbs,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { getAllFavoriteNews } from "../../api/newsApi";
import NewsCard from "../../components/news/NewsCard";

const SavedNewsPage = () => {
  const [savedNews, setSavedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchSavedNews = async () => {
    setLoading(true);
    try {
      const data = await getAllFavoriteNews(0, 10);
      setSavedNews(data.content || []);
      setHasMore(!(data.last || false));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching saved news:", error);
      setLoading(false);
    }
  };

  const fetchMoreNews = async () => {
    try {
      const nextPage = page + 1;
      const moreNews = await getAllFavoriteNews(nextPage, 10);
      if (moreNews.content && moreNews.content.length > 0) {
        setSavedNews([...savedNews, ...moreNews.content]);
        setPage(nextPage);
        setHasMore(!(moreNews.last || false));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more saved news:", error);
    }
  };

  useEffect(() => {
    fetchSavedNews();
  }, []);

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
              Trở lại trang tin tức
            </Link>
          </Breadcrumbs>
        </Box>

        <Paper
          elevation={0}
          sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}
        >
          <Box sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <BookmarkIcon sx={{ fontSize: 28, mr: 2, color: "#262626" }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: "600", color: "#262626" }}
            >
              Saved Articles
            </Typography>
          </Box>
          <Divider />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={40} sx={{ color: "#262626" }} />
            </Box>
          ) : savedNews.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <BookmarkIcon sx={{ fontSize: 48, color: "#c7c7c7", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No saved articles yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Articles you save will appear here
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/news"
                sx={{
                  textTransform: "none",
                  borderRadius: 8,
                  px: 3,
                }}
              >
                Browse Articles
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              {savedNews.map((news) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  onRefresh={fetchSavedNews}
                />
              ))}

              {hasMore && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={fetchMoreNews}
                    sx={{
                      borderRadius: 8,
                      px: 3,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    Tải thêm tin tức
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SavedNewsPage;
