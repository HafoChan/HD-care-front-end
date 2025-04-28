// src/components/social-network/PostCardComponent.js
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  IconButton,
  Typography,
  Box,
  CardMedia,
  Button,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CommentIcon from "@mui/icons-material/Comment";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  interactPost,
  toggleSavePost,
  commentOnPost,
  getAllCommentsByPost,
  deletePost,
} from "../../api/socialNetworkApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PostCard = ({ post, onRefresh, onLike, onSave }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [saved, setSaved] = useState(post.saved || false);
  const [likeCount, setLikeCount] = useState(post.countLikes || 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const theme = useTheme();
  const open = Boolean(anchorEl);

  // Update local state when post prop changes
  useEffect(() => {
    setLiked(post.liked || false);
    setSaved(post.saved || false);
    setLikeCount(post.countLikes || 0);
  }, [post.liked, post.saved, post.countLikes]);

  const handleLike = async () => {
    try {
      // Update local state immediately for a smooth UI experience
      const newLikedState = !liked;
      const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;

      setLiked(newLikedState);
      setLikeCount(newLikeCount);

      // If parent provides onLike callback, use it for optimistic updates
      if (onLike) {
        onLike();
      }

      // Call API in background
      await interactPost(post.id);

      // Only refresh if explicitly requested and no optimistic update handler
      if (onRefresh && !onLike) onRefresh();
    } catch (error) {
      // Revert on error
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      toast.error("Không thể thực hiện hành động. Vui lòng thử lại sau.");
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Update local state immediately
      setSaved(!saved);

      // If parent provides onSave callback, use it for optimistic updates
      if (onSave) {
        onSave();
      }

      // Call API in background
      await toggleSavePost(post.id);

      // Only refresh if explicitly requested and no optimistic update handler
      if (onRefresh && !onSave) onRefresh();
    } catch (error) {
      // Revert on error
      setSaved(!saved);
      toast.error("Không thể lưu bài viết. Vui lòng thử lại sau.");
      console.error("Error toggling save:", error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditPost = () => {
    handleMenuClose();
    window.location.href = `/social-network/edit-post/${post.id}`;
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      toast.success("Xóa bài viết thành công");
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Không thể xóa bài viết. Vui lòng thử lại sau.");
      console.error("Error deleting post:", error);
    }
    handleMenuClose();
  };

  const handleOpenCommentDialog = async () => {
    setCommentDialogOpen(true);
    setCommentPage(0);
    setComments([]);
    setHasMoreComments(true);
    await fetchComments(true);
  };

  const handleCloseCommentDialog = () => {
    setCommentDialogOpen(false);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      await commentOnPost(post.id, { content: commentText });
      setCommentText("");
      await fetchComments(true);
      post.countComments = (post.countComments || 0) + 1;
      toast.success("Bình luận đã được thêm");
    } catch (error) {
      toast.error("Không thể thêm bình luận. Vui lòng thử lại sau.");
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const fetchComments = async (reset = false) => {
    if (reset) {
      setCommentPage(0);
      setComments([]);
      setHasMoreComments(true);
    }

    if (!hasMoreComments && !reset) return;

    try {
      setLoadingComments(true);
      const data = await getAllCommentsByPost(
        post.id,
        reset ? 0 : commentPage,
        10
      );

      if (data && data.length > 0) {
        setComments((prev) => (reset ? data : [...prev, ...data]));
        setHasMoreComments(data.length === 10);
        setCommentPage((prev) => prev + 1);
      } else {
        setHasMoreComments(false);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Không thể tải bình luận. Vui lòng thử lại sau.");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentsScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMoreComments && !loadingComments) {
      fetchComments();
    }
  };

  const formatPostDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true, locale: vi });
      } else if (diffInHours < 48) {
        return "Hôm qua";
      } else {
        return format(date, "dd/MM/yyyy", { locale: vi });
      }
    } catch (error) {
      return dateString || "";
    }
  };

  // Determine if the post is from the current user
  const isCurrentUserPost = post.isCurrentUserPost || false;

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        marginBottom: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.08)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            component={Link}
            to={`/social-network/profile/${post.user?.id || "unknown"}`}
            sx={{
              width: 44,
              height: 44,
              border: "2px solid",
              borderColor: theme.palette.primary.main,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
            src={post.user?.avatar}
            aria-label={post.user?.name}
          >
            {post.user?.name ? post.user.name[0].toUpperCase() : "U"}
          </Avatar>
        }
        action={
          <Box>
            {post.isHidden && (
              <Chip
                size="small"
                icon={<VisibilityIcon fontSize="small" />}
                label="Riêng tư"
                sx={{
                  mr: 1,
                  fontSize: "0.7rem",
                  height: 24,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                }}
              />
            )}
            <IconButton
              aria-label="settings"
              onClick={handleMenuClick}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: 180,
                  borderRadius: 2,
                  mt: 1.5,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {isCurrentUserPost
                ? [
                    <MenuItem key="edit" onClick={handleEditPost}>
                      <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Chỉnh sửa bài viết</ListItemText>
                    </MenuItem>,
                    <MenuItem
                      key="delete"
                      onClick={handleDeletePost}
                      sx={{ color: "error.main" }}
                    >
                      <ListItemIcon sx={{ color: "error.main" }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Xóa bài viết</ListItemText>
                    </MenuItem>,
                  ]
                : [
                    <MenuItem
                      key="save"
                      onClick={() => {
                        handleSave();
                        handleMenuClose();
                      }}
                    >
                      <ListItemIcon>
                        {saved ? (
                          <BookmarkIcon fontSize="small" />
                        ) : (
                          <BookmarkBorderIcon fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText>
                        {saved ? "Bỏ lưu bài viết" : "Lưu bài viết"}
                      </ListItemText>
                    </MenuItem>,
                    <MenuItem key="report" onClick={handleMenuClose}>
                      <ListItemIcon>
                        <ReportOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Báo cáo bài viết</ListItemText>
                    </MenuItem>,
                  ]}
            </Menu>
          </Box>
        }
        title={
          <Typography
            component={Link}
            to={`/social-network/profile/${post.user?.id || "unknown"}`}
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              textDecoration: "none",
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {post.user?.name || "User"}
            {post.user?.role && (
              <Chip
                label={post.user.role}
                size="small"
                sx={{ ml: 1, fontSize: "0.7rem", height: 20 }}
              />
            )}
          </Typography>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {formatPostDate(post.createdAt)}
            </Typography>
          </Box>
        }
      />

      <CardContent sx={{ pb: 1 }}>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {post.content}
        </Typography>
      </CardContent>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns:
                post.imageUrls.length === 1
                  ? "1fr"
                  : post.imageUrls.length === 2
                  ? "1fr 1fr"
                  : "1fr 1fr 1fr",
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {post.imageUrls.slice(0, 3).map((url, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  paddingTop: "100%", // 1:1 aspect ratio
                  cursor: "pointer",
                }}
                onClick={() =>
                  (window.location.href = `/social-network/post/${post.id}`)
                }
              >
                <CardMedia
                  component="img"
                  image={url}
                  alt={`Post image ${index + 1}`}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {index === 2 && post.imageUrls.length > 3 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      +{post.imageUrls.length - 3}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <CardActions disableSpacing sx={{ px: 2, py: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Tooltip title={liked ? "Bỏ thích" : "Thích"}>
            <IconButton
              aria-label="like"
              onClick={handleLike}
              sx={{
                color: liked ? "primary.main" : "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            {likeCount}
          </Typography>

          <Tooltip title="Bình luận">
            <IconButton
              aria-label="comment"
              onClick={handleOpenCommentDialog}
              sx={{
                ml: 2,
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <CommentIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            {post.countComments || 0}
          </Typography>
        </Box>

        <Tooltip title={saved ? "Bỏ lưu" : "Lưu bài viết"}>
          <IconButton
            aria-label="save"
            onClick={handleSave}
            sx={{
              color: saved ? "primary.main" : "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Chia sẻ">
          <IconButton
            aria-label="share"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </CardActions>

      <Divider />

      {/* Comments section would go here */}

      <Dialog
        open={commentDialogOpen}
        onClose={handleCloseCommentDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            height: { xs: "100%", sm: "80vh" },
            maxHeight: { xs: "100%", sm: "80vh" },
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CommentIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Bình luận</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List
            sx={{
              height: "calc(100% - 80px)",
              overflowY: "auto",
              pt: 0,
            }}
            onScroll={handleCommentsScroll}
          >
            {comments.length > 0 ? (
              comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar src={comment.user?.avatar}>
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
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {comment.user?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {comment.createdAt
                              ? formatDistanceToNow(
                                  new Date(comment.createdAt),
                                  { addSuffix: true, locale: vi }
                                )
                              : "vừa xong"}
                          </Typography>
                        </Box>
                      }
                      secondary={comment.content}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Chưa có bình luận nào
                </Typography>
              </Box>
            )}
            {loadingComments && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </List>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            display: "flex",
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Viết bình luận..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            size="small"
            sx={{ mr: 1 }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <Button
            onClick={handleSubmitComment}
            variant="contained"
            color="primary"
            disabled={!commentText.trim() || isSubmittingComment}
          >
            {isSubmittingComment ? <CircularProgress size={24} /> : "Gửi"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;
