import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  Typography,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Stack,
  Chip,
  IconButton,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Skeleton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArticleIcon from "@mui/icons-material/Article";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SaveIcon from "@mui/icons-material/Save";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/patient/HeaderComponent";
import patientApi from "../../api/patient";
import { getImg, setImg } from "../../service/otherService/localStorage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  getAllPostsByUser,
  getAllFollowers,
  getAllFollowingUsers,
  followUser,
} from "../../api/socialNetworkApi";
import PostCard from "../../components/social-network/PostCardComponent";

function Profile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [noPassword, setNoPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
    email: "",
    img: getImg(),
    dob: "",
    id: "",
    stats: {
      appointments: 0,
      posts: 0,
      reviews: 0,
      savedArticles: 0,
    },
  });

  // Social network states
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
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
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const observer = useRef();
  const followersObserver = useRef();
  const followingObserver = useRef();

  // Fetch user info on component mount
  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    try {
      setLoading(true);
      const response = await patientApi.getInfo();
      if (response && response.code === 1000 && response.result) {
        console.log("User info:", response.result);

        // Update the userInfo with data from API
        setUserInfo({
          ...response.result,
          stats: {
            appointments: 10, // These values can be replaced with actual data if available
            posts: response.result.posts?.length || 0,
            reviews: 3,
            savedArticles: 5,
          },
        });

        setImg(response.result.img);
        setNoPassword(response.result.noPassword);

        // Set follower/following counts
        setFollowersCount(response.result.followersCount || 0);
        setFollowingCount(response.result.followingCount || 0);

        // Fetch user posts
        fetchPosts(true);
      } else {
        toast.error("Không thể tải thông tin người dùng");
      }
    } catch (error) {
      if (error.response && error.response.status !== 401) {
        toast.error("Đã có lỗi xảy ra khi tải thông tin");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user posts
  const fetchPosts = async (reset = false) => {
    if (reset) {
      setPage(0);
      setHasMore(true);
      setPosts([]);
    }

    if (!hasMore && !reset) return;

    setLoadingPosts(true);
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
      toast.error("Không thể tải bài viết");
    } finally {
      setLoadingPosts(false);
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
      // If error, just show empty list
      setFollowers([]);
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
      // If error, just show empty list
      setFollowing([]);
    } finally {
      setLoadingFollowing(false);
    }
  };

  // Intersection Observer for infinite scrolling
  const lastPostElementRef = useCallback(
    (node) => {
      if (loadingPosts) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingPosts, hasMore]
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

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    try {
      const response = await patientApi.updatePassword(newPassword);
      if (response.code === 1000) {
        toast.success("Cập nhật mật khẩu thành công!");
        setOpenPasswordDialog(false);
        setNoPassword(false);
      } else {
        throw Error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi cập nhật mật khẩu");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

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
      toast.success("Đã theo dõi người dùng");
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Không thể theo dõi người dùng");
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        minHeight: "100vh",
      }}
    >
      <HeaderComponent userInfo={userInfo} />

      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Fade in timeout={500}>
          <Box>
            <Grid container spacing={4}>
              {/* Profile Info Card */}
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      overflow: "hidden",
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.common.black,
                        0.05
                      )}`,
                    }}
                  >
                    <Box
                      sx={{
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.primary.dark,
                          0.6
                        )} 0%, ${alpha(theme.palette.primary.main, 0.6)} 100%)`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 5,
                        position: "relative",
                      }}
                    >
                      <IconButton
                        onClick={() => handleNavigate("/user-detail")}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "white",
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.2
                          ),
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.common.white,
                              0.3
                            ),
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <Avatar
                        alt={userInfo.name}
                        src={userInfo.img}
                        sx={{
                          width: 120,
                          height: 120,
                          mb: 2,
                          border: `4px solid ${theme.palette.background.paper}`,
                          boxShadow: `0 4px 12px ${alpha(
                            theme.palette.common.black,
                            0.2
                          )}`,
                        }}
                      />
                      <Typography variant="h5" color="white" fontWeight={600}>
                        {userInfo.name}
                      </Typography>
                      <Chip
                        label="Bệnh nhân"
                        size="small"
                        sx={{
                          mt: 1,
                          backgroundColor: alpha(
                            theme.palette.background.paper,
                            0.2
                          ),
                          color: "white",
                          fontWeight: 500,
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <EmailIcon
                            sx={{
                              color: theme.palette.primary.main,
                              mr: 2,
                              fontSize: 20,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Email
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {userInfo.email}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PhoneIcon
                            sx={{
                              color: theme.palette.primary.main,
                              mr: 2,
                              fontSize: 20,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Số điện thoại
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {userInfo.phone || "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarMonthIcon
                            sx={{
                              color: theme.palette.primary.main,
                              mr: 2,
                              fontSize: 20,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Ngày sinh
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {userInfo.dob
                                ? userInfo.dob.split("-").reverse().join("/")
                                : "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <HomeIcon
                            sx={{
                              color: theme.palette.primary.main,
                              mr: 2,
                              fontSize: 20,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Địa chỉ
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {userInfo.address || "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>

                      <Divider sx={{ my: 3 }} />

                      {/* Social Network Stats */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                        >
                          Mạng xã hội
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="text"
                            onClick={handleOpenFollowers}
                            sx={{ textTransform: "none" }}
                          >
                            <Typography variant="body1" fontWeight={600}>
                              {followersCount}
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
                              {followingCount}
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
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box textAlign="center">
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            color="primary.main"
                          >
                            {userInfo.stats.appointments}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Lượt khám
                          </Typography>
                        </Box>

                        <Box textAlign="center">
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            color="primary.main"
                          >
                            {userInfo.stats.posts}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Bài viết
                          </Typography>
                        </Box>

                        <Box textAlign="center">
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            color="primary.main"
                          >
                            {userInfo.stats.reviews}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Đánh giá
                          </Typography>
                        </Box>
                      </Box>

                      <Stack spacing={2} sx={{ mt: 4 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<HistoryIcon />}
                          fullWidth
                          onClick={() => handleNavigate("/appointment-history")}
                          sx={{
                            py: 1.2,
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        >
                          Lịch sử khám bệnh
                        </Button>

                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon />}
                          fullWidth
                          onClick={() => handleNavigate("/user-detail")}
                          sx={{
                            py: 1.2,
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        >
                          Chỉnh sửa thông tin
                        </Button>

                        {noPassword && (
                          <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => setOpenPasswordDialog(true)}
                            sx={{
                              py: 1.2,
                              textTransform: "none",
                              fontWeight: 600,
                              borderRadius: 2,
                            }}
                          >
                            Tạo mật khẩu
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Content Area */}
              <Grid item xs={12} md={8}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.common.black,
                        0.05
                      )}`,
                    }}
                  >
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                          "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "1rem",
                            minHeight: 56,
                          },
                        }}
                      >
                        <Tab
                          icon={<ArticleIcon sx={{ mr: 1 }} />}
                          iconPosition="start"
                          label="Bài viết của tôi"
                        />
                        <Tab
                          icon={<BookmarkIcon sx={{ mr: 1 }} />}
                          iconPosition="start"
                          label="Bài viết đã lưu"
                        />
                        <Tab
                          icon={<VisibilityIcon sx={{ mr: 1 }} />}
                          iconPosition="start"
                          label="Hoạt động gần đây"
                        />
                      </Tabs>
                    </Box>

                    <Box sx={{ p: 3 }}>
                      {tabValue === 0 && (
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 3,
                            }}
                          >
                            <Typography
                              variant="h5"
                              fontWeight={600}
                              color="text.primary"
                            >
                              Bài viết của tôi
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<ArticleIcon />}
                              onClick={() => navigate("/social-network/create")}
                              sx={{
                                px: 2,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                              }}
                            >
                              Tạo bài viết mới
                            </Button>
                          </Box>

                          {loadingPosts && posts.length === 0 ? (
                            renderPostsSkeleton()
                          ) : (
                            <Box>
                              {posts.map((post, index) => (
                                <div
                                  key={post.id}
                                  ref={
                                    index === posts.length - 1
                                      ? lastPostElementRef
                                      : null
                                  }
                                >
                                  <PostCard
                                    post={post}
                                    onRefresh={() => fetchPosts(true)}
                                  />
                                </div>
                              ))}
                              {loadingPosts && posts.length > 0 && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    p: 2,
                                  }}
                                >
                                  <CircularProgress size={24} />
                                </Box>
                              )}
                              {!loadingPosts && posts.length === 0 && (
                                <Paper
                                  elevation={0}
                                  sx={{
                                    p: 4,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    border: `1px dashed ${alpha(
                                      theme.palette.divider,
                                      0.5
                                    )}`,
                                    backgroundColor: alpha(
                                      theme.palette.background.default,
                                      0.5
                                    ),
                                  }}
                                >
                                  <PersonIcon
                                    sx={{
                                      fontSize: 60,
                                      color: alpha(
                                        theme.palette.text.secondary,
                                        0.5
                                      ),
                                      mb: 2,
                                    }}
                                  />
                                  <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Bạn chưa có bài viết nào
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ maxWidth: 450, mx: "auto", mb: 3 }}
                                  >
                                    Hãy bắt đầu chia sẻ trải nghiệm của bạn hoặc
                                    đặt câu hỏi cho cộng đồng bằng cách tạo bài
                                    viết mới.
                                  </Typography>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      navigate("/social-network/create")
                                    }
                                    sx={{
                                      px: 3,
                                      py: 1.2,
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Tạo bài viết đầu tiên
                                  </Button>
                                </Paper>
                              )}
                            </Box>
                          )}
                        </Box>
                      )}

                      {tabValue === 1 && (
                        <Box>
                          <Typography
                            variant="h5"
                            fontWeight={600}
                            color="text.primary"
                            gutterBottom
                          >
                            Bài viết đã lưu
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                          >
                            Bạn đã lưu {userInfo.stats.savedArticles} bài viết.
                            Đây là nơi bạn có thể truy cập nhanh các bài viết
                            hữu ích.
                          </Typography>
                          <Box
                            sx={{
                              height: 300,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="h6" color="text.secondary">
                              Đang phát triển...
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {tabValue === 2 && (
                        <Box>
                          <Typography
                            variant="h5"
                            fontWeight={600}
                            color="text.primary"
                            gutterBottom
                          >
                            Hoạt động gần đây
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                          >
                            Theo dõi các hoạt động gần đây của bạn trên hệ thống
                            HD-Care.
                          </Typography>
                          <Box
                            sx={{
                              height: 300,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="h6" color="text.secondary">
                              Đang phát triển...
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>

      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Tạo mật khẩu mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mật khẩu mới"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenPasswordDialog(false)}
            color="error"
            variant="outlined"
            sx={{ borderRadius: 1.5, textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handlePasswordUpdate}
            color="primary"
            variant="contained"
            sx={{ borderRadius: 1.5, textTransform: "none" }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Social Network Modals */}
      {renderFollowersModal()}
      {renderFollowingModal()}
    </Box>
  );
}

export default Profile;
