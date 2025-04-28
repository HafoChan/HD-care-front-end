import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Chip,
  Paper,
  Container,
  Divider,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { getNewsByDoctorId } from "../../api/newsApi";
import { format } from "date-fns";
import { toast } from "react-toastify";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import HeaderComponent from "../../components/patient/HeaderComponent";

const DoctorArticlesPage = () => {
  const { doctorId } = useParams();
  const [articles, setArticles] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const theme = useTheme();

  useEffect(() => {
    fetchDoctorArticles();
    // In a real app, you would fetch doctor info from API
    setDoctorInfo({
      id: doctorId,
      fullName: "Dr. Example",
      specialty: "Cardiology",
      avatarUrl: "https://via.placeholder.com/150",
    });
  }, [doctorId, currentPage]);

  const fetchDoctorArticles = async () => {
    try {
      setLoading(true);
      const data = await getNewsByDoctorId(doctorId, currentPage, pageSize);
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching doctor articles:", error);
      toast.error("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      <HeaderComponent />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {doctorInfo && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 2,
              backgroundImage: `linear-gradient(to right, ${alpha(
                theme.palette.primary.main,
                0.05
              )}, ${alpha(theme.palette.primary.main, 0.1)})`,
              border: "1px solid",
              borderColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3} md={2}>
                <Avatar
                  src={doctorInfo.avatarUrl}
                  alt={doctorInfo.fullName}
                  sx={{
                    width: { xs: 100, md: 120 },
                    height: { xs: 100, md: 120 },
                    border: "4px solid white",
                    boxShadow: theme.shadows[3],
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={9} md={10}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  {doctorInfo.fullName}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Chip
                    icon={<LocalHospitalIcon />}
                    label={doctorInfo.specialty}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip
                    label="Bác sĩ"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Các bài viết y khoa được biên soạn và kiểm duyệt bởi bác sĩ
                  chuyên khoa, cung cấp thông tin đáng tin cậy và chính xác về
                  sức khỏe.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Typography
          variant="h5"
          fontWeight={600}
          sx={{
            mb: 3,
            color: "primary.main",
            display: "flex",
            alignItems: "center",
          }}
        >
          Bài viết đã được đăng
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        ) : articles.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Bác sĩ này chưa có bài viết nào được đăng.
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {articles.map((article) => (
                <Grid item xs={12} key={article.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: theme.shadows[3],
                        transform: "translateY(-5px)",
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                      }}
                    >
                      {article.coverImageUrl && (
                        <CardMedia
                          component="img"
                          sx={{
                            width: { xs: "100%", md: 250 },
                            height: { xs: 200, md: 200 },
                            objectFit: "cover",
                          }}
                          image={article.coverImageUrl}
                          alt={article.title}
                        />
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <CardContent sx={{ flex: "1 0 auto", pb: 1 }}>
                          <Typography
                            variant="h5"
                            component="h2"
                            fontWeight={600}
                            gutterBottom
                          >
                            {article.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            Danh mục:{" "}
                            <Chip
                              label={article.category}
                              size="small"
                              sx={{ ml: 0.5 }}
                            />
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <AccessTimeIcon
                              fontSize="small"
                              sx={{ mr: 0.5, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(article.createdAt)}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{ mb: 2, color: "text.secondary" }}
                          >
                            {article.content?.substring(0, 200)}
                            {article.content?.length > 200 ? "..." : ""}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "success.main",
                              }}
                            >
                              <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" fontWeight={500}>
                                {article.usefulCount || 0}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "error.main",
                              }}
                            >
                              <ThumbDownIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                              />
                              <Typography variant="body2" fontWeight={500}>
                                {article.uselessCount || 0}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>

                        <Divider />

                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            component={Link}
                            to={`/news/${article.id}`}
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            sx={{ borderRadius: 8, textTransform: "none" }}
                          >
                            Đọc tiếp
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                sx={{ borderRadius: 8 }}
              >
                Trang trước
              </Button>
              <Typography variant="body1" sx={{ alignSelf: "center" }}>
                Trang {currentPage + 1}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={articles.length < pageSize}
                sx={{ borderRadius: 8 }}
              >
                Trang sau
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default DoctorArticlesPage;
