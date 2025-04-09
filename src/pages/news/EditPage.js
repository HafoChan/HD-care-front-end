import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Breadcrumbs,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getNewsById, updateNews } from "../../api/newsApi";
import RichTextEditor from "../../components/news/RichTextEditor";

const CATEGORIES = [
  "General Health",
  "Nutrition",
  "Mental Health",
  "Exercise",
  "Disease Prevention",
  "Healthcare Technology",
  "Medical Research",
  "Child Health",
  "Women's Health",
  "Men's Health",
  "Senior Health",
];

const EditNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newsData, setNewsData] = useState(null);

  // Form validation
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    const fetchNewsForEdit = async () => {
      setLoading(true);
      try {
        const data = await getNewsById(id);
        setNewsData(data);
        setTitle(data.title || "");
        setContent(data.content || "");
        setCategory(data.category || "");
        setIsDraft(data.isDraft || false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news for edit:", error);
        setError(
          "Failed to load the article. You may not have permission to edit it."
        );
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsForEdit();
    }
  }, [id]);

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (title.length < 5) {
      setTitleError("Title must be at least 5 characters");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!content.trim()) {
      setContentError("Content is required");
      isValid = false;
    } else if (content.length < 50) {
      setContentError("Content must be at least 50 characters");
      isValid = false;
    } else {
      setContentError("");
    }

    if (!category && !isDraft) {
      setCategoryError("Please select a category for publishing");
      isValid = false;
    } else {
      setCategoryError("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updateData = {
        title,
        content,
        category,
        isDraft,
      };

      const updatedNews = await updateNews(id, updateData);

      setSuccess(true);
      setSaving(false);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        if (isDraft) {
          navigate("/news/my-articles");
        } else {
          navigate(`/news/${id}`);
        }
      }, 1500);
    } catch (error) {
      console.error("Error updating news:", error);
      setError("Failed to update the article. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={40} sx={{ color: "#262626" }} />
      </Box>
    );
  }

  if (error && !newsData) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/news/my-articles"
          sx={{ mt: 2 }}
        >
          Return to My Articles
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              to="/news/my-articles"
              style={{
                textDecoration: "none",
                color: "#757575",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
              Back to My Articles
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
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <EditIcon sx={{ fontSize: 28, mr: 2, color: "#262626" }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: "600", color: "#262626" }}
            >
              Edit Article
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Article successfully updated!
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!titleError}
                helperText={titleError}
                sx={{ mb: 3 }}
                placeholder="Enter a descriptive title for your article"
                disabled={saving}
              />

              <FormControl
                fullWidth
                sx={{ mb: 3 }}
                error={!!categoryError}
                disabled={saving || isDraft}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {categoryError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {categoryError}
                  </Typography>
                )}
              </FormControl>

              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Content
              </Typography>
              <RichTextEditor
                value={content}
                onChange={setContent}
                error={contentError}
              />

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDraft}
                      onChange={(e) => setIsDraft(e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Save as draft"
                />

                <Box>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/news/my-articles"
                    sx={{
                      mr: 2,
                      textTransform: "none",
                      borderRadius: 8,
                      px: 3,
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isDraft ? <SaveIcon /> : <SendIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 8,
                      px: 3,
                    }}
                    disabled={saving}
                  >
                    {saving ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : isDraft ? (
                      "Save Draft"
                    ) : (
                      "Update Article"
                    )}
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditNewsPage;
