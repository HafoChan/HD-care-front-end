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
  CircularProgress,
  CardMedia,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate, useParams } from "react-router-dom";
import HeaderComponent from "../../components/patient/HeaderComponent";
import patientApi from "../../api/patient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  getAllPostsByUser,
  followUser,
  checkUserPrivate,
  getCountPosts,
} from "../../api/socialNetworkApi";

function ViewProfile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPendingRequest, setIsPendingRequest] = useState(false);
  const [isFollowingActionInProgress, setIsFollowingActionInProgress] =
    useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
    email: "",
    img: "",
    dob: "",
    id: "",
    stats: {
      posts: 0,
    },
  });

  // Social network states
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [countPosts, setCountPosts] = useState(0);

  const postsObserver = useRef();

  // Fetch user info on component mount
  useEffect(() => {
    getUserInfo();
    getCountPosts(userId).then((res) => {
      setCountPosts(res);
    });
  }, [userId]);

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const response = await patientApi.getById(userId);
      if (response && response.code === 1000 && response.result) {
        console.log("User info:", response.result);

        // Update the userInfo with data from API
        setUserInfo({
          ...response.result,
          stats: {
            posts: response.result.posts?.length || 0,
          },
        });

        // Set follower/following counts
        setFollowersCount(response.result.followersCount || 0);
        setFollowingCount(response.result.followingCount || 0);

        // Check if current user is following this user
        setIsFollowing(response.result.isFollowing || false);
        setIsPendingRequest(response.result.isPendingRequest || false);

        // Fetch user posts
        fetchPosts(true, response.result.id);
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
  const fetchPosts = async (reset = false, targetUserId) => {
    if (reset) {
      setPage(0);
      setHasMore(true);
      setPosts([]);
    }

    if (!hasMore && !reset) return;

    setLoadingPosts(true);
    try {
      const data = await getAllPostsByUser(page, 10, targetUserId);
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

  // Intersection Observer for posts infinite scrolling
  const lastPostElementRef = useCallback(
    (node) => {
      if (loadingPosts) return;
      if (postsObserver.current) postsObserver.current.disconnect();
      postsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts(false, userInfo.id);
        }
      });
      if (node) postsObserver.current.observe(node);
    },
    [loadingPosts, hasMore, userInfo.id]
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleFollowUser = async () => {
    // Prevent multiple clicks
    if (isFollowingActionInProgress) return;
    setIsFollowingActionInProgress(true);

    try {
      if (isFollowing || isPendingRequest) {
        // This is an unfollow action
        // Update UI immediately (optimistic update)
        setIsFollowing(false);
        setIsPendingRequest(false);

        // Call API to unfollow
        await followUser(userId);
      } else {
        // This is a follow action
        // Check if the user has a private profile
        const isPrivate = await checkUserPrivate(userId);

        // Update UI based on privacy setting
        if (isPrivate) {
          setIsPendingRequest(true);
        } else {
          setIsFollowing(true);
        }

        // Call API
        await followUser(userId);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);

      // Revert UI on error
      setIsFollowing(isFollowing);
      setIsPendingRequest(isPendingRequest);

      toast.error("Không thể thay đổi trạng thái theo dõi");
    } finally {
      setIsFollowingActionInProgress(false);
    }
  };

  // Render post grid
  const renderPostGrid = (posts, loading) => (
    <Grid container spacing={1.5}>
      {posts.map((post, index) => (
        <Grid
          item
          xs={4}
          key={post.id}
          ref={index === posts.length - 1 ? lastPostElementRef : null}
        >
          <Card
            sx={{
              position: "relative",
              height: 0,
              paddingTop: "100%", // 1:1 Aspect ratio
              cursor: "pointer",
              borderRadius: 1.5,
              overflow: "hidden",
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 20px ${alpha(
                  theme.palette.common.black,
                  0.15
                )}`,
              },
            }}
            onClick={() => handlePostClick(post)}
          >
            {post.imageUrls && post.imageUrls.length > 0 ? (
              <CardMedia
                component="img"
                image={post.imageUrls[0]}
                alt={post.title || "Post image"}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  p: 2,
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.content}
                </Typography>
              </Box>
            )}

            {/* Overlay with stats on hover */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.3s",
                "&:hover": {
                  opacity: 1,
                },
                gap: 2,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", color: "white" }}
              >
                <FavoriteIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{post.countLikes || 0}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", color: "white" }}
              >
                <CommentIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  {post.countComments || 0}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}

      {loading &&
        Array(3)
          .fill()
          .map((_, index) => (
            <Grid item xs={4} key={`skeleton-${index}`}>
              <Box
                sx={{
                  width: "100%",
                  height: 0,
                  paddingTop: "100%",
                  borderRadius: 1.5,
                  backgroundColor: alpha(theme.palette.divider, 0.1),
                }}
              />
            </Grid>
          ))}
    </Grid>
  );

  // Function to handle post click - would implement post viewing modal
  const handlePostClick = (post) => {
    // For now, just navigate to post detail page
    navigate(`/social-network/post/${post.id}`);
  };

  // Update the "User's Posts" tab rendering
  const renderUserPostsTab = () => (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Bài viết của {userInfo.name}
        </Typography>
      </Box>

      {loadingPosts && posts.length === 0 ? (
        renderPostGrid([], true)
      ) : (
        <>
          {posts.length > 0 ? (
            renderPostGrid(posts, loadingPosts)
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: 60,
                  color: alpha(theme.palette.text.secondary, 0.5),
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Người dùng chưa có bài viết nào
              </Typography>
            </Paper>
          )}
        </>
      )}
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
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            mt: 2,
                          }}
                        >
                          <Box
                            sx={{
                              textTransform: "none",
                              display: "flex",
                              alignItems: "center",
                            }}
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
                          </Box>
                          <Box
                            sx={{
                              textTransform: "none",
                              display: "flex",
                              alignItems: "center",
                            }}
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
                          </Box>
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
                            {countPosts}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Bài viết
                          </Typography>
                        </Box>
                      </Box>

                      <Stack spacing={2} sx={{ mt: 4 }}>
                        <Button
                          variant={
                            isPendingRequest
                              ? "contained"
                              : isFollowing
                              ? "contained"
                              : "outlined"
                          }
                          color={isPendingRequest ? "warning" : "primary"}
                          fullWidth
                          onClick={handleFollowUser}
                          sx={{
                            py: 1.2,
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                          }}
                        >
                          {isPendingRequest
                            ? "Đã gửi yêu cầu"
                            : isFollowing
                            ? "Đang theo dõi"
                            : "Theo dõi"}
                        </Button>
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
                    <Box sx={{ p: 3 }}>{renderUserPostsTab()}</Box>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default ViewProfile;
