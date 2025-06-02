import React, { useState } from "react";
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
  IconButton,
  Breadcrumbs,
  Card,
  CardMedia,
  LinearProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useNavigate } from "react-router-dom";
import { createNews } from "../../api/newsApi";
import RichTextEditor from "../../components/news/RichTextEditor";
import UploadFilesService from "../../service/otherService/upload";
import UploadFiles from "../../components/patient/uploadFile";

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

const CreateNewsPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cover image states
  const [coverImagePath, setCoverImagePath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Form validation
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [categoryError, setCategoryError] = useState("");

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

  // Handle file selection for cover image
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Vui lòng chọn file ảnh");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Kích thước file không được vượt quá 5MB");
        return;
      }

      setCoverImagePath(URL.createObjectURL(file));
      setUploadError("");

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePath(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload cover image
  const handleUploadImage = async () => {
    if (!coverImagePath) return;

    setUploading(true);
    setUploadError("");

    try {
      const response = await UploadFilesService.uploadSingleImage(
        coverImagePath, // Upload 1 ảnh
        (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      );

      if (response?.result?.fileLinks && response.result.fileLinks.length > 0) {
        const uploadedUrl = response.result.fileLinks[0];
        setCoverImagePath(uploadedUrl);
        setUploading(false);
      } else {
        throw new Error("Không nhận được URL ảnh từ server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Không thể upload ảnh. Vui lòng thử lại.");
      setUploading(false);
    }
  };

  // Remove cover image
  const handleRemoveImage = () => {
    setCoverImagePath("");
    setUploadError("");
  };

  // Handle file upload from UploadFiles component
  const handleCoverImageUpload = (fileInfos) => {
    if (fileInfos && fileInfos.length > 0) {
      setCoverImagePath(fileInfos[0]);
      setUploadError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const newsData = {
        title,
        content,
        category,
        isDraft,
        coverImageUrl: coverImagePath || "",
      };

      const createdNews = await createNews(newsData);

      setSuccess(true);
      setLoading(false);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        if (isDraft) {
          navigate("/news/my-articles");
        } else {
          navigate(`/news/${createdNews.id}`);
        }
      }, 1500);
    } catch (error) {
      console.error("Error creating news:", error);
      setError("Failed to create the article. Please try again.");
      setLoading(false);
    }
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
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <NewspaperIcon sx={{ fontSize: 28, mr: 2, color: "#262626" }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: "600", color: "#262626" }}
            >
              Create New Article
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
                Article successfully created!
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
                disabled={loading}
              />

              {/* Cover Image Upload Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Ảnh bìa
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <UploadFiles
                    askUrl={handleCoverImageUpload}
                    coverImageUpload={true}
                  />
                  {uploadError && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {uploadError}
                    </Typography>
                  )}
                </Box>
              </Box>

              <FormControl
                fullWidth
                sx={{ mb: 3 }}
                error={!!categoryError}
                disabled={loading || isDraft}
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
                      disabled={loading}
                    />
                  }
                  label="Save as draft"
                />

                <Box>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/news"
                    sx={{
                      mr: 2,
                      textTransform: "none",
                      borderRadius: 8,
                      px: 3,
                    }}
                    disabled={loading}
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
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : isDraft ? (
                      "Save Draft"
                    ) : (
                      "Publish Article"
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

export default CreateNewsPage;
