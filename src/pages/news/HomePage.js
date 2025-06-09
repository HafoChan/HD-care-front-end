import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Skeleton,
  IconButton,
} from "@mui/material";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";
import {
  getNewestNews,
  getFeaturedNews,
  getAllNews,
  searchNews,
} from "../../api/newsApi";
import NewsCard from "../../components/news/NewsCard";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import HeaderComponent from "../../components/patient/HeaderComponent";

const NewsHomePage = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(0);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [newest, featured, allNewsData] = await Promise.all([
        getNewestNews(8),
        getFeaturedNews(8),
        getAllNews(0, 12),
      ]);
      setLatestNews(newest);
      setFeaturedNews(featured);
      setAllNews(allNewsData || []);
      setHasMore(!(allNewsData.last || false));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
    }
  };

  const fetchMoreNews = async () => {
    try {
      const nextPage = page + 1;
      const moreNews = await getAllNews(nextPage, 12);
      if (moreNews && moreNews.length > 0) {
        setAllNews([...allNews, ...moreNews]);
        setPage(nextPage);
        setHasMore(!(moreNews.last || false));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more news:", error);
    }
  };

  const performSearch = async (query, page = 0) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setIsSearching(true);

    try {
      const results = await searchNews(query, page, 12);
      console.log("Search API Response:", results);

      if (results) {
        if (page === 0) {
          setSearchResults(results);
        } else {
          setSearchResults((prev) => [...prev, ...results]);
        }

        setSearchPage(page);
        setHasMoreSearchResults(results.length > 0);
      } else {
        if (page === 0) {
          setSearchResults([]);
        }
        setHasMoreSearchResults(false);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error searching news:", error);
      setLoading(false);
      setSearchResults([]);
    }
  };

  const fetchMoreSearchResults = async () => {
    await performSearch(searchQuery, searchPage + 1);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setIsSearching(false);
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset search when changing tabs
    if (isSearching) {
      setSearchQuery("");
      setIsSearching(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE, dd 'tháng' MM 'năm' yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const renderFeaturedSection = () => {
    if (loading) {
      return (
        <Box sx={{ mb: 6 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      );
    }

    if (!featuredNews || featuredNews.length === 0) return null;

    const mainFeature = featuredNews[0];
    const secondaryFeatures = featuredNews.slice(1, 3);

    return (
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <TrendingUpIcon sx={{ mr: 1 }} /> Tin nổi bật
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {mainFeature && (
              <Box
                component={Link}
                to={`/news/${mainFeature.id}`}
                sx={{
                  textDecoration: "none",
                  display: "block",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    height: { xs: 400, md: 450 },
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      backgroundImage: `url(${
                        mainFeature.coverImageUrl ||
                        "https://via.placeholder.com/800x450?text=HD-Care+News"
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "100%",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "60%",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        p: 3,
                        zIndex: 2,
                        width: "100%",
                      }}
                    >
                      <Chip
                        label="Nổi bật"
                        size="medium"
                        color="warning"
                        sx={{ mb: 2, fontWeight: 600 }}
                      />
                      <Typography
                        variant="h4"
                        sx={{ color: "white", fontWeight: 700, mb: 1 }}
                      >
                        {mainFeature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "white", mb: 2, opacity: 0.9 }}
                      >
                        {mainFeature.summary}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        <Avatar
                          src={mainFeature.author?.img || ""}
                          alt={mainFeature.author?.name || ""}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {mainFeature.author?.name || "Unknown Author"}
                        </Typography>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                          {formatDate(mainFeature.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              {secondaryFeatures.map((news, index) => (
                <Box
                  key={news.id}
                  component={Link}
                  to={`/news/${news.id}`}
                  sx={{
                    textDecoration: "none",
                    mb: index === 0 ? 3 : 0,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      height: 216,
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${
                          news.coverImageUrl ||
                          "/src/assets/images/placeholder.png"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "100%",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "70%",
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          p: 2,
                          zIndex: 2,
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "white", fontWeight: 600, mb: 0.5 }}
                        >
                          {news.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                            opacity: 0.9,
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption">
                            {formatDate(news.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderNewsList = () => {
    let newsToShow = [];

    // If searching, show search results
    if (isSearching && searchQuery) {
      newsToShow = searchResults;
      console.log("Rendering search results:", newsToShow);
    } else {
      // Otherwise show tab-based content
      switch (activeTab) {
        case 0: // All
          newsToShow = allNews;
          break;
        case 1: // Latest
          newsToShow = latestNews;
          break;
        case 2: // Featured
          newsToShow = featuredNews;
          break;
        default:
          newsToShow = allNews;
      }
    }

    if (loading) {
      return (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card elevation={1} sx={{ height: "100%", borderRadius: 2 }}>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton variant="text" width="80%" height={28} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="90%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (!newsToShow || newsToShow.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <NewspaperIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No articles found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery
              ? "No matches for your search query"
              : "No news articles available at this time"}
          </Typography>
          {searchQuery && (
            <Button
              variant="outlined"
              sx={{ mt: 2, borderRadius: 8, textTransform: "none" }}
              onClick={clearSearch}
            >
              Clear search
            </Button>
          )}
        </Box>
      );
    }

    return (
      <>
        <Grid container spacing={3}>
          {newsToShow.map((news) => (
            <Grid item xs={12} sm={6} md={4} key={news.id}>
              <NewsCard news={news} />
            </Grid>
          ))}
        </Grid>

        {/* Show appropriate load more button based on context */}
        {activeTab === 0 && hasMore && !isSearching && (
          <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={fetchMoreNews}
              sx={{
                borderRadius: 8,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Tải thêm tin tức
            </Button>
          </Box>
        )}

        {isSearching && hasMoreSearchResults && (
          <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={fetchMoreSearchResults}
              sx={{
                borderRadius: 8,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Load more search results
            </Button>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Featured News Section (for Desktop) */}
        {!isMedium && !isSearching && renderFeaturedSection()}

        {/* Main Content */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: { xs: 2, md: 0 },
                }}
              >
                <NewspaperIcon
                  sx={{ fontSize: 32, mr: 2, color: "primary.main" }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "600", color: "text.primary" }}
                >
                  {isSearching ? "Kết quả tìm kiếm" : "Bài viết sức khỏe"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm bài viết..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={clearSearch} size="small">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 8,
                    bgcolor: "background.paper",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Featured News Section (for Mobile) */}
        {isMedium && !isSearching && renderFeaturedSection()}

        {/* Hide tabs when searching */}
        {!isSearching && (
          <Box sx={{ width: "100%", mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              indicatorColor="primary"
              textColor="primary"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  minWidth: 100,
                },
              }}
            >
              <Tab label="Tất cả bài viết" />
              <Tab
                label="Bài viết mới nhất"
                icon={<FiberNewIcon />}
                iconPosition="start"
              />
              <Tab
                label="Bài viết nổi bật"
                icon={<TrendingUpIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>
        )}

        {isSearching && searchQuery && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Tìm thấy {searchResults.length} kết quả cho "{searchQuery}"
            </Typography>
          </Box>
        )}

        {renderNewsList()}
      </Container>
    </Box>
  );
};

export default NewsHomePage;
