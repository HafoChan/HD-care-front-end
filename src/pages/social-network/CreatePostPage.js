// src/pages/social-network/CreatePostPage.js
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Avatar,
  IconButton,
  CircularProgress,
  Grid,
  Chip,
  Alert,
  Backdrop,
  useTheme,
  useMediaQuery,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ClearIcon from "@mui/icons-material/Clear";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import GroupIcon from "@mui/icons-material/Group";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { createPost } from "../../api/socialNetworkApi";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const [step, setStep] = useState(0); // 0: content, 1: preview
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [visibility, setVisibility] = useState("public"); // "public", "friends", "private"
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [location, setLocation] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB limit
        setError("Image size exceeds 5MB limit");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      if (tags.length >= 5) {
        setError("Maximum 5 tags allowed");
        return;
      }

      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
      setError("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleNext = () => {
    if (!content && !image) {
      setError("Please add some content or an image to your post");
      return;
    }
    setError("");
    setStep(1);
  };

  const handleBack = () => {
    setStep(0);
  };

  const handleSubmit = async () => {
    if (!content && !image) {
      setError("Please add some content or an image to your post");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // In a real app, you'd need to upload the image to a server first
    // and then pass the URL to the post creation API
    // Here we're simulating that process
    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    // Add the extra metadata
    formData.append("visibility", visibility);
    formData.append("tags", JSON.stringify(tags));
    formData.append("location", location);

    try {
      await createPost({
        content,
        imageUrl: imagePreview,
        visibility,
        tags,
        location,
      });

      // Reset form fields and navigate back to feed
      setContent("");
      setImage(null);
      setImagePreview(null);
      setVisibility("public");
      setTags([]);
      setLocation("");
      setStep(0);

      // Navigate to the social network home/feed
      navigate("/social-network");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case "public":
        return <PublicIcon fontSize="small" />;
      case "friends":
        return <GroupIcon fontSize="small" />;
      case "private":
        return <LockIcon fontSize="small" />;
      default:
        return <PublicIcon fontSize="small" />;
    }
  };

  const renderPostPreview = () => (
    <Card
      elevation={2}
      sx={{ borderRadius: 2, overflow: "hidden", maxWidth: 480, mx: "auto" }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Avatar sx={{ width: 40, height: 40, mr: 1.5 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Your Name
          </Typography>
          {location && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <LocationOnIcon sx={{ fontSize: 12, mr: 0.5 }} />
              {location}
            </Typography>
          )}
        </Box>
      </Box>

      {imagePreview && (
        <Box
          component="img"
          src={imagePreview}
          alt="Post preview"
          sx={{
            width: "100%",
            maxHeight: 500,
            objectFit: "contain",
            bgcolor: "#f0f0f0",
          }}
        />
      )}

      <CardContent>
        <Typography variant="body2">{content}</Typography>

        {tags.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <Chip
            icon={getVisibilityIcon()}
            label={visibility.charAt(0).toUpperCase() + visibility.slice(1)}
            size="small"
            color="default"
            variant="outlined"
            sx={{ borderRadius: 1, mr: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            Just now
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
        minHeight: "100vh",
        py: { xs: 2, md: 4 },
        px: { xs: 0, sm: 2 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              bgcolor: "background.paper",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {step === 1 && (
              <IconButton edge="start" onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <ImageIcon sx={{ fontSize: 24, mr: 1.5, color: "primary.main" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", color: "text.primary", flex: 1 }}
            >
              {step === 0 ? "Create New Post" : "Preview Post"}
            </Typography>
            {step === 0 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={(!content && !image) || isSubmitting}
                sx={{
                  borderRadius: 8,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 8,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Share"
                )}
              </Button>
            )}
          </Box>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ m: 2, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {step === 0 ? (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  {/* Content and image upload section */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          mt: 1,
                        }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={8}
                        variant="outlined"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.default,
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Box>

                    {imagePreview ? (
                      <Box sx={{ position: "relative", mb: 3 }}>
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="Post preview"
                          sx={{
                            width: "100%",
                            maxHeight: "400px",
                            objectFit: "contain",
                            borderRadius: 2,
                            border: "1px solid #e0e0e0",
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            "&:hover": {
                              bgcolor: "rgba(0,0,0,0.8)",
                            },
                          }}
                          onClick={handleClearImage}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "180px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "2px dashed",
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.1)",
                          borderRadius: 2,
                          mb: 3,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(0,0,0,0.01)",
                          },
                        }}
                        component="label"
                      >
                        <input
                          accept="image/*"
                          type="file"
                          hidden
                          onChange={handleImageChange}
                        />
                        <AddAPhotoIcon
                          sx={{
                            fontSize: 40,
                            color: "text.secondary",
                            mb: 1,
                          }}
                        />
                        <Typography
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Click to upload a photo
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Max file size: 5MB
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  {/* Post options section */}
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Post Options
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Visibility
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Public - Anyone can see this post">
                        <Chip
                          icon={<PublicIcon />}
                          label="Public"
                          clickable
                          color={
                            visibility === "public" ? "primary" : "default"
                          }
                          onClick={() => setVisibility("public")}
                          variant={
                            visibility === "public" ? "filled" : "outlined"
                          }
                        />
                      </Tooltip>
                      <Tooltip title="Friends only - Only your followers can see this post">
                        <Chip
                          icon={<GroupIcon />}
                          label="Friends"
                          clickable
                          color={
                            visibility === "friends" ? "primary" : "default"
                          }
                          onClick={() => setVisibility("friends")}
                          variant={
                            visibility === "friends" ? "filled" : "outlined"
                          }
                        />
                      </Tooltip>
                      <Tooltip title="Private - Only you can see this post">
                        <Chip
                          icon={<LockIcon />}
                          label="Private"
                          clickable
                          color={
                            visibility === "private" ? "primary" : "default"
                          }
                          onClick={() => setVisibility("private")}
                          variant={
                            visibility === "private" ? "filled" : "outlined"
                          }
                        />
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <LocationOnIcon color="action" sx={{ mr: 1 }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: theme.palette.background.default,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Tags
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add a tag (press Enter to add)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      InputProps={{
                        startAdornment: (
                          <LocalOfferIcon color="action" sx={{ mr: 1 }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: theme.palette.background.default,
                        },
                      }}
                    />
                    {tags.length > 0 && (
                      <Box
                        sx={{
                          mt: 1.5,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            onDelete={() => handleRemoveTag(tag)}
                            sx={{ borderRadius: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box
              sx={{
                p: { xs: 2, md: 4 },
                bgcolor: theme.palette.background.default,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}
              >
                Preview how your post will appear
              </Typography>
              {renderPostPreview()}
            </Box>
          )}
        </Paper>
      </Container>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default CreatePostPage;
