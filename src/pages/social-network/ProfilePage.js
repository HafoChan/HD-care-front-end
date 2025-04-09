import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Avatar,
  Button,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  getAllPostsByUser,
  getAllFollowers,
  getAllFollowingUsers,
  followUser,
} from "../../api/socialNetworkApi";
import PostCard from "../../components/social-network/PostCardComponent";
import { Link, useParams } from "react-router-dom";
import HeaderComponent from "../../components/patient/HeaderComponent";

const ProfilePage = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [followersPage, setFollowersPage] = useState(0);
  const [followingPage, setFollowingPage] = useState(0);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const [userInfo, setUserInfo] = useState({
    id: userId,
    name: "User Name",
    username: "username",
    avatar: "",
    role: "Patient",
    followersCount: 0,
    followingCount: 0,
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const observer = useRef();
  const followersObserver = useRef();
  const followingObserver = useRef();
  const theme = useTheme();

  // Function to fetch user posts
  const fetchPosts = async (reset = false) => {
    if (reset) {
      setPage(0);
      setHasMore(true);
      setPosts([]);
    }

    if (!hasMore && !reset) return;

    setLoading(true);
    try {
      const data = await getAllPostsByUser(page, 10);
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

  // Function to fetch followers
  const fetchFollowers = async (reset = false) => {
    if (reset) {
      setFollowersPage(0);
      setHasMoreFollowers(true);
      setFollowers([]);
    }

    if (!hasMoreFollowers && !reset) return;

    setLoadingFollowers(true);
    try {
      const data = await getAllFollowers(followersPage, 10);
      if (data && data.length > 0) {
        setFollowers((prev) => (reset ? data : [...prev, ...data]));
        setHasMoreFollowers(data.length === 10);
        setFollowersPage((prev) => prev + 1);
      } else {
        setHasMoreFollowers(false);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  // Function to fetch following users
  const fetchFollowing = async (reset = false) => {
    if (reset) {
      setFollowingPage(0);
      setHasMoreFollowing(true);
      setFollowing([]);
    }

    if (!hasMoreFollowing && !reset) return;

    setLoadingFollowing(true);
    try {
      const data = await getAllFollowingUsers(followingPage, 10);
      if (data && data.length > 0) {
        setFollowing((prev) => (reset ? data : [...prev, ...data]));
        setHasMoreFollowing(data.length === 10);
        setFollowingPage((prev) => prev + 1);
      } else {
        setHasMoreFollowing(false);
      }
    } catch (error) {
      console.error("Error fetching following users:", error);
    } finally {
      setLoadingFollowing(false);
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
    [loading, hasMore]
  );

  // Intersection Observer for followers infinite scrolling
  const lastFollowerElementRef = useCallback(
    (node) => {
      if (loadingFollowers) return;
      if (followersObserver.current) followersObserver.current.disconnect();
      followersObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFollowers) {
          fetchFollowers();
        }
      });
      if (node) followersObserver.current.observe(node);
    },
    [loadingFollowers, hasMoreFollowers]
  );

  // Intersection Observer for following infinite scrolling
  const lastFollowingElementRef = useCallback(
    (node) => {
      if (loadingFollowing) return;
      if (followingObserver.current) followingObserver.current.disconnect();
      followingObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFollowing) {
          fetchFollowing();
        }
      });
      if (node) followingObserver.current.observe(node);
    },
    [loadingFollowing, hasMoreFollowing]
  );

  useEffect(() => {
    fetchPosts(true);
    // In a real app, you would fetch user info here
    // For now, we'll use mock data
    setUserInfo({
      id: userId,
      name: "User Name",
      username: "username",
      avatar: "",
      role: "Patient",
      followersCount: 42,
      followingCount: 37,
    });
    setIsCurrentUser(userId === "current-user-id"); // Replace with actual current user ID check
  }, [userId]);

  const handleOpenFollowers = () => {
    setShowFollowers(true);
    fetchFollowers(true);
  };

  const handleCloseFollowers = () => {
    setShowFollowers(false);
  };

  const handleOpenFollowing = () => {
    setShowFollowing(true);
    fetchFollowing(true);
  };

  const handleCloseFollowing = () => {
    setShowFollowing(false);
  };

  const handleFollowUser = async (targetUserId) => {
    try {
      await followUser(targetUserId);
      // Refresh followers/following counts
      // In a real app, you would update the counts here
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Render followers modal
  const renderFollowersModal = () => (
    <Dialog
      open={showFollowers}
      onClose={handleCloseFollowers}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">Người theo dõi</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <List sx={{ width: "100%" }}>
          {followers.length > 0 ? (
            followers.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem
                  ref={
                    index === followers.length - 1
                      ? lastFollowerElementRef
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
                {index < followers.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Không có người theo dõi nào
              </Typography>
            </Box>
          )}
          {loadingFollowers && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFollowers} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render following modal
  const renderFollowingModal = () => (
    <Dialog
      open={showFollowing}
      onClose={handleCloseFollowing}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">Đang theo dõi</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <List sx={{ width: "100%" }}>
          {following.length > 0 ? (
            following.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem
                  ref={
                    index === following.length - 1
                      ? lastFollowingElementRef
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
                      Đang theo dõi
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < following.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Chưa theo dõi ai
              </Typography>
            </Box>
          )}
          {loadingFollowing && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseFollowing} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render posts skeleton
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
          {/* Profile Header */}
          <Grid item xs={12}>
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
              <Box
                sx={{
                  height: 200,
                  bgcolor: theme.palette.primary.main,
                  position: "relative",
                }}
              />
              <Box
                sx={{
                  px: 3,
                  pb: 3,
                  mt: -5,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Grid container spacing={3} alignItems="flex-end">
                  <Grid item>
                    <Avatar
                      src={userInfo.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        border: "4px solid white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {userInfo.name ? userInfo.name[0].toUpperCase() : "U"}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="h4" fontWeight={700}>
                        {userInfo.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        @{userInfo.username}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Chip
                        label={userInfo.role}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="text"
                        onClick={handleOpenFollowers}
                        sx={{ textTransform: "none" }}
                      >
                        <Typography variant="body1" fontWeight={600}>
                          {userInfo.followersCount}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          Người theo dõi
                        </Typography>
                      </Button>
                      <Button
                        variant="text"
                        onClick={handleOpenFollowing}
                        sx={{ textTransform: "none" }}
                      >
                        <Typography variant="body1" fontWeight={600}>
                          {userInfo.followingCount}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          Đang theo dõi
                        </Typography>
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item>
                    {isCurrentUser ? (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Chỉnh sửa hồ sơ
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        Theo dõi
                      </Button>
                    )}
                    {isCurrentUser && (
                      <IconButton sx={{ ml: 1 }} aria-label="settings">
                        <SettingsIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Posts */}
          <Grid item xs={12}>
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
                    <Typography variant="h6" gutterBottom>
                      Chưa có bài viết nào
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isCurrentUser
                        ? "Hãy tạo bài viết đầu tiên của bạn"
                        : "Người dùng này chưa có bài viết nào"}
                    </Typography>
                    {isCurrentUser && (
                      <Button
                        component={Link}
                        to="/social-network/create-post"
                        variant="contained"
                        sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                      >
                        Tạo bài viết
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Modals */}
      {renderFollowersModal()}
      {renderFollowingModal()}
    </Box>
  );
};

export default ProfilePage;
