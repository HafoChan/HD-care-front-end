// src/pages/social-network/PostPage.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Button,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Skeleton,
  TextField,
  InputAdornment,
  alpha,
  Stack,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ExploreIcon from "@mui/icons-material/Explore";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import {
  getAllPostsByUser,
  discoverPosts,
  getLatestPosts,
  getPostsFromFollowers,
  suggestUsersToFollow,
  followUser,
} from "../../api/socialNetworkApi";
import PostCard from "../../components/social-network/PostCardComponent";
import { Link } from "react-router-dom";
import HeaderComponent from "../../components/patient/HeaderComponent";

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState("discover");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [suggestedUsersPage, setSuggestedUsersPage] = useState(0);
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const observer = useRef();
  const suggestionsObserver = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  // Function to fetch posts based on feed type
  const fetchPosts = async (reset = false) => {
    if (reset) {
      setPage(0);
      setHasMore(true);
      setPosts([]);
    }

    if (!hasMore && !reset) return;

    setLoading(true);
    try {
      let data;
      switch (feedType) {
        case "discover":
          data = await discoverPosts(page, 10);
          break;
        case "latest":
          data = await getLatestPosts(page, 10);
          break;
        case "following":
          data = await getPostsFromFollowers(page, 10);
          break;
        default:
          data = await discoverPosts(page, 10);
      }

      if (data && data.length > 0) {
        setPosts((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length === 10);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch suggested users
  const fetchSuggestedUsers = async (reset = false) => {
    if (reset) {
      setSuggestedUsersPage(0);
      setHasMoreSuggestions(true);
      setSuggestedUsers([]);
    }

    if (!hasMoreSuggestions && !reset) return;

    setLoadingSuggestions(true);
    try {
      const data = await suggestUsersToFollow(suggestedUsersPage, 10);
      if (data && data.length > 0) {
        setSuggestedUsers((prev) => (reset ? data : [...prev, ...data]));
        setHasMoreSuggestions(data.length === 10);
        setSuggestedUsersPage((prev) => prev + 1);
      } else {
        setHasMoreSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Intersection Observer for infinite scrolling
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, feedType]
  );

  // Intersection Observer for suggested users infinite scrolling
  const lastSuggestionElementRef = useCallback(
    (node) => {
      if (loadingSuggestions) return;
      if (suggestionsObserver.current) suggestionsObserver.current.disconnect();
      suggestionsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreSuggestions) {
          fetchSuggestedUsers();
        }
      });
      if (node) suggestionsObserver.current.observe(node);
    },
    [loadingSuggestions, hasMoreSuggestions]
  );

  // Fetch posts when feed type changes
  useEffect(() => {
    fetchPosts(true);
  }, [feedType]);

  // Fetch suggested users on component mount
  useEffect(() => {
    fetchSuggestedUsers(true);
  }, []);

  const handleFeedChange = (event, newValue) => {
    setFeedType(newValue);
  };

  const handleFollowUser = async (userId) => {
    try {
      await followUser(userId);
      // Refresh suggested users after following
      fetchSuggestedUsers(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleOpenSuggestionsModal = () => {
    setShowAllSuggestions(true);
    fetchSuggestedUsers(true);
  };

  const handleCloseSuggestionsModal = () => {
    setShowAllSuggestions(false);
  };

  // Mock data for community features
  const trendingTopics = [
    {
      id: 1,
      name: "Mental Health",
      count: 342,
      icon: <HealthAndSafetyIcon color="primary" />,
    },
    {
      id: 2,
      name: "COVID-19",
      count: 289,
      icon: <HealthAndSafetyIcon color="primary" />,
    },
    {
      id: 3,
      name: "Nutrition",
      count: 256,
      icon: <HealthAndSafetyIcon color="primary" />,
    },
    {
      id: 4,
      name: "Exercise",
      count: 198,
      icon: <HealthAndSafetyIcon color="primary" />,
    },
    {
      id: 5,
      name: "Sleep Health",
      count: 156,
      icon: <HealthAndSafetyIcon color="primary" />,
    },
  ];

  const renderPostsSkeleton = () => (
    <Box sx={{ p: 2 }}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 3, borderRadius: 2 }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ mr: 2 }}
            />
            <Skeleton variant="text" width={120} />
          </Box>
          <Skeleton variant="rectangular" height={300} />
          <CardContent>
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={70} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Render suggested users in sidebar
  const renderSuggestedUsers = () => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        mb: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.1),
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PersonAddIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Đề xuất theo dõi
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {suggestedUsers.slice(0, 5).map((user) => (
          <Box
            key={user.id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              p: 1,
              borderRadius: 2,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <Avatar src={user.avatar} sx={{ width: 40, height: 40, mr: 2 }}>
              {user.name ? user.name[0].toUpperCase() : "U"}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.role || "Người dùng"}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => handleFollowUser(user.id)}
              sx={{ borderRadius: 5, textTransform: "none" }}
            >
              Theo dõi
            </Button>
          </Box>
        ))}

        {suggestedUsers.length > 5 && (
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={handleOpenSuggestionsModal}
            sx={{ mt: 1, textTransform: "none" }}
          >
            Xem tất cả
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Modal for all suggested users
  const renderSuggestionsModal = () => (
    <Dialog
      open={showAllSuggestions}
      onClose={handleCloseSuggestionsModal}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PersonAddIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Đề xuất theo dõi</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <List sx={{ width: "100%" }}>
          {suggestedUsers.map((user, index) => (
            <React.Fragment key={user.id}>
              <ListItem
                ref={
                  index === suggestedUsers.length - 1
                    ? lastSuggestionElementRef
                    : null
                }
                alignItems="flex-start"
                sx={{ py: 2 }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar}>
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.role || "Người dùng"}
                />
                <ListItemSecondaryAction>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleFollowUser(user.id)}
                    sx={{ borderRadius: 5, textTransform: "none" }}
                  >
                    Theo dõi
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              {index < suggestedUsers.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
          {loadingSuggestions && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseSuggestionsModal} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box
      sx={{
        opacity: 1,
        transition: "opacity 0.6s ease-in-out",
        bgcolor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* Include HeaderComponent */}
      <HeaderComponent />

      {/* Page Content */}
      <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar (Hidden on Mobile) */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  opacity: 1,
                  transform: "translateY(0)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    mb: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: alpha(theme.palette.divider, 0.1),
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Khám phá cộng đồng
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Kết nối với bác sĩ và bệnh nhân khác trong mạng y tế của
                      chúng tôi
                    </Typography>
                    <Button
                      component={Link}
                      to="/social-network/create-post"
                      variant="contained"
                      fullWidth
                      startIcon={<ExploreIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      Tạo bài đăng mới
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    mb: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: alpha(theme.palette.divider, 0.1),
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Chủ đề thịnh hành
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {trendingTopics.map((topic) => (
                      <Box
                        key={topic.id}
                        component={Link}
                        to={`/social-network/topic/${topic.id}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1.5,
                          mb: 1,
                          borderRadius: 2,
                          textDecoration: "none",
                          color: "text.primary",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        {topic.icon}
                        <Box sx={{ ml: 2, flexGrow: 1 }}>
                          <Typography variant="subtitle2" fontWeight={500}>
                            {topic.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {topic.count} bài viết
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label="Hot"
                          color="error"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
                mb: 3,
              }}
            >
              <Tabs
                value={feedType}
                onChange={handleFeedChange}
                variant="fullWidth"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                  },
                }}
              >
                <Tab
                  icon={<ExploreIcon />}
                  label="Khám phá"
                  value="discover"
                  iconPosition="start"
                />
                <Tab
                  icon={<NewReleasesIcon />}
                  label="Mới nhất"
                  value="latest"
                  iconPosition="start"
                />
                <Tab
                  icon={<PersonAddIcon />}
                  label="Đang theo dõi"
                  value="following"
                  iconPosition="start"
                />
              </Tabs>
            </Paper>

            {loading && posts.length === 0 ? (
              renderPostsSkeleton()
            ) : (
              <Box>
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    ref={index === posts.length - 1 ? lastPostElementRef : null}
                  >
                    <PostCard post={post} onRefresh={() => fetchPosts(true)} />
                  </div>
                ))}
                {loading && posts.length > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                {!loading && posts.length === 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 4,
                      textAlign: "center",
                    }}
                  >
                    <WhatshotIcon
                      sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Chưa có bài viết nào
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hãy tạo bài viết đầu tiên hoặc theo dõi người dùng khác để
                      xem bài viết của họ
                    </Typography>
                    <Button
                      component={Link}
                      to="/social-network/create-post"
                      variant="contained"
                      startIcon={<ExploreIcon />}
                      sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                    >
                      Tạo bài viết
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Grid>

          {/* Right Sidebar (Hidden on Mobile) */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              {/* <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Tìm kiếm
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm bài viết, người dùng..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Bộ lọc
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    <Chip
                      label="Tất cả"
                      color="primary"
                      variant="filled"
                      sx={{ borderRadius: 1 }}
                    />
                    <Chip
                      label="Bài viết"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                    <Chip
                      label="Người dùng"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  </Stack>
                </CardContent>
              </Card> */}
              {/* Suggested Users */}
              {renderSuggestedUsers()}
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Suggestions Modal */}
      {renderSuggestionsModal()}
    </Box>
  );
};

export default PostPage;
