import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Button,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Card,
  CardMedia,
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
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";
import { getNewestNews, getFeaturedNews, getAllNews } from "../../api/newsApi";
import NewsCard from "../../components/news/NewsCard";
import { format } from "date-fns";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [newest, featured] = await Promise.all([
        getNewestNews(8),
        getFeaturedNews(5),
      ]);
      setLatestNews(newest);
      setFeaturedNews(featured);

      const allNewsData = await getAllNews(0, 12);
      setAllNews(allNewsData.content || []);
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
      if (moreNews.content && moreNews.content.length > 0) {
        setAllNews([...allNews, ...moreNews.content]);
        setPage(nextPage);
        setHasMore(!(moreNews.last || false));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more news:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
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
          <TrendingUpIcon sx={{ mr: 1 }} /> Featured Articles
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
                        mainFeature.thumbnailUrl ||
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
                        label="Featured"
                        size="small"
                        color="primary"
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
                          src={mainFeature.author?.profileImage || ""}
                          alt={mainFeature.author?.fullName || ""}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {mainFeature.author?.fullName || "Unknown Author"}
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
                          news.thumbnailUrl ||
                          "https://via.placeholder.com/400x216?text=HD-Care+News"
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

    // Filter by search query if available
    if (searchQuery) {
      newsToShow = newsToShow.filter(
        (news) =>
          news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (news.summary &&
            news.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      );
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

    if (newsToShow.length === 0) {
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

        {activeTab === 0 && hasMore && !searchQuery && (
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
              Load more articles
            </Button>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      <HeaderComponent />

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }}
              >
                HD-Care Health News & Insights
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  mb: 3,
                  opacity: 0.9,
                  maxWidth: "700px",
                }}
              >
                Stay informed with the latest health insights, medical
                breakthroughs, and wellness advice from trusted healthcare
                professionals.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  to="/news/create"
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    borderRadius: 8,
                    fontSize: "1rem",
                    boxShadow: 3,
                  }}
                >
                  Write an Article
                </Button>
                <Button
                  component={Link}
                  to="/news/saved"
                  variant="outlined"
                  color="inherit"
                  startIcon={<BookmarkBorderIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    borderRadius: 8,
                    fontSize: "1rem",
                    borderColor: "rgba(255,255,255,0.5)",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Saved Articles
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Health News"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: 300,
                  borderRadius: 4,
                  boxShadow: 6,
                  transform: "perspective(1000px) rotateY(-5deg)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 } }}>
        {/* Featured News Section (for Desktop) */}
        {!isMedium && renderFeaturedSection()}

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
                  Health Articles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search articles..."
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
        {isMedium && renderFeaturedSection()}

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
            <Tab label="All Articles" />
            <Tab
              label="Latest News"
              icon={<FiberNewIcon />}
              iconPosition="start"
            />
            <Tab
              label="Featured"
              icon={<TrendingUpIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {renderNewsList()}
      </Container>
    </Box>
  );
};

export default NewsHomePage;
