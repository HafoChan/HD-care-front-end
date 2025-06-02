import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  CardActionArea,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  Tooltip,
  Skeleton,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import { interactWithNews, toggleFavoriteNews } from "../../api/newsApi";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const NewsCard = ({
  news,
  onRefresh,
  simplified = false,
  loading = false,
  isAuthor = false,
}) => {
  const [useful, setUseful] = useState(news?.interactedUseful);
  const [useless, setUseless] = useState(news?.interactedUseless);
  const [saved, setSaved] = useState(news?.favorited);
  const [usefulCount, setUsefulCount] = useState(news?.usefulCount);
  const [uselessCount, setUselessCount] = useState(news?.uselessCount);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (news) {
      setUseful(news.interactedUseful || false);
      setUseless(news.interactedUseless || false);
      setSaved(news.favorited || false);
      setUsefulCount(news.usefulCount || 0);
      setUselessCount(news.uselessCount || 0);
    }
  }, [news]);

  const handleUseful = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await interactWithNews(news.id, true);
    if (useful) {
      setUsefulCount(usefulCount - 1);
    } else {
      setUsefulCount(usefulCount + 1);
      if (useless) {
        setUselessCount(uselessCount - 1);
        setUseless(false);
      }
    }
    setUseful(!useful);
    if (onRefresh) onRefresh();
  };

  const handleUseless = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await interactWithNews(news.id, false);
    if (useless) {
      setUselessCount(uselessCount - 1);
    } else {
      setUselessCount(uselessCount + 1);
      if (useful) {
        setUsefulCount(usefulCount - 1);
        setUseful(false);
      }
    }
    setUseless(!useless);
    if (onRefresh) onRefresh();
  };

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await toggleFavoriteNews(news.id);
    setSaved(!saved);
    if (onRefresh) onRefresh();
  };

  const handleMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const formatFullDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatRelativeDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true, locale: vi });
      } else if (diffInHours < 48) {
        return "Hôm qua";
      } else {
        return formatFullDate(dateString);
      }
    } catch (error) {
      return dateString || "";
    }
  };

  // Function to extract first image from content if available
  const extractImage = (htmlContent) => {
    if (!htmlContent) return null;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const img = doc.querySelector("img");
      return img ? img.src : null;
    } catch (error) {
      return null;
    }
  };

  // Extract a text preview without HTML tags
  const extractTextPreview = (htmlContent, maxLength = 120) => {
    if (!htmlContent) return "";

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      let text = doc.body.textContent || "";
      text = text.replace(/\s+/g, " ").trim();
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.08)",
        }}
      >
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" width="80%" height={28} />
          <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
          </Box>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="95%" />
        </CardContent>
        <Box sx={{ mt: "auto" }}>
          <Divider />
          <CardActions>
            <Skeleton variant="rectangular" width={120} height={30} />
            <Box sx={{ flexGrow: 1 }} />
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ ml: 1 }}
            />
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ ml: 1 }}
            />
          </CardActions>
        </Box>
      </Card>
    );
  }

  if (!news) return null;

  const imageUrl =
    news.thumbnailUrl ||
    extractImage(news.content) ||
    "https://via.placeholder.com/500x300?text=HD-Care";
  const textPreview = news.summary || extractTextPreview(news.content);
  const authorName =
    news.author?.fullName || news.author?.name || "Unknown Author";
  const authorImg = news.author?.profileImage || news.author?.img;

  if (simplified) {
    return (
      <Card
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.08)",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardActionArea component={Link} to={`/news/${news.id}`}>
          <Box sx={{ display: "flex", p: 2 }}>
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                sx={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 2,
                  mr: 2,
                }}
                alt={news.title}
              />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 0.5,
                  lineHeight: 1.3,
                }}
              >
                {news.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
              >
                {textPreview}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon
                  sx={{ color: "text.disabled", fontSize: 14, mr: 0.5 }}
                />
                <Typography variant="caption" color="text.disabled">
                  {formatRelativeDate(news.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.08)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={news.title}
          sx={{ objectFit: "cover" }}
        />
        {news.status && (
          <Chip
            label={news.status}
            size="small"
            color={news.status === "DRAFT" ? "warning" : "primary"}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 500,
              borderRadius: 1,
              fontSize: "0.7rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
        )}
      </Box>

      <CardContent sx={{ p: 2 }}>
        {news.category && (
          <Chip
            label={news.category}
            size="small"
            color="primary"
            variant="outlined"
            sx={{
              mb: 1.5,
              fontWeight: 500,
              borderRadius: 1,
              height: 24,
              fontSize: "0.75rem",
            }}
          />
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            component={Link}
            to={`/news/${news.id}`}
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: "text.primary",
              lineHeight: 1.3,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              minHeight: "2.6rem",
              textDecoration: "none",
              flex: 1,
              pr: 1,
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
          >
            {news.title}
          </Typography>

          <IconButton
            onClick={handleMenuClick}
            size="small"
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
            onClick={(e) => e.stopPropagation()}
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
            {isAuthor
              ? [
                  <MenuItem
                    key="edit"
                    component={Link}
                    to={`/news/edit/${news.id}`}
                    onClick={handleMenuClose}
                  >
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
                    onClick={(e) => {
                      handleSave(e);
                      handleMenuClose(e);
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

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            mb: 2,
            minHeight: "4.5rem",
            lineHeight: 1.5,
          }}
        >
          {textPreview}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
          <Avatar
            component={Link}
            to={`/social-network/profile/${news.author?.id || "unknown"}`}
            src={authorImg}
            alt={authorName}
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              border: "2px solid",
              borderColor: theme.palette.primary.main,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            {authorName?.[0] || "U"}
          </Avatar>
          <Box>
            <Typography
              component={Link}
              to={`/social-network/profile/${news.author?.id || "unknown"}`}
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                textDecoration: "none",
                display: "block",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {authorName}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon
                sx={{ fontSize: 12, mr: 0.5, color: "text.disabled" }}
              />
              <Typography variant="caption" color="text.disabled">
                {formatRelativeDate(news.createdAt)}
              </Typography>

              {news.viewCount > 0 && (
                <>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ mx: 0.5 }}
                  >
                    •
                  </Typography>
                  <VisibilityOutlinedIcon
                    sx={{ fontSize: 12, mr: 0.5, color: "text.disabled" }}
                  />
                  <Typography variant="caption" color="text.disabled">
                    {news.viewCount} lượt xem
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>

      <Box sx={{ mt: "auto" }}>
        <Divider />
        <CardActions sx={{ px: 2, py: 1, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip
              title={useful ? "Bỏ đánh giá hữu ích" : "Đánh giá hữu ích"}
            >
              <IconButton
                onClick={handleUseful}
                sx={{
                  color: useful ? theme.palette.primary.main : "text.secondary",
                  transition: "transform 0.2s",
                  mr: 0.5,
                  "&:hover": {
                    transform: "scale(1.1)",
                    color: useful
                      ? theme.palette.primary.main
                      : theme.palette.primary.light,
                  },
                }}
                size="small"
              >
                {useful ? (
                  <ThumbUpAltIcon fontSize="small" />
                ) : (
                  <ThumbUpAltOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              {usefulCount}
            </Typography>

            <Box sx={{ mx: 1 }}>
              <Tooltip
                title={
                  useless
                    ? "Bỏ đánh giá không hữu ích"
                    : "Đánh giá không hữu ích"
                }
              >
                <IconButton
                  onClick={handleUseless}
                  sx={{
                    color: useless ? "error.main" : "text.secondary",
                    transition: "transform 0.2s",
                    mr: 0.5,
                    "&:hover": {
                      transform: "scale(1.1)",
                      color: useless ? "error.main" : "error.light",
                    },
                  }}
                  size="small"
                >
                  {useless ? (
                    <ThumbDownAltIcon fontSize="small" />
                  ) : (
                    <ThumbDownAltOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                {uselessCount}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Tooltip title="Chia sẻ">
              <IconButton
                sx={{
                  color: "text.secondary",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                    color: theme.palette.primary.main,
                  },
                }}
                size="small"
              >
                <ShareOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={saved ? "Bỏ lưu" : "Lưu"}>
              <IconButton
                onClick={handleSave}
                sx={{
                  color: saved ? theme.palette.primary.main : "text.secondary",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                    color: saved
                      ? theme.palette.primary.main
                      : theme.palette.primary.light,
                  },
                }}
                size="small"
              >
                {saved ? (
                  <BookmarkIcon fontSize="small" />
                ) : (
                  <BookmarkBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Box>
    </Card>
  );
};

export default NewsCard;
