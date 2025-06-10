import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
  Paper,
  Button,
  Tooltip,
  Dialog,
  TextField,
  Snackbar,
  Alert,
  Popover,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { doctor } from "../../api/doctor";
import HeaderComponent from "../../components/patient/HeaderComponent";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import {
  getName,
  getUsername,
  getRole,
} from "../../service/otherService/localStorage";
import { ZIM } from "zego-zim-web";
import { AppID } from "../../utils";
import { generateToken as generateZimToken } from "../../service/patientService/ZimSerivce";

function VideoCall() {
  const theme = useTheme();
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const videoContainerRef = useRef(null);
  const zegoInstanceRef = useRef(null);
  const zimRef = useRef(null);

  // Chat popover state
  const [chatAnchorEl, setChatAnchorEl] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [roomUrl, setRoomUrl] = useState("");

  const handleChatClick = (event) => {
    setChatAnchorEl(event.currentTarget);

    // Generate room URL if not already set
    if (!roomUrl) {
      const params = getUrlParams(window.location.href);
      const roomID = params["roomID"] || `room_${doctorId}`;
      const generatedUrl =
        window.location.origin + window.location.pathname + "?roomID=" + roomID;
      setRoomUrl(generatedUrl);

      // Tạo tin nhắn với HTML được escape - sử dụng entity để tăng khả năng hiển thị
      const clickableLink = `&lt;a href="${generatedUrl}" target="_blank"&gt;${generatedUrl}&lt;/a&gt;`;
      setChatMessage(
        `Xin chào bác sĩ, vui lòng tham gia phòng khám trực tuyến của tôi.\n\nNhấp vào đường dẫn: ${clickableLink}\n\nHoặc copy đường dẫn này: ${generatedUrl}`
      );
    }

    // Initialize ZIM for chat if needed
    if (zimRef.current) {
      // Nếu ZIM đã được khởi tạo, thử đăng nhập lại nếu cần
      loginToZIM().catch((err) => {
        console.error("Error logging in to ZIM:", err);
      });
    } else {
      // Nếu chưa có instance ZIM, khởi tạo mới
      initZIMChat();
    }
  };

  const handleChatClose = () => {
    setChatAnchorEl(null);
  };

  const chatOpen = Boolean(chatAnchorEl);

  // Initialize ZIM for chat
  const initZIMChat = async () => {
    if (zimRef.current) return; // Already initialized

    try {
      // Import login logic từ Chat.js
      console.log("Initializing ZIM with AppID:", AppID);
      ZIM.create({ appID: AppID });
      const zim = ZIM.getInstance();
      zimRef.current = zim;

      // Set up event listeners từ Chat.js
      zim.on("error", (zim, errorInfo) => {
        console.error("ZIM error:", errorInfo.code, errorInfo.message);
        showSnackbar(
          `Lỗi chat: ${errorInfo.code} - ${errorInfo.message}`,
          "error"
        );
      });

      // Thêm event listeners từ Chat.js
      zim.on("connectionStateChanged", (zim, { state, event }) => {
        console.log("Connection state changed:", state, event);
        if (state === 0) {
          showSnackbar("Mất kết nối chat", "warning");
          // Try to reconnect if disconnected due to network issues
          if (event === 3) {
            console.log("Trying to reconnect...");
            setTimeout(() => loginToZIM(), 3000);
          }
        } else if (state === 1) {
          showSnackbar("Đã kết nối đến dịch vụ chat", "success");
        }
      });

      zim.on(
        "peerMessageReceived",
        (zim, { messageList, fromConversationID }) => {
          console.log(
            "Message received from:",
            fromConversationID,
            messageList
          );
          if (messageList?.length > 0) {
            showSnackbar(
              `Nhận tin nhắn từ ${fromConversationID}: ${messageList[0].message.substring(
                0,
                30
              )}...`,
              "info"
            );
          }
        }
      );

      // Login với logic từ Chat.js sử dụng token ZIM đúng
      await loginToZIM();
    } catch (error) {
      console.error("Error initializing ZIM for chat:", error);
      showSnackbar("Không thể kết nối dịch vụ chat: " + error.message, "error");
    }
  };

  // Login function như trong Chat.js
  const loginToZIM = async () => {
    if (!zimRef.current) {
      showSnackbar("ZIM chưa được khởi tạo", "error");
      return;
    }

    try {
      const userID = getUsername();
      if (!userID) {
        showSnackbar("Không tìm thấy thông tin người dùng", "error");
        throw new Error("User ID is null or empty");
      }

      const userName = userID; // Use same value for both to keep it simple

      // Sử dụng đúng token generator cho chat từ ZimService
      let token;
      try {
        token = generateZimToken(userID);
        console.log("Generated ZIM token from service for chat:", token);
      } catch (tokenError) {
        console.error("Error generating ZIM token with service:", tokenError);

        // Create a fallback token
        token = createFallbackZimToken(userID);
        console.log("Generated fallback ZIM token for chat");
      }

      const userInfo = { userID, userName };
      console.log("Logging in to ZIM with:", userInfo);

      // Attempt login with retry
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          await zimRef.current.login(userInfo, token);
          console.log("Logged in successfully to ZIM chat");
          showSnackbar("Đã đăng nhập vào hệ thống chat", "success");
          break; // Exit loop on success
        } catch (loginError) {
          console.error(`Login attempt ${retryCount + 1} failed:`, loginError);

          if (retryCount === maxRetries) {
            throw loginError; // Re-throw after max retries
          }

          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, 2000));
          retryCount++;
        }
      }
    } catch (error) {
      console.error("Login failed after retries:", error);
      showSnackbar(`Đăng nhập thất bại: ${error.message}`, "error");
      throw error;
    }
  };

  // Create fallback token đặc biệt cho ZIM chat
  const createFallbackZimToken = (userID) => {
    // This is a simplified version based on Chat.js
    const timestamp = Math.floor(Date.now() / 1000);
    const expireTime = timestamp + 3600; // 1 hour expiration

    // Create a basic payload with required fields for ZIM
    const payload = {
      app_id: AppID,
      user_id: userID,
      expire_time: expireTime,
      nonce: Math.random().toString(36).substring(2, 15),
    };

    // For testing, return a base64 representation (not secure for production)
    return btoa(JSON.stringify(payload));
  };

  // Send chat message khi người dùng click "Gửi lời mời"
  const sendChatMessage = async () => {
    if (!zimRef?.current) {
      showSnackbar(
        "Không thể gửi tin nhắn: Thiếu nội dung hoặc chưa kết nối",
        "error"
      );
      return;
    }

    if (!doctorInfo) {
      showSnackbar("Không thể tìm thấy thông tin bác sĩ", "error");
      return;
    }

    setIsSending(true);

    try {
      // Lấy ID người nhận từ doctorInfo
      let toConversationID = doctorInfo.userName;

      // Nếu không có userName, thử dùng các trường khác
      if (!toConversationID) {
        console.warn("doctorInfo.userName is missing, trying alternatives");
        toConversationID = doctorInfo.username || doctorInfo.userId || doctorId;
        console.log("Using alternative recipient ID:", toConversationID);
      }

      if (!toConversationID) {
        throw new Error("Không tìm thấy ID của bác sĩ");
      }

      // Đơn giản hóa tin nhắn - KHÔNG sử dụng HTML entities
      const messageToSend = `Xin chào bác sĩ, vui lòng tham gia phòng khám trực tuyến của tôi.\n\nPhòng khám: ${roomUrl}\n\nKhi nhận được tin nhắn này, bạn có thể nhấp vào nút "Tham gia phòng khám" bên dưới.`;

      // Quan trọng: Cấu hình extendedData đúng với format mà Chat.js đang sử dụng
      const extendedDataObj = {
        type: "video_invitation", // Chuẩn hóa type để Chat.js nhận diện
        roomUrl: roomUrl, // URL phòng khám - quan trọng để nút hoạt động
        doctorName: doctorInfo?.name || "Bác sĩ",
        patientName: getName() || "Bệnh nhân",
        timestamp: Date.now(),
      };

      // Chuyển đối tượng thành chuỗi JSON
      const extendedData = JSON.stringify(extendedDataObj);

      console.log(
        "Creating video invitation with extendedData:",
        extendedDataObj
      );

      // Tạo object tin nhắn
      const messageTextObj = {
        type: 1, // Text message
        message: messageToSend,
        extendedData: extendedData, // Quan trọng: đảm bảo extendedData được gán đúng
      };

      // Send message với notification
      const conversationType = 0; // One-to-one chat
      const config = { priority: 1 };
      const notification = {
        onMessageAttached: (message) => {
          console.log("Message attached:", message);
        },
      };

      console.log(
        "Sending video invitation to doctor with message object:",
        messageTextObj
      );

      const { message } = await zimRef.current.sendMessage(
        messageTextObj,
        toConversationID,
        conversationType,
        config,
        notification
      );

      console.log("Video invitation sent successfully:", message);

      showSnackbar("Đã gửi lời mời tham gia video call cho bác sĩ", "success");
      setChatMessage("");
      handleChatClose();
    } catch (error) {
      console.error("Error sending video invitation:", error);

      // Try to reconnect if not logged in
      if (error.code === 6000121) {
        // "Not logged with call"
        showSnackbar("Kết nối bị mất. Đang thử kết nối lại...", "warning");

        try {
          // Try to re-login với ZIM token đúng
          if (zimRef.current) {
            await loginToZIM();
            showSnackbar(
              "Kết nối lại thành công. Vui lòng thử gửi lại.",
              "success"
            );
          }
        } catch (loginError) {
          console.error("Failed to reconnect:", loginError);
          showSnackbar("Không thể kết nối lại. Vui lòng thử lại sau.", "error");
        }
      } else {
        showSnackbar(`Không thể gửi lời mời: ${error.message}`, "error");
      }
    } finally {
      setIsSending(false);
    }
  };

  // Show snackbar message
  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Copy room URL to clipboard
  const copyRoomUrl = () => {
    navigator.clipboard
      .writeText(roomUrl)
      .then(() => {
        showSnackbar("Đã sao chép đường dẫn vào clipboard", "success");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        showSnackbar("Không thể sao chép đường dẫn", "error");
      });
  };

  // Generate random ID for room and user
  const randomID = (len) => {
    let result = "";
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  };

  // Đổi tên hàm video token để tránh nhầm lẫn
  const generateVideoToken = async (tokenServerUrl, userID) => {
    try {
      const response = await fetch(
        `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
        {
          method: "GET",
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error generating video token:", error);
      return { token: "" };
    }
  };

  // Get URL parameters
  const getUrlParams = (url) => {
    try {
      let urlStr = url.split("?")[1];
      const urlSearchParams = new URLSearchParams(urlStr);
      const result = Object.fromEntries(urlSearchParams.entries());
      return result;
    } catch (error) {
      console.error("Error parsing URL parameters:", error);
      return {};
    }
  };

  // Initialize Zego UI Kit
  const initZegoUI = async () => {
    try {
      // Get roomID from URL or generate a new one
      const params = getUrlParams(window.location.href);
      let roomID = params["roomID"];

      // Nếu không có roomID trong URL, tạo một roomID có cấu trúc
      if (!roomID) {
        const patientUsername = getUsername();
        // Tạo roomID bao gồm cả ID bác sĩ và ID bệnh nhân để dễ nhận diện
        roomID = `room_${doctorId}_${patientUsername}_${Date.now()
          .toString()
          .substring(9)}`;

        // Cập nhật URL để lưu trữ roomID mới
        const newUrl = window.location.pathname + "?roomID=" + roomID;
        window.history.pushState({}, "", newUrl);
        console.log("Created new room ID:", roomID);
      } else {
        console.log("Using existing room ID from URL:", roomID);
      }

      // Kiểm tra xem roomID có chứa ID của bác sĩ không
      if (roomID && !roomID.includes(doctorId)) {
        console.error("Invalid room ID: Doctor ID mismatch");
        setLoading(false);
        navigate(`/doctor/${doctorId}`); // Chuyển về trang chi tiết bác sĩ
        return;
      }

      // Lấy userID từ localStorage thay vì tạo ngẫu nhiên
      const userID = getUsername();
      if (!userID) {
        console.error("Cannot get username from localStorage");
        showSnackbar(
          "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.",
          "error"
        );
        setLoading(false);
        navigate(`/doctor/${doctorId}`);
        return;
      }

      // Sử dụng tên thật từ localStorage
      const userName = getName() || userID;
      console.log(
        "Joining video call with userID:",
        userID,
        "userName:",
        userName
      );

      // Sử dụng đúng hàm token cho video call
      const { token } = await generateVideoToken(
        "https://nextjs-token.vercel.app/api",
        userID
      );

      const KitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        1484647939, // Replace with your app ID
        token,
        roomID || `room_${doctorId}`,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(KitToken);
      zegoInstanceRef.current = zp;

      if (videoContainerRef.current) {
        // Create shared links with đường dẫn đầy đủ
        const currentRoomUrl =
          window.location.origin +
          window.location.pathname +
          "?roomID=" +
          roomID;

        let sharedLinks = [
          {
            name: "Liên kết phòng khám",
            url: currentRoomUrl,
          },
        ];

        // Save room URL for chat sharing
        setRoomUrl(currentRoomUrl);

        // Join room with camera and microphone off by default
        zp.joinRoom({
          container: videoContainerRef.current,
          maxUsers: 2,
          branding: {
            logoURL:
              "https://www.zegocloud.com/_nuxt/img/zegocloud_logo_white.ddbab9f.png",
          },
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: false,
          sharedLinks,
          // Start with camera and microphone off
          turnCameraOn: false,
          turnMicrophoneOn: false,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error initializing Zego UI:", error);
      setLoading(false);
      navigate(`/doctor/${doctorId}`); // Chuyển về trang chi tiết bác sĩ nếu có lỗi
    }
  };

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        setLoading(true);
        const response = await doctor.getDoctorById(doctorId);
        if (response?.result) {
          setDoctorInfo(response.result);
        }

        // Initialize Zego UI after fetching doctor info
        await initZegoUI();
      } catch (error) {
        console.error("Error fetching doctor info:", error);
        setLoading(false);
      }
    };

    fetchDoctorInfo();

    // Cleanup function
    return () => {
      // Cleanup video call
      if (zegoInstanceRef.current) {
        try {
          console.log("Cleaning up Zego video instance");
          zegoInstanceRef.current.destroy();
        } catch (e) {
          console.error("Error during video cleanup:", e);
        }
      }

      // Cleanup chat
      if (zimRef.current) {
        try {
          console.log("Cleaning up ZIM chat instance");
          zimRef.current.logout();
        } catch (e) {
          console.error("Error during ZIM logout:", e);
        }
      }
    };
  }, [doctorId]);

  const handleGoBack = async () => {
    try {
      // Cleanup video call if it exists
      if (zegoInstanceRef.current) {
        console.log("Cleaning up video call before navigation");
        await zegoInstanceRef.current.destroy();
        zegoInstanceRef.current = null;
      }

      // Cleanup chat if it exists
      if (zimRef.current) {
        console.log("Cleaning up chat before navigation");
        await zimRef.current.logout();
        zimRef.current = null;
      }

      // Navigate based on role
      const role = getRole();
      if (role === "DOCTOR") {
        navigate("/doctor_chat");
      } else {
        navigate(`/doctor/${doctorId}`);
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
      // Still navigate even if cleanup fails
      const role = getRole();
      if (role === "DOCTOR") {
        navigate("/doctor_chat");
      } else {
        navigate(`/doctor/${doctorId}`);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <HeaderComponent />

      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          position: "relative",
        }}
      >
        {/* Back button */}
        <IconButton
          onClick={handleGoBack}
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            "&:hover": {
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Main content */}
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 1200,
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          {/* Video call header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={doctorInfo?.img}
                alt={doctorInfo?.name}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {doctorInfo?.name || "Doctor"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {doctorInfo?.specialization?.split("\\")[0] || "Specialist"}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                backgroundColor: alpha(theme.palette.primary.contrastText, 0.2),
                px: 2,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              {loading ? "Connecting..." : "Connected"}
            </Typography>
          </Box>

          {/* Video call content */}
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 500,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Connecting to video call...
                </Typography>
              </Box>
            ) : (
              <Box
                ref={videoContainerRef}
                id="video-container"
                sx={{
                  width: "100%",
                  height: 500,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              />
            )}
          </Box>

          {/* Camera and microphone controls */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            {/* Chat button */}
            <Tooltip title="Gửi lời mời tham gia">
              <IconButton
                onClick={handleChatClick}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                  width: 48,
                  height: 48,
                }}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Box>

      {/* Chat Popover */}
      <Popover
        open={chatOpen}
        anchorEl={chatAnchorEl}
        onClose={handleChatClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            width: 350,
            p: 2,
            maxHeight: 400,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Gửi lời mời đến bác sĩ {doctorInfo?.name}
          </Typography>

          <Box sx={{ mb: 2, mt: 2 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "primary.50",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ mr: 1, flex: 1, wordBreak: "break-all" }}
              >
                {roomUrl}
              </Typography>
              <IconButton
                size="small"
                onClick={copyRoomUrl}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              onClick={sendChatMessage}
            >
              {isSending ? "Đang gửi..." : "Gửi lời mời"}
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default VideoCall;
