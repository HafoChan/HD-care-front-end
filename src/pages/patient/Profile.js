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
  CardMedia,
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SendIcon from "@mui/icons-material/Send";
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
  getAllSavedPosts,
  toggleSavePost,
  interactPost,
  getAllCommentsByPost,
  commentOnPost,
} from "../../api/socialNetworkApi";
import PostCard from "../../components/social-network/PostCardComponent";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

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
  const [savedPosts, setSavedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingSavedPosts, setLoadingSavedPosts] = useState(true);
  const [page, setPage] = useState(0);
  const [savedPostsPage, setSavedPostsPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreSavedPosts, setHasMoreSavedPosts] = useState(true);
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const followersObserver = useRef();
  const followingObserver = useRef();
  const postsObserver = useRef();
  const savedPostsObserver = useRef();

  // Add these state variables at the beginning of the component, with other states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsPage, setCommentsPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const commentsObserver = useRef();

  // Add this state variable to handle multiple actions in progress
  const [isFollowingActionInProgress, setIsFollowingActionInProgress] =
    useState(false);

  // Fetch user info on component mount
  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    try {
      setLoading(true);
      const response = await patientApi.getInfo();
      console.log(response);
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
  const fetchPosts = async (reset = false, userId) => {
    if (reset) {
      setPage(0);
      setHasMore(true);
      setPosts([]);
    }

    if (!hasMore && !reset) return;

    setLoadingPosts(true);
    try {
      const data = await getAllPostsByUser(page, 10, userId);
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

  // Function to fetch saved posts
  const fetchSavedPosts = async (reset = false) => {
    if (reset) {
      setSavedPostsPage(0);
      setHasMoreSavedPosts(true);
      setSavedPosts([]);
    }

    if (!hasMoreSavedPosts && !reset) return;

    setLoadingSavedPosts(true);
    try {
      const data = await getAllSavedPosts(savedPostsPage, 10);
      if (data && data.length > 0) {
        // Ensure each post has saved property set to true
        const processedData = data.map((post) => ({
          ...post,
          saved: true,
        }));
        setSavedPosts((prev) =>
          reset ? processedData : [...prev, ...processedData]
        );
        setHasMoreSavedPosts(data.length === 10);
        setSavedPostsPage((prev) => prev + 1);
      } else {
        setHasMoreSavedPosts(false);
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      toast.error("Không thể tải bài viết đã lưu");
    } finally {
      setLoadingSavedPosts(false);
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
      const data = await getAllFollowers(followersPage, 10, userInfo.id);
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
      const data = await getAllFollowingUsers(followingPage, 10, userInfo.id);
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

  // Add intersection observers for posts and saved posts infinite scrolling
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

  const lastSavedPostElementRef = useCallback(
    (node) => {
      if (loadingSavedPosts) return;
      if (savedPostsObserver.current) savedPostsObserver.current.disconnect();
      savedPostsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreSavedPosts) {
          fetchSavedPosts();
        }
      });
      if (node) savedPostsObserver.current.observe(node);
    },
    [loadingSavedPosts, hasMoreSavedPosts]
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
    // Reset pagination
    setFollowersPage(0);
    setHasMoreFollowers(true);
    setFollowers([]);
  };

  const handleOpenFollowing = () => {
    setShowFollowing(true);
    fetchFollowing(true);
  };

  const handleCloseFollowing = () => {
    setShowFollowing(false);
    // Reset pagination
    setFollowingPage(0);
    setHasMoreFollowing(true);
    setFollowing([]);
  };

  const handleFollowUser = async (userId, isCurrentlyFollowed) => {
    // Prevent multiple clicks
    if (isFollowingActionInProgress) return;
    setIsFollowingActionInProgress(true);

    try {
      // Update UI immediately (optimistic update)
      // Update followers list
      setFollowers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, followed: !isCurrentlyFollowed }
            : user
        )
      );

      // Update following list
      setFollowing((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, followed: !isCurrentlyFollowed }
            : user
        )
      );

      // Call API
      await followUser(userId);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);

      // Revert UI on error
      setFollowers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, followed: isCurrentlyFollowed } : user
        )
      );

      setFollowing((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, followed: isCurrentlyFollowed } : user
        )
      );
    } finally {
      setIsFollowingActionInProgress(false);
    }
  };

  // Handle toggle save for a post
  const handleToggleSave = async (postId) => {
    try {
      // Find the post in different lists
      const postIndexInSaved = savedPosts.findIndex(
        (post) => post.id === postId
      );
      const postIndexInPosts = posts.findIndex((post) => post.id === postId);
      const isPostInSaved = postIndexInSaved !== -1;
      const isPostInMyPosts = postIndexInPosts !== -1;

      // Toggle saved status in selectedPost if it's the one being displayed in modal
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          saved: !selectedPost.saved,
        });
      }

      // Update savedPosts list if post exists there
      if (isPostInSaved) {
        const updatedSavedPosts = [...savedPosts];
        updatedSavedPosts[postIndexInSaved] = {
          ...updatedSavedPosts[postIndexInSaved],
          saved: !updatedSavedPosts[postIndexInSaved].saved,
        };
        setSavedPosts(updatedSavedPosts);

        // If the post is now unsaved, remove it from the list after a short delay
        if (!updatedSavedPosts[postIndexInSaved].saved) {
          setTimeout(() => {
            setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
          }, 500);
        }
      }

      // Update posts list if post exists there
      if (isPostInMyPosts) {
        const updatedPosts = [...posts];
        updatedPosts[postIndexInPosts] = {
          ...updatedPosts[postIndexInPosts],
          saved: !updatedPosts[postIndexInPosts].saved,
        };
        setPosts(updatedPosts);
      }

      // Call API
      await toggleSavePost(postId);
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Không thể lưu bài viết");

      // Revert UI change on error
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          saved: !selectedPost.saved,
        });
      }

      setSavedPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, saved: !post.saved } : post
        )
      );

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, saved: !post.saved } : post
        )
      );
    }
  };

  // Handle toggle like for a post
  const handleToggleLike = async (postId) => {
    try {
      // Find the post in different lists
      const postIndexInSaved = savedPosts.findIndex(
        (post) => post.id === postId
      );
      const postIndexInPosts = posts.findIndex((post) => post.id === postId);
      const isPostInSaved = postIndexInSaved !== -1;
      const isPostInMyPosts = postIndexInPosts !== -1;

      // Toggle like status in selectedPost if it's the one being displayed in modal
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          liked: !selectedPost.liked,
          countLikes: selectedPost.liked
            ? selectedPost.countLikes - 1
            : selectedPost.countLikes + 1,
        });
      }

      // Update savedPosts list if post exists there
      if (isPostInSaved) {
        const updatedSavedPosts = [...savedPosts];
        const currentLiked = updatedSavedPosts[postIndexInSaved].liked;
        updatedSavedPosts[postIndexInSaved] = {
          ...updatedSavedPosts[postIndexInSaved],
          liked: !currentLiked,
          countLikes: currentLiked
            ? updatedSavedPosts[postIndexInSaved].countLikes - 1
            : updatedSavedPosts[postIndexInSaved].countLikes + 1,
        };
        setSavedPosts(updatedSavedPosts);
      }

      // Update posts list if post exists there
      if (isPostInMyPosts) {
        const updatedPosts = [...posts];
        const currentLiked = updatedPosts[postIndexInPosts].liked;
        updatedPosts[postIndexInPosts] = {
          ...updatedPosts[postIndexInPosts],
          liked: !currentLiked,
          countLikes: currentLiked
            ? updatedPosts[postIndexInPosts].countLikes - 1
            : updatedPosts[postIndexInPosts].countLikes + 1,
        };
        setPosts(updatedPosts);
      }

      // Call API
      await interactPost(postId);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Không thể thích bài viết");

      // Revert UI change on error
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          liked: !selectedPost.liked,
          countLikes: !selectedPost.liked
            ? selectedPost.countLikes - 1
            : selectedPost.countLikes + 1,
        });
      }

      // Revert savedPosts list
      setSavedPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                countLikes: !post.liked
                  ? post.countLikes - 1
                  : post.countLikes + 1,
              }
            : post
        )
      );

      // Revert posts list
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                countLikes: !post.liked
                  ? post.countLikes - 1
                  : post.countLikes + 1,
              }
            : post
        )
      );
    }
  };

  // Load appropriate data when tab changes
  useEffect(() => {
    setPage(0);
    setSavedPostsPage(0);
    if (userInfo?.id && tabValue === 0) {
      fetchPosts(true, userInfo?.id);
    } else if (userInfo?.id && tabValue === 1) {
      fetchSavedPosts(true);
    }
  }, [tabValue]);

  // Render followers modal
  const renderFollowersModal = () => (
    <Dialog
      open={showFollowers}
      onClose={handleCloseFollowers}
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
            Người theo dõi
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
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
                      variant={user.followed ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleFollowUser(user.id, user.followed)}
                      sx={{
                        borderRadius: 6,
                        textTransform: "none",
                        px: 2,
                        py: 0.8,
                        minWidth: user.followed ? "120px" : "80px",
                      }}
                    >
                      {user.followed ? "Đang theo dõi" : "Theo dõi"}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < followers.length - 1 && <Divider sx={{ mx: 3 }} />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <PersonIcon
                sx={{
                  fontSize: 50,
                  color: alpha(theme.palette.text.secondary, 0.5),
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Không có người theo dõi nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy chia sẻ trang cá nhân của bạn để có nhiều người theo dõi hơn
              </Typography>
            </Box>
          )}
          {loadingFollowers && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleCloseFollowers}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
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
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: "80vh" },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PersonAddIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="h5" fontWeight={600}>
            Đang theo dõi
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
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
                      variant={user.followed ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleFollowUser(user.id, user.followed)}
                      sx={{
                        borderRadius: 6,
                        textTransform: "none",
                        px: 2,
                        py: 0.8,
                        minWidth: user.followed ? "120px" : "80px",
                      }}
                    >
                      {user.followed ? "Đang theo dõi" : "Theo dõi"}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < following.length - 1 && <Divider sx={{ mx: 3 }} />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <PersonIcon
                sx={{
                  fontSize: 50,
                  color: alpha(theme.palette.text.secondary, 0.5),
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa theo dõi ai
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy khám phá và theo dõi người dùng khác để xem bài viết của họ
              </Typography>
            </Box>
          )}
          {loadingFollowing && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleCloseFollowing}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render post grid
  const renderPostGrid = (posts, loading, isMyPosts = true) => (
    <Grid container spacing={1.5}>
      {posts.map((post, index) => (
        <Grid
          item
          xs={4}
          key={post.id}
          ref={
            index === posts.length - 1
              ? isMyPosts
                ? lastPostElementRef
                : lastSavedPostElementRef
              : null
          }
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
              <Skeleton
                variant="rectangular"
                sx={{
                  width: "100%",
                  height: 0,
                  paddingTop: "100%",
                  borderRadius: 1.5,
                }}
              />
            </Grid>
          ))}
    </Grid>
  );

  // Add this function to handle image navigation
  const handleImageNavigation = (direction) => {
    if (
      !selectedPost ||
      !selectedPost.imageUrls ||
      selectedPost.imageUrls.length <= 1
    )
      return;

    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === selectedPost.imageUrls.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedPost.imageUrls.length - 1 : prev - 1
      );
    }
  };

  // Add this function to fetch comments
  const fetchComments = async (postId, reset = false) => {
    if (!postId) return;

    if (reset) {
      setCommentsPage(0);
      setComments([]);
      setHasMoreComments(true);
    }

    if (!hasMoreComments && !reset) return;

    setLoadingComments(true);
    try {
      const data = await getAllCommentsByPost(postId, commentsPage);
      if (data && data.length > 0) {
        setComments((prev) => (reset ? data : [...prev, ...data]));
        setHasMoreComments(data.length === 10);
        setCommentsPage((prev) => prev + 1);
      } else {
        setHasMoreComments(false);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Không thể tải bình luận");
    } finally {
      setLoadingComments(false);
    }
  };

  // Add this function to handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !selectedPost?.id) return;

    try {
      await commentOnPost(selectedPost.id, { content: commentText.trim() });
      setCommentText("");
      // Refetch comments to include the new one
      fetchComments(selectedPost.id, true);
      // Update comment count
      setSelectedPost({
        ...selectedPost,
        countComments: (selectedPost.countComments || 0) + 1,
      });

      // Also update the post in the lists
      const updatePostInList = (list, setter) => {
        const index = list.findIndex((p) => p.id === selectedPost.id);
        if (index !== -1) {
          const updatedList = [...list];
          updatedList[index] = {
            ...updatedList[index],
            countComments: (updatedList[index].countComments || 0) + 1,
          };
          setter(updatedList);
        }
      };

      updatePostInList(posts, setPosts);
      updatePostInList(savedPosts, setSavedPosts);

      toast.success("Đã thêm bình luận");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Không thể thêm bình luận");
    }
  };

  // Add intersection observer for comments
  const lastCommentElementRef = useCallback(
    (node) => {
      if (loadingComments) return;
      if (commentsObserver.current) commentsObserver.current.disconnect();
      commentsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreComments) {
          fetchComments(selectedPost?.id);
        }
      });
      if (node) commentsObserver.current.observe(node);
    },
    [loadingComments, hasMoreComments, selectedPost]
  );

  // Modify handlePostClick to reset image index and fetch comments
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
    setPostModalOpen(true);
    fetchComments(post.id, true);
  };

  // Modify handleClosePostModal to reset states
  const handleClosePostModal = () => {
    setPostModalOpen(false);
    setSelectedPost(null);
    setCurrentImageIndex(0);
    setComments([]);
    setCommentsPage(0);
    setHasMoreComments(true);
  };

  // Update the renderPostModal function with image navigation and comments section
  const renderPostModal = () => (
    <Dialog
      open={postModalOpen}
      onClose={handleClosePostModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
          overflow: "hidden",
          minWidth: "80%",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {selectedPost && (
          <Grid container>
            {/* Post image with navigation */}
            {selectedPost.imageUrls && selectedPost.imageUrls.length > 0 && (
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  height: { md: "75vh", xs: "40vh" },
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={selectedPost.imageUrls[currentImageIndex]}
                    alt={selectedPost.title || "Post image"}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />

                  {/* Image pagination indicator */}
                  {selectedPost.imageUrls.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: 1,
                        zIndex: 2,
                      }}
                    >
                      {selectedPost.imageUrls.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor:
                              index === currentImageIndex
                                ? theme.palette.common.white
                                : alpha(theme.palette.common.white, 0.5),
                            transition: "all 0.2s",
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Navigation buttons */}
                  {selectedPost.imageUrls.length > 1 && (
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageNavigation("prev");
                        }}
                        sx={{
                          position: "absolute",
                          left: 16,
                          backgroundColor: alpha(
                            theme.palette.common.black,
                            0.5
                          ),
                          color: theme.palette.common.white,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.common.black,
                              0.7
                            ),
                          },
                        }}
                      >
                        <NavigateBeforeIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageNavigation("next");
                        }}
                        sx={{
                          position: "absolute",
                          right: 16,
                          backgroundColor: alpha(
                            theme.palette.common.black,
                            0.5
                          ),
                          color: theme.palette.common.white,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.common.black,
                              0.7
                            ),
                          },
                        }}
                      >
                        <NavigateNextIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Grid>
            )}

            {/* Post details */}
            <Grid
              item
              xs={12}
              md={
                selectedPost.imageUrls && selectedPost.imageUrls.length > 0
                  ? 4
                  : 12
              }
              sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: { md: "75vh", xs: "none" },
              }}
            >
              {/* Post header */}
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Avatar
                  src={selectedPost.user?.avatar}
                  sx={{
                    width: 50,
                    height: 50,
                    mr: 2,
                    boxShadow: `0 2px 10px ${alpha(
                      theme.palette.common.black,
                      0.1
                    )}`,
                  }}
                >
                  {selectedPost.user?.name
                    ? selectedPost.user.name[0].toUpperCase()
                    : "U"}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedPost.user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedPost.createdAt
                      ? formatDistanceToNow(new Date(selectedPost.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })
                      : "vừa xong"}
                  </Typography>
                </Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedPost.id) {
                      handleToggleLike(selectedPost.id);
                    }
                  }}
                  color={selectedPost.liked ? "error" : "default"}
                  sx={{ mr: 1 }}
                >
                  {selectedPost.liked ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedPost.id) {
                      handleToggleSave(selectedPost.id);
                    }
                  }}
                  color={selectedPost.saved ? "primary" : "default"}
                >
                  {selectedPost.saved ? (
                    <BookmarkIcon />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </Box>

              {/* Post content */}
              <Box sx={{ p: 3, flexGrow: 0, overflow: "auto" }}>
                {selectedPost.title && (
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {selectedPost.title}
                  </Typography>
                )}
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                >
                  {selectedPost.content}
                </Typography>
              </Box>

              {/* Post stats */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: 1,
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
                    <FavoriteIcon
                      color="error"
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {selectedPost.countLikes || 0} thích
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CommentIcon
                      color="primary"
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {selectedPost.countComments || 0} bình luận
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {selectedPost.createdAt &&
                    new Date(selectedPost.createdAt).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                </Typography>
              </Box>

              {/* Comments section */}
              <Box sx={{ flexGrow: 1, overflow: "auto", px: 3, py: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Bình luận
                </Typography>

                {/* Comment list */}
                <List disablePadding>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <ListItem
                        key={comment.id}
                        alignItems="flex-start"
                        disablePadding
                        disableGutters
                        ref={
                          index === comments.length - 1
                            ? lastCommentElementRef
                            : null
                        }
                        sx={{ mb: 2 }}
                      >
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar
                            src={comment.user?.avatar}
                            sx={{ width: 32, height: 32 }}
                          >
                            {comment.user?.name
                              ? comment.user.name[0].toUpperCase()
                              : "U"}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 1,
                              }}
                            >
                              <Typography variant="subtitle2" fontWeight={600}>
                                {comment.user?.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {comment.createdAt
                                  ? formatDistanceToNow(
                                      new Date(comment.createdAt),
                                      {
                                        addSuffix: true,
                                        locale: vi,
                                      }
                                    )
                                  : "vừa xong"}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}
                            >
                              {comment.content}
                            </Typography>
                          }
                          sx={{ margin: 0 }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <CommentIcon
                        sx={{
                          fontSize: 40,
                          color: alpha(theme.palette.text.secondary, 0.5),
                          mb: 1,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Chưa có bình luận nào
                      </Typography>
                    </Box>
                  )}

                  {loadingComments && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </List>
              </Box>

              {/* Comment input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar src={userInfo?.img} sx={{ width: 36, height: 36 }}>
                  {userInfo?.name ? userInfo.name[0].toUpperCase() : "U"}
                </Avatar>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Viết bình luận..."
                  variant="outlined"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Button
          onClick={handleClosePostModal}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, px: 3, textTransform: "none" }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Update the "My Posts" tab rendering
  const renderMyPostsTab = () => (
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
          Bài viết của tôi
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArticleIcon />}
          onClick={() => navigate("/social-network/create-post")}
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
        renderPostGrid([], true, true)
      ) : (
        <>
          {posts.length > 0 ? (
            renderPostGrid(posts, loadingPosts, true)
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
                Bạn chưa có bài viết nào
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 450, mx: "auto", mb: 3 }}
              >
                Hãy bắt đầu chia sẻ trải nghiệm của bạn hoặc đặt câu hỏi cho
                cộng đồng bằng cách tạo bài viết mới.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/social-network/create-post")}
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
        </>
      )}
    </Box>
  );

  // Update the "Saved Posts" tab rendering
  const renderSavedPostsTab = () => (
    <Box>
      <Typography
        variant="h5"
        fontWeight={600}
        color="text.primary"
        gutterBottom
      >
        Bài viết đã lưu
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Đây là nơi bạn có thể truy cập nhanh các bài viết đã lưu.
      </Typography>

      {loadingSavedPosts && savedPosts.length === 0 ? (
        renderPostGrid([], true, false)
      ) : (
        <>
          {savedPosts.length > 0 ? (
            renderPostGrid(savedPosts, loadingSavedPosts, false)
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
              <BookmarkBorderIcon
                sx={{
                  fontSize: 60,
                  color: alpha(theme.palette.text.secondary, 0.5),
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Bạn chưa lưu bài viết nào
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 450, mx: "auto", mb: 3 }}
              >
                Khi bạn lưu bài viết, chúng sẽ xuất hiện ở đây để bạn có thể xem
                lại sau.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/social-network")}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Khám phá bài viết
              </Button>
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
                      {tabValue === 0 && renderMyPostsTab()}
                      {tabValue === 1 && renderSavedPostsTab()}
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

      {/* Post Modal */}
      {renderPostModal()}
    </Box>
  );
}

export default Profile;
