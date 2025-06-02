// src/pages/social-network/CreatePostPage.js
import React, { useState, useRef, useEffect } from "react";
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
  Card,
  CardContent,
  ImageList,
  ImageListItem,
  Autocomplete,
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
import { getAllDoctors } from "../../api/newsApi";
import { useNavigate } from "react-router-dom";
import UploadFilesService from "../../service/otherService/upload";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0); // 0: content, 1: preview
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isHidden, setIsHidden] = useState(false); // corresponds to "private" visibility
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [location, setLocation] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files);

    // Check size limit for each file (5MB)
    const oversizedFiles = files.filter((file) => file.size > 5000000);
    if (oversizedFiles.length > 0) {
      setError(`${oversizedFiles.length} image(s) exceed the 5MB size limit`);
      return;
    }

    // Check total number of images (max 10)
    if (images.length + files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    // Add new files to the existing images array
    setImages((prevImages) => [...prevImages, ...files]);

    // Generate previews for the new images
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => [...prevPreviews, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setError("");

    // Reset the file input value so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
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

  const handleTagDoctor = (event, selectedDoctor) => {
    setDoctorId(selectedDoctor ? selectedDoctor.id : null);
  };

  const handleNext = () => {
    if (!content && images.length === 0) {
      setError("Please add some content or at least one image to your post");
      return;
    }
    setError("");
    setStep(1);
  };

  const handleBack = () => {
    setStep(0);
  };

  const handleSubmit = async () => {
    if (!content && images.length === 0) {
      setError("Please add some content or at least one image to your post");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setUploadProgress(0);

    try {
      // First, upload the images if any
      let uploadedImageUrls = [];
      if (images.length > 0) {
        const uploadResponse = await UploadFilesService.upload(
          images,
          (event) => {
            setUploadProgress(Math.round((100 * event.loaded) / event.total));
          }
        );

        // Extract the image URLs from the response
        uploadedImageUrls = uploadResponse.result || [];
      }

      // Format images as required by the API
      const postImages = uploadedImageUrls.map((url) => ({
        imageUrl: url,
      }));

      // Create post with the uploaded images and tagged doctor
      await createPost({
        content,
        images: postImages,
        isHidden,
        doctorId: doctorId, // Include tagged doctor ID
      });

      // Reset form fields and navigate back to feed
      setContent("");
      setImages([]);
      setImagePreviews([]);
      setIsHidden(false);
      setTags([]);
      setDoctorId(null);
      setLocation("");
      setStep(0);

      // Navigate to the social network home/feed
      navigate("/social-network");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const renderImagePreviews = () => (
    <ImageList
      sx={{ width: "100%", maxHeight: 400 }}
      cols={images.length > 1 ? 2 : 1}
      rowHeight={200}
    >
      {imagePreviews.map((preview, index) => (
        <ImageListItem key={index} sx={{ position: "relative" }}>
          <img
            src={preview}
            alt={`Preview ${index + 1}`}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 8,
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
            onClick={() => handleRemoveImage(index)}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </ImageListItem>
      ))}
    </ImageList>
  );

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

      <CardContent>
        <Typography variant="body2">{content}</Typography>

        {imagePreviews.length > 0 && (
          <Box sx={{ mt: 2 }}>{renderImagePreviews()}</Box>
        )}

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
            icon={isHidden ? <LockIcon /> : <PublicIcon />}
            label={isHidden ? "Riêng tư" : "Công khai"}
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
              {step === 0 ? "Tạo bài viết mới" : "Xem trước bài viết"}
            </Typography>
            {step === 0 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={(!content && images.length === 0) || isSubmitting}
                sx={{
                  borderRadius: 8,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                }}
              >
                Tiếp theo
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
                  "Đăng bài"
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
                        placeholder="Bạn đang nghĩ gì?"
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

                    {imagePreviews.length > 0 ? (
                      <Box sx={{ mb: 3 }}>
                        {renderImagePreviews()}
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<AddIcon />}
                          sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                          disabled={images.length >= 10}
                        >
                          Thêm ảnh{" "}
                          {images.length > 0 ? `(${images.length}/10)` : ""}
                          <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                          />
                        </Button>
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
                          ref={fileInputRef}
                          accept="image/*"
                          type="file"
                          hidden
                          multiple
                          onChange={handleImagesChange}
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
                          Nhấn để tải ảnh lên
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Tối đa 10 ảnh, mỗi ảnh không quá 5MB
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
                    Tùy chọn bài viết
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Quyền riêng tư
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Công khai - Mọi người có thể thấy bài viết này">
                        <Chip
                          icon={<PublicIcon />}
                          label="Công khai"
                          clickable
                          color={!isHidden ? "primary" : "default"}
                          onClick={() => setIsHidden(false)}
                          variant={!isHidden ? "filled" : "outlined"}
                        />
                      </Tooltip>
                      <Tooltip title="Riêng tư - Chỉ bạn mới có thể thấy bài viết này">
                        <Chip
                          icon={<LockIcon />}
                          label="Riêng tư"
                          clickable
                          color={isHidden ? "primary" : "default"}
                          onClick={() => setIsHidden(true)}
                          variant={isHidden ? "filled" : "outlined"}
                        />
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Gắn thẻ bác sĩ
                    </Typography>
                    <Autocomplete
                      id="doctor-tag"
                      options={doctors}
                      getOptionLabel={(option) => option.name}
                      onChange={handleTagDoctor}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Tìm và gắn thẻ bác sĩ"
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              backgroundColor: theme.palette.background.default,
                            },
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={option.avatar}
                              alt={option.name}
                              sx={{ width: 32, height: 32, mr: 1.5 }}
                            />
                            <Typography variant="body2">
                              {option.name}
                            </Typography>
                          </Box>
                        </li>
                      )}
                      noOptionsText="Không tìm thấy bác sĩ"
                    />
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
                Xem trước bài viết của bạn
              </Typography>
              {renderPostPreview()}
            </Box>
          )}
        </Paper>
      </Container>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={isSubmitting}
      >
        <CircularProgress
          color="inherit"
          variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
          value={uploadProgress}
        />
        {uploadProgress > 0 && (
          <Typography variant="body2" sx={{ mt: 2, color: "white" }}>
            Đang tải ảnh lên: {uploadProgress}%
          </Typography>
        )}
      </Backdrop>
    </Box>
  );
};

export default CreatePostPage;
