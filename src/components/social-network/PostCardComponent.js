// src/components/social-network/PostCardComponent.js
import React, { useState } from "react";
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
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { interactPost, toggleSavePost } from "../../api/socialNetworkApi";
import { Link } from "react-router-dom";

const PostCard = ({ post, onRefresh }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [saved, setSaved] = useState(post.saved || false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);

  const handleLike = async () => {
    await interactPost(post.id);
    setLiked(!liked);
    if (onRefresh) onRefresh();
  };

  const handleSave = async () => {
    await toggleSavePost(post.id);
    setSaved(!saved);
    if (onRefresh) onRefresh();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
                    <MenuItem key="edit" onClick={handleMenuClose}>
                      <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Chỉnh sửa bài viết</ListItemText>
                    </MenuItem>,
                    <MenuItem
                      key="delete"
                      onClick={handleMenuClose}
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

      {post.images && post.images.length > 0 && (
        <Box sx={{ p: 2, pt: 0 }}>
          <CardMedia
            component="img"
            image={post.images[0]}
            alt="Post image"
            sx={{
              borderRadius: 2,
              maxHeight: 400,
              objectFit: "cover",
            }}
          />
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
            {post.countLikes || 0}
          </Typography>

          <Tooltip title="Bình luận">
            <IconButton
              aria-label="comment"
              sx={{
                ml: 2,
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ChatBubbleOutlineIcon />
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
    </Card>
  );
};

export default PostCard;
