import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { getAllNews, deleteNews } from "../../api/newsApi";

const MyArticlesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [articles, setArticles] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingArticle, setDeletingArticle] = useState(null);

  // Status indicators map
  const statusMap = {
    PENDING: { label: "Pending Review", color: "warning" },
    APPROVED: { label: "Published", color: "success" },
    REJECTED: { label: "Rejected", color: "error" },
    DRAFT: { label: "Draft", color: "default" },
  };

  const fetchMyArticles = async () => {
    setLoading(true);
    try {
      // In a real app, this would be a specific API call to get user's articles
      // For now, we'll simulate it with the getAllNews function
      const data = await getAllNews(0, 100);
      const allArticles = data.content || [];

      // Separate drafts from published/pending articles
      const draftArticles = allArticles.filter((article) => article.isDraft);
      const publishedArticles = allArticles.filter(
        (article) => !article.isDraft
      );

      setArticles(publishedArticles);
      setDrafts(draftArticles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching my articles:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event, article) => {
    setAnchorEl(event.currentTarget);
    setSelectedArticle(article);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/news/edit/${selectedArticle.id}`);
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeletingArticle(selectedArticle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNews(deletingArticle.id);
      fetchMyArticles();
      setDeleteDialogOpen(false);
      setDeletingArticle(null);
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingArticle(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderArticlesList = (articlesList) => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} sx={{ color: "#262626" }} />
        </Box>
      );
    }

    if (articlesList.length === 0) {
      return (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {activeTab === 0
              ? "You haven't published any articles yet"
              : "You don't have any drafts"}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/news/create"
            startIcon={<AddIcon />}
            sx={{
              mt: 2,
              textTransform: "none",
              borderRadius: 8,
              px: 3,
            }}
          >
            Create New Article
          </Button>
        </Box>
      );
    }

    return (
      <List sx={{ width: "100%" }}>
        {articlesList.map((article) => (
          <React.Fragment key={article.id}>
            <ListItem
              sx={{
                py: 2,
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.03)",
                },
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="options"
                  onClick={(e) => handleMenuClick(e, article)}
                >
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Box
                    component={Link}
                    to={
                      article.isDraft
                        ? `/news/edit/${article.id}`
                        : `/news/${article.id}`
                    }
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      fontWeight: 500,
                      display: "block",
                      mb: 1,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {article.title}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      {formatDate(article.createdAt)}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={
                          statusMap[article.status]?.label ||
                          (article.isDraft ? "Draft" : "Pending")
                        }
                        color={statusMap[article.status]?.color || "default"}
                        size="small"
                        sx={{ fontSize: "0.7rem", height: 24 }}
                      />

                      {article.category && (
                        <Chip
                          label={article.category}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, fontSize: "0.7rem", height: 24 }}
                        />
                      )}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              to="/news"
              style={{
                textDecoration: "none",
                color: "#757575",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
              Trở lại trang tin tức
            </Link>
          </Breadcrumbs>
        </Box>

        <Paper
          elevation={0}
          sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}
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
              <PersonIcon sx={{ fontSize: 28, mr: 2, color: "#262626" }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: "600", color: "#262626" }}
              >
                My Articles
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/news/create"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 8,
              }}
            >
              Create New
            </Button>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              px: 3,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                minWidth: 100,
              },
            }}
          >
            <Tab label="Published" />
            <Tab label="Drafts" />
          </Tabs>

          <Box sx={{ p: 0 }}>
            {activeTab === 0
              ? renderArticlesList(articles)
              : renderArticlesList(drafts)}
          </Box>
        </Paper>

        {/* Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle>Delete Article?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{deletingArticle?.title}"? This
              action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              sx={{ textTransform: "none" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyArticlesPage;
