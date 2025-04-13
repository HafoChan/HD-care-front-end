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
import { px } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState("discover");

  // Separate pagination states for each feed type
  const [discoverPage, setDiscoverPage] = useState(0);
  const [latestPage, setLatestPage] = useState(0);
  const [followingPage, setFollowingPage] = useState(0);

  const [hasMoreDiscover, setHasMoreDiscover] = useState(true);
  const [hasMoreLatest, setHasMoreLatest] = useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);

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

  const [isFollowingActionInProgress, setIsFollowingActionInProgress] =
    useState(false);

  // Function to get current page based on feed type
  const getCurrentPage = () => {
    switch (feedType) {
      case "discover":
        return discoverPage;
      case "latest":
        return latestPage;
      case "following":
        return followingPage;
      default:
        return discoverPage;
    }
  };

  // Function to get has more flag based on feed type
  const getHasMore = () => {
    switch (feedType) {
      case "discover":
        return hasMoreDiscover;
      case "latest":
        return hasMoreLatest;
      case "following":
        return hasMoreFollowing;
      default:
        return hasMoreDiscover;
    }
  };

  // Function to update page based on feed type
  const updatePage = (value) => {
    switch (feedType) {
      case "discover":
        setDiscoverPage(value);
        break;
      case "latest":
        setLatestPage(value);
        break;
      case "following":
        setFollowingPage(value);
        break;
    }
  };

  // Function to update hasMore based on feed type
  const updateHasMore = (value) => {
    switch (feedType) {
      case "discover":
        setHasMoreDiscover(value);
        break;
      case "latest":
        setHasMoreLatest(value);
        break;
      case "following":
        setHasMoreFollowing(value);
        break;
    }
  };

  // Function to fetch posts based on feed type
  const fetchPosts = async (reset = false) => {
    if (reset) {
      updatePage(0);
      updateHasMore(true);
      setPosts([]);
    }

    if (!getHasMore() && !reset) return;

    setLoading(true);
    try {
      let data;
      const currentPage = reset ? 0 : getCurrentPage();

      switch (feedType) {
        case "discover":
          data = await discoverPosts(currentPage, 10);
          break;
        case "latest":
          data = await getLatestPosts(currentPage, 10);
          break;
        case "following":
          data = await getPostsFromFollowers(currentPage, 10);
          break;
        default:
          data = await discoverPosts(currentPage, 10);
      }

      if (data && data.length > 0) {
        setPosts((prev) => (reset ? data : [...prev, ...data]));
        updateHasMore(data.length === 10);
        updatePage(currentPage + 1);
      } else {
        updateHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch suggested users
  const fetchSuggestedUsers = async (reset = false) => {
    // Calculate the current page to use
    const pageToFetch = reset ? 0 : suggestedUsersPage;

    if (reset) {
      setSuggestedUsersPage(0);
      setHasMoreSuggestions(true);
      setSuggestedUsers([]);
    }

    if (!hasMoreSuggestions && !reset) return;

    setLoadingSuggestions(true);
    try {
      // Use the determined page instead of reading from state
      const data = await suggestUsersToFollow(pageToFetch, 10);
      if (data && data.length > 0) {
        setSuggestedUsers((prev) => (reset ? data : [...prev, ...data]));
        setHasMoreSuggestions(data.length === 10);
        // Only increment if we're getting new data
        setSuggestedUsersPage(pageToFetch + 1);
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
        if (entries[0].isIntersecting && getHasMore()) {
          fetchPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, feedType, hasMoreDiscover, hasMoreLatest, hasMoreFollowing]
  );

  // Intersection Observer for suggested users infinite scrolling
  const lastSuggestionElementRef = useCallback(
    (node) => {
      if (loadingSuggestions) return;
      if (suggestionsObserver.current) suggestionsObserver.current.disconnect();

      suggestionsObserver.current = new IntersectionObserver((entries) => {
        // Only trigger if actually intersecting and we have more data to load
        if (
          entries[0].isIntersecting &&
          hasMoreSuggestions &&
          !loadingSuggestions
        ) {
          fetchSuggestedUsers(false);
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

  // Function to handle following a user
  const handleFollowUser = async (userId, isFollowing = false) => {
    if (isFollowingActionInProgress) return; // Prevent further actions if one is in progress
    setIsFollowingActionInProgress(true); // Set the flag to true

    try {
      // Update UI immediately for optimistic updates
      setSuggestedUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing: !isFollowing } : user
        )
      );

      // Call API
      await followUser(userId);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);

      // Revert UI change on error
      setSuggestedUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing: isFollowing } : user
        )
      );

      // Only show toast if the modal is not open
      if (!showAllSuggestions) {
        toast.error("Không thể thay đổi trạng thái theo dõi");
      }
    } finally {
      setIsFollowingActionInProgress(false); // Reset the flag
    }
  };

  const handleOpenSuggestionsModal = () => {
    // First set the state to show modal
    setShowAllSuggestions(true);

    // Reset page and suggestions before fetching
    setSuggestedUsersPage(0);
    setSuggestedUsers([]);
    setHasMoreSuggestions(true);

    // Use setTimeout to ensure state updates have been processed
    setTimeout(() => {
      fetchSuggestedUsers(true);
    }, 0);
  };

  const handleCloseSuggestionsModal = () => {
    setShowAllSuggestions(false);
    // Reset pagination on close
    setSuggestedUsersPage(0);
    setHasMoreSuggestions(true);
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
        boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        },
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
              p: 1.5,
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{
                width: 45,
                height: 45,
                mr: 2,
                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.common.black,
                  0.1
                )}`,
              }}
            >
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
              variant={user.isFollowing ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleFollowUser(user.id, user.isFollowing)}
              sx={{
                borderRadius: 6,
                textTransform: "none",
                minHeight: "36px",
                maxHeight: "36px",
                minWidth: user.isFollowing ? "120px" : "90px",
                px: 2,
              }}
            >
              {user.isFollowing ? "Đang theo dõi" : "Theo dõi"}
            </Button>
          </Box>
        ))}

        {suggestedUsers.length > 5 && (
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={handleOpenSuggestionsModal}
            sx={{ mt: 1.5, textTransform: "none", borderRadius: 2 }}
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
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: "80vh" },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PersonAddIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="h5" fontWeight={600}>
            Đề xuất theo dõi
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <List sx={{ width: "100%" }}>
          {suggestedUsers.map((user, index) => (
            <React.Fragment key={user.id}>
              <ListItem
                ref={
                  index === suggestedUsers.length - 1
                    ? lastSuggestionElementRef
                    : null
                }
                alignItems="center"
                sx={{
                  py: 2,
                  px: 3,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 50,
                      height: 50,
                      boxShadow: `0 2px 10px ${alpha(
                        theme.palette.common.black,
                        0.1
                      )}`,
                    }}
                  >
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {user.role || "Người dùng"}
                    </Typography>
                  }
                  sx={{ ml: 1 }}
                />
                <ListItemSecondaryAction>
                  <Button
                    size="small"
                    variant={user.isFollowing ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleFollowUser(user.id, user.isFollowing)}
                    sx={{
                      borderRadius: 6,
                      textTransform: "none",
                      px: 2,
                      py: 0.8,
                    }}
                  >
                    {user.isFollowing ? "Đang theo dõi" : "Theo dõi"}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              {index < suggestedUsers.length - 1 && <Divider sx={{ mx: 3 }} />}
            </React.Fragment>
          ))}
          {loadingSuggestions && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleCloseSuggestionsModal}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Add optimistic update for likes and saves
  const handlePostInteraction = (postId, action) => {
    // Create a deep copy of the posts array
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        if (action === "like") {
          return {
            ...post,
            liked: !post.liked,
            countLikes: post.liked ? post.countLikes - 1 : post.countLikes + 1,
          };
        } else if (action === "save") {
          return {
            ...post,
            saved: !post.saved,
          };
        }
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Header */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 10 }}>
        <HeaderComponent />
      </Box>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Page Content */}
      <Container
        maxWidth="xl"
        sx={{
          pt: 3,
          pb: 6,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={3} sx={{ px: 8, flexGrow: 1 }}>
          {/* Left Sidebar (Hidden on Mobile) */}
          {!isMobile && (
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                position: "sticky",
                top: 80,
                height: "fit-content",
                alignSelf: "flex-start",
              }}
            >
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
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            {/* Fixed Tabs */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
                mb: 3,
                position: "sticky",
                top: 80,
                zIndex: 5,
                backgroundColor: "#fff",
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

            {/* Scrollable Content */}
            <Box sx={{ flexGrow: 1, overflow: "auto" }}>
              {loading && posts.length === 0 ? (
                renderPostsSkeleton()
              ) : (
                <Box>
                  {posts.map((post, index) => (
                    <div
                      key={post.id}
                      ref={
                        index === posts.length - 1 ? lastPostElementRef : null
                      }
                    >
                      <PostCard
                        post={post}
                        onRefresh={() => fetchPosts(true)}
                        onLike={() => handlePostInteraction(post.id, "like")}
                        onSave={() => handlePostInteraction(post.id, "save")}
                      />
                    </div>
                  ))}
                  {loading && posts.length > 0 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 2 }}
                    >
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
                        Hãy tạo bài viết đầu tiên hoặc theo dõi người dùng khác
                        để xem bài viết của họ
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
            </Box>
          </Grid>

          {/* Right Sidebar (Hidden on Mobile) */}
          {!isMobile && (
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                position: "sticky",
                top: 80,
                height: "fit-content",
                alignSelf: "flex-start",
              }}
            >
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
