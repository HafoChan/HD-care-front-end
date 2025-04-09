// src/pages/social-network/FollowPage.js
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
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  IconButton,
  Breadcrumbs,
  Tooltip,
  Chip,
  Badge,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import {
  getAllFollowingUsers,
  getAllFollowers,
  followUser,
} from "../../api/socialNetworkApi";

const FollowPage = () => {
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState("followers");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const theme = useTheme();

  const fetchFollowData = async () => {
    setLoading(true);
    setFollowing(await getAllFollowingUsers());
    setFollowers(await getAllFollowers());
    setLoading(false);
  };

  useEffect(() => {
    fetchFollowData();
    // Set document title
    document.title = "Connections | HD-Care Social Network";

    // Restore original title when component unmounts
    return () => {
      document.title = "HD-Care";
    };
  }, []);

  const handleFollow = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "follow" }));
    await followUser(userId);
    setActionLoading((prev) => ({ ...prev, [userId]: null }));
    fetchFollowData();
  };

  const handleUnfollow = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [userId]: "unfollow" }));
    await followUser(userId);
    setActionLoading((prev) => ({ ...prev, [userId]: null }));
    fetchFollowData();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const isFollowing = (userId) => {
    return following.some((user) => user.id === userId);
  };

  const isMutualFollow = (userId) => {
    // User is both in followers and following lists
    return isFollowing(userId) && followers.some((user) => user.id === userId);
  };

  const renderUserList = (users) => {
    if (users.length === 0) {
      return (
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
          <PeopleAltIcon
            sx={{
              fontSize: 64,
              color: "text.disabled",
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {activeTab === "followers"
              ? "You don't have any followers yet"
              : "You aren't following anyone yet"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 400, mx: "auto" }}
          >
            {activeTab === "followers"
              ? "When people follow you, they'll appear here."
              : "When you follow people, they'll appear here."}
          </Typography>
          <Button
            component={Link}
            to="/social-network"
            variant="contained"
            sx={{ mt: 3, textTransform: "none", fontWeight: 500, px: 3 }}
            startIcon={<SearchIcon />}
          >
            Find People
          </Button>
        </Box>
      );
    }

    return (
      <List disablePadding>
        {users.map((user) => (
          <React.Fragment key={user.id}>
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
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    isMutualFollow(user.id) ? (
                      <Tooltip title="Mutual Follow">
                        <CheckCircleIcon
                          sx={{
                            fontSize: 16,
                            color: theme.palette.success.main,
                            borderRadius: "50%",
                            backgroundColor: "white",
                          }}
                        />
                      </Tooltip>
                    ) : null
                  }
                >
                  <Avatar
                    src={user.avatar}
                    component={Link}
                    to={`/social-network/profile/${user.id}`}
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
                    {user.username ? user.username[0].toUpperCase() : "U"}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    component={Link}
                    to={`/social-network/profile/${user.id}`}
                    sx={{
                      textDecoration: "none",
                      color: "text.primary",
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {user.username}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    {user.fullName && (
                      <Typography variant="body2" color="text.secondary">
                        {user.fullName}
                      </Typography>
                    )}
                    {user.bio && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          maxWidth: "90%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.bio}
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ mr: 2 }}
              />
              <ListItemSecondaryAction>
                <Box sx={{ position: "relative" }}>
                  {isFollowing(user.id) ? (
                    <Button
                      variant="outlined"
                      onClick={() => handleUnfollow(user.id)}
                      disabled={actionLoading[user.id] === "unfollow"}
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
                      Following
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleFollow(user.id)}
                      disabled={actionLoading[user.id] === "follow"}
                      sx={{
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
                      Follow
                    </Button>
                  )}
                  {actionLoading[user.id] && (
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
              </ListItemSecondaryAction>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    );
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
            Connections
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
            }}
          >
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
              <PersonIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              Connections
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.12)
                  : alpha(theme.palette.common.black, 0.08),
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab
              value="followers"
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography component="span" sx={{ mr: 1 }}>
                    Followers
                  </Typography>
                  <Chip
                    label={followers.length}
                    size="small"
                    color={activeTab === "followers" ? "primary" : "default"}
                    sx={{ height: 20, minWidth: 28, fontWeight: 600 }}
                  />
                </Box>
              }
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
                py: 1.5,
              }}
            />
            <Tab
              value="following"
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography component="span" sx={{ mr: 1 }}>
                    Following
                  </Typography>
                  <Chip
                    label={following.length}
                    size="small"
                    color={activeTab === "following" ? "primary" : "default"}
                    sx={{ height: 20, minWidth: 28, fontWeight: 600 }}
                  />
                </Box>
              }
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
                py: 1.5,
              }}
            />
          </Tabs>

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
                Loading {activeTab}...
              </Typography>
            </Box>
          ) : activeTab === "followers" ? (
            renderUserList(followers)
          ) : (
            renderUserList(following)
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default FollowPage;
