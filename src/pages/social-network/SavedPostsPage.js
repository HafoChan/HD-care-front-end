// src/pages/social-network/SavedPostsPage.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Divider,
  useTheme,
  alpha,
  Button,
  Breadcrumbs,
  IconButton,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SortIcon from "@mui/icons-material/Sort";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getAllSavedPosts } from "../../api/socialNetworkApi";
import PostCard from "../../components/social-network/PostCardComponent";
import { Link } from "react-router-dom";

const SavedPostsPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchSavedPosts = async () => {
    setLoading(true);
    const data = await getAllSavedPosts();
    setSavedPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSavedPosts();
    // Set document title
    document.title = "Saved Posts | HD-Care Social Network";

    // Restore original title when component unmounts
    return () => {
      document.title = "HD-Care";
    };
  }, []);

  return (
    <Box
      sx={{
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.9)
            : alpha(theme.palette.grey[100], 0.5),
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Button
            component={Link}
            to="/"
            startIcon={<HomeOutlinedIcon />}
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "text.secondary",
              "&:hover": {
                color: theme.palette.primary.main,
                backgroundColor: "transparent",
              },
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/social-network"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "text.secondary",
              "&:hover": {
                color: theme.palette.primary.main,
                backgroundColor: "transparent",
              },
            }}
          >
            Social Network
          </Button>
          <Typography color="text.primary" fontWeight={600}>
            Saved Posts
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 3,
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.12)
                : alpha(theme.palette.common.black, 0.08),
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                sx={{
                  mr: 2,
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <BookmarkIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: "600" }}>
                Saved Posts
              </Typography>
            </Box>

            <Button
              startIcon={<SortIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
              }}
              size="small"
              variant="outlined"
            >
              Sort
            </Button>
          </Box>
          <Divider />

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                p: 6,
              }}
            >
              <CircularProgress
                size={40}
                sx={{ color: theme.palette.primary.main, mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Loading your saved posts...
              </Typography>
            </Box>
          ) : savedPosts.length === 0 ? (
            <Box
              sx={{
                p: 6,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookmarkBorderIcon
                sx={{
                  fontSize: 64,
                  color: "text.disabled",
                  mb: 2,
                  opacity: 0.7,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No saved posts yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 400, mx: "auto" }}
              >
                When you save posts from the social network, they'll appear here
                for easy access later.
              </Typography>
              <Button
                component={Link}
                to="/social-network"
                variant="contained"
                sx={{ mt: 3, textTransform: "none", fontWeight: 500, px: 3 }}
              >
                Explore Posts
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={3} justifyContent="center">
                {savedPosts.map((post) => (
                  <Grid item xs={12} key={post.id}>
                    <PostCard post={post} onRefresh={fetchSavedPosts} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SavedPostsPage;
