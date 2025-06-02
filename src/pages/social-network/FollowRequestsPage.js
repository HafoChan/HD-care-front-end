// src/pages/social-network/FollowRequestsPage.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  useTheme,
  alpha,
  Breadcrumbs,
  Tooltip,
  Chip,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
  followUser,
  checkUserPrivate,
} from "../../api/socialNetworkApi";
import { ToastContainer } from "react-toastify";

const FollowRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [pendingRequests, setPendingRequests] = useState({});
  const theme = useTheme();

  const fetchRequests = async () => {
    setLoading(true);
    const data = await getAllFollowRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    // Set document title
    document.title = "Follow Requests | HD-Care Social Network";

    // Restore original title when component unmounts
    return () => {
      document.title = "HD-Care";
    };
  }, []);

  const handleAccept = async (requestId) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: "accept" }));
    try {
      await acceptFollowRequest(requestId);
      // Remove the request from the list after successful acceptance
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast.success("Đã chấp nhận yêu cầu theo dõi");
    } catch (error) {
      console.error("Error accepting follow request:", error);
      toast.error("Không thể chấp nhận yêu cầu");
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: "reject" }));
    try {
      await rejectFollowRequest(requestId);
      // Remove the request from the list after successful rejection
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      toast.info("Đã từ chối yêu cầu theo dõi");
    } catch (error) {
      console.error("Error rejecting follow request:", error);
      toast.error("Không thể từ chối yêu cầu");
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  // New function to handle following back a user
  const handleFollowBack = async (userId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: "followBack" }));

      // Check if the user has a private profile
      const isPrivate = await checkUserPrivate(userId);

      // Update UI based on the privacy setting
      if (isPrivate) {
        setPendingRequests((prev) => ({ ...prev, [userId]: true }));
        toast.info("Đã gửi yêu cầu theo dõi");
      } else {
        toast.success("Đã theo dõi người dùng");
      }

      // Call API to follow
      await followUser(userId);
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Không thể theo dõi người dùng");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  const timeSince = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "just now";
  };

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

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
            Follow Requests
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
                <PersonAddIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: "600" }}>
                Follow Requests
              </Typography>
            </Box>

            {requests.length > 0 && (
              <Chip
                label={`${requests.length} pending`}
                color="primary"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            )}
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
                Loading follow requests...
              </Typography>
            </Box>
          ) : requests.length === 0 ? (
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
              <PermIdentityIcon
                sx={{
                  fontSize: 64,
                  color: "text.disabled",
                  mb: 2,
                  opacity: 0.7,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No pending follow requests
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 400, mx: "auto" }}
              >
                When someone wants to follow you, their request will appear here
                for your approval.
              </Typography>
              <Button
                component={Link}
                to="/social-network"
                variant="contained"
                sx={{ mt: 3, textTransform: "none", fontWeight: 500, px: 3 }}
              >
                Browse Social Network
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {requests.map((req) => (
                <React.Fragment key={req.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={req.avatar}
                        component={Link}
                        to={`/social-network/profile/${req.userId}`}
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 2,
                          border: "2px solid",
                          borderColor: theme.palette.primary.main,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        {req.username ? req.username[0].toUpperCase() : "U"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          component={Link}
                          to={`/social-network/profile/${req.userId}`}
                          sx={{
                            textDecoration: "none",
                            color: "text.primary",
                            "&:hover": {
                              color: theme.palette.primary.main,
                            },
                          }}
                        >
                          {req.username}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          {req.fullName && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              {req.fullName}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            component="div"
                          >
                            {req.createdAt ? timeSince(req.createdAt) : ""}
                          </Typography>
                        </Box>
                      }
                      sx={{ mr: 2 }}
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex" }}>
                        <Tooltip title="Confirm">
                          <Box sx={{ position: "relative" }}>
                            <Button
                              variant="contained"
                              onClick={() => handleAccept(req.id)}
                              startIcon={<CheckCircleOutlineIcon />}
                              disabled={actionLoading[req.id] === "accept"}
                              sx={{
                                mr: 1.5,
                                textTransform: "none",
                                fontWeight: 500,
                                px: 2,
                                minWidth: 100,
                                boxShadow: "none",
                                "&:hover": {
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                },
                              }}
                            >
                              Confirm
                            </Button>
                            {actionLoading[req.id] === "accept" && (
                              <CircularProgress
                                size={24}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  marginTop: "-12px",
                                  marginLeft: "-12px",
                                }}
                              />
                            )}
                          </Box>
                        </Tooltip>

                        {!pendingRequests[req.userId] && (
                          <Tooltip title="Follow Back">
                            <Box sx={{ position: "relative", mr: 1.5 }}>
                              <Button
                                variant="outlined"
                                onClick={() => handleFollowBack(req.userId)}
                                startIcon={<PersonAddIcon />}
                                disabled={
                                  actionLoading[req.userId] === "followBack"
                                }
                                color="secondary"
                                sx={{
                                  textTransform: "none",
                                  fontWeight: 500,
                                  px: 2,
                                  minWidth: 110,
                                  boxShadow: "none",
                                  "&:hover": {
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                  },
                                }}
                              >
                                Follow Back
                              </Button>
                              {actionLoading[req.userId] === "followBack" && (
                                <CircularProgress
                                  size={24}
                                  sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                  }}
                                />
                              )}
                            </Box>
                          </Tooltip>
                        )}

                        {pendingRequests[req.userId] && (
                          <Chip
                            label="Request Sent"
                            color="warning"
                            size="small"
                            sx={{ mr: 1.5, height: 36 }}
                          />
                        )}

                        <Tooltip title="Delete">
                          <Box sx={{ position: "relative" }}>
                            <Button
                              variant="outlined"
                              onClick={() => handleReject(req.id)}
                              startIcon={<NotInterestedIcon />}
                              disabled={actionLoading[req.id] === "reject"}
                              sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                px: 2,
                                minWidth: 100,
                                color:
                                  theme.palette.mode === "dark"
                                    ? theme.palette.grey[300]
                                    : theme.palette.grey[700],
                                borderColor:
                                  theme.palette.mode === "dark"
                                    ? theme.palette.grey[700]
                                    : theme.palette.grey[300],
                                "&:hover": {
                                  borderColor:
                                    theme.palette.mode === "dark"
                                      ? theme.palette.grey[500]
                                      : theme.palette.grey[500],
                                  bgcolor: "transparent",
                                },
                              }}
                            >
                              Delete
                            </Button>
                            {actionLoading[req.id] === "reject" && (
                              <CircularProgress
                                size={24}
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  marginTop: "-12px",
                                  marginLeft: "-12px",
                                }}
                              />
                            )}
                          </Box>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default FollowRequestsPage;
