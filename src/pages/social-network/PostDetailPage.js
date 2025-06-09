import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  ImageList,
  ImageListItem,
  Dialog,
  IconButton,
  useTheme,
  alpha,
  Avatar,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HeaderComponent from "../../components/patient/HeaderComponent";
import PostCard from "../../components/social-network/PostCardComponent";
import { getPostById } from "../../api/socialNetworkApi";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const data = await getPostById(postId);
      setPost(data);
    } catch (error) {
      console.error("Error fetching post details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleCloseImageViewer = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : post.imageUrls.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < post.imageUrls.length - 1 ? prev + 1 : 0
    );
  };

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
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Container
        maxWidth={false}
        sx={{
          py: 4,
          px: { xs: 2, sm: 3, md: 10, lg: 16, xl: 25 }, // Responsive padding
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <Grid item xs={12} md={8} lg={9}>
            <PostCard post={post} onRefresh={fetchPostDetails} />

            {post?.imageUrls?.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Tất cả hình ảnh ({post.imageUrls.length})
                </Typography>
                <ImageList
                  sx={{
                    width: "100%",
                    height: "auto",
                    m: 0,
                  }}
                  cols={3}
                  rowHeight={200}
                  gap={8}
                >
                  {post.imageUrls.map((url, index) => (
                    <ImageListItem
                      key={index}
                      sx={{
                        cursor: "pointer",
                        overflow: "hidden",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: (theme) => theme.shadows[4],
                        },
                      }}
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={url}
                        alt={`Post image ${index + 1}`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            )}
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: { xs: "none", md: "block" },
              position: "sticky",
              top: 80,
              height: "fit-content",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
                backgroundColor: "background.paper",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Thông tin bài viết
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Đăng bởi: {post?.user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ngày đăng: {formatPostDate(post?.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lượt thích: {post?.countLikes || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bình luận: {post?.countComments || 0}
                </Typography>
              </Box>

              {post?.doctor && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Bác sĩ được gắn thẻ
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Avatar
                      src={post.doctor.avatar}
                      alt={post.doctor.name}
                      sx={{ width: 40, height: 40, mr: 1.5 }}
                    >
                      {post.doctor.name
                        ? post.doctor.name[0].toUpperCase()
                        : "D"}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        component={Link}
                        to={`/profile/${post.doctor.id}`}
                        sx={{
                          fontWeight: 600,
                          textDecoration: "none",
                          color: "text.primary",
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                      >
                        {post.doctor.name}
                      </Typography>
                      {post.doctor.role && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {post.doctor.role}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Image Viewer Dialog */}
      <Dialog
        fullScreen
        open={selectedImageIndex !== null}
        onClose={handleCloseImageViewer}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0, 0, 0, 0.9)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={handleCloseImageViewer}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>

          {post?.imageUrls?.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: "absolute",
                  left: 16,
                  color: "white",
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  color: "white",
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </>
          )}

          <img
            src={post?.imageUrls[selectedImageIndex]}
            alt="Full size"
            style={{
              maxWidth: "90%",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />

          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
            }}
          >
            {selectedImageIndex + 1} / {post?.imageUrls.length}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

const formatPostDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

export default PostDetailPage;
