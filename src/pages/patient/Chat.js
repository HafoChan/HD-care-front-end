import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Box, Typography, IconButton, TextField, Button, Avatar, 
  Paper, CircularProgress, Snackbar, Alert, Fab, Zoom,
  InputAdornment, Badge, Divider, Tooltip, Chip, useTheme, alpha 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VideocamIcon from '@mui/icons-material/Videocam';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ZIM } from 'zego-zim-web';
import { AppID, ServerSecret } from "../../utils";
import { generateToken } from "../../service/patientService/ZimSerivce";
import { getUsername, getRole, getName } from '../../service/otherService/localStorage';
import { doctor } from '../../api/doctor';
import HeaderComponent from "../../components/patient/HeaderComponent";

// Styled components for modern chat
const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 64px)',
  backgroundColor: theme.palette.background.default,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(10px)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  gap: theme.spacing(2),
  position: 'sticky',
  top: 0,
  zIndex: 10
}));

const MessageBubble = styled(Paper)(({ theme, isSelf }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: isSelf ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  maxWidth: '75%',
  marginBottom: theme.spacing(1),
  backgroundColor: isSelf ? theme.palette.primary.main : alpha(theme.palette.background.paper, 0.9),
  color: isSelf ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isSelf ? 'flex-end' : 'flex-start',
  boxShadow: isSelf 
    ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}` 
    : '0 1px 3px rgba(0,0,0,0.08)',
  wordBreak: 'break-word',
  animation: 'fadeIn 0.3s ease-out',
  '&:hover': {
    boxShadow: isSelf 
      ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}` 
      : '0 3px 8px rgba(0,0,0,0.1)',
  },
  transition: 'box-shadow 0.2s ease-in-out',
  position: 'relative',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  }
}));

const MessageTime = styled(Typography)(({ theme, isSelf }) => ({
  fontSize: '0.7rem',
  opacity: 0.7,
  marginTop: 4,
  textAlign: isSelf ? 'right' : 'left',
  color: isSelf ? alpha(theme.palette.primary.contrastText, 0.85) : theme.palette.text.secondary
}));

const StyledAvatar = styled(Avatar)(({ theme, status }) => ({
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'relative',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const StatusIndicator = styled(FiberManualRecordIcon)(({ theme, online }) => ({
  position: 'absolute',
  bottom: -2,
  right: -2,
  fontSize: 14,
  color: online ? theme.palette.success.main : theme.palette.grey[400],
  backgroundColor: theme.palette.background.paper,
  borderRadius: '50%',
  padding: 2,
  boxSizing: 'content-box'
}));

const JoinVideoButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1, 2),
  borderRadius: 12,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
    boxShadow: `0 6px 16px ${alpha(theme.palette.success.main, 0.4)}`,
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.2s ease-in-out'
}));

const SpecialMessageContainer = styled(Paper)(({ theme, isSelf }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 18,
  maxWidth: '85%',
  marginBottom: theme.spacing(2),
  backgroundColor: isSelf 
    ? alpha(theme.palette.secondary.light, 0.9)
    : alpha(theme.palette.info.light, 0.9),
  color: isSelf 
    ? theme.palette.secondary.contrastText 
    : theme.palette.info.contrastText,
  alignSelf: isSelf ? 'flex-end' : 'flex-start',
  boxShadow: `0 4px 16px ${alpha(isSelf ? theme.palette.secondary.main : theme.palette.info.main, 0.2)}`,
  wordBreak: 'break-word',
  position: 'relative',
  animation: 'scaleIn 0.3s ease-out',
  display: 'flex',
  flexDirection: 'column',
  '@keyframes scaleIn': {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' }
  }
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  position: 'sticky',
  bottom: 0,
  zIndex: 10
}));

const DateDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(3, 0),
  textAlign: 'center',
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
  },
  '&::before': {
    marginRight: theme.spacing(2)
  },
  '&::after': {
    marginLeft: theme.spacing(2)
  }
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: `radial-gradient(circle at center, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 70%)`,
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: 3,
  },
}));

// Function to generate a token manually if the imported function doesn't work
const createToken = (userID) => {
  // This is a simplified version - in production, use a proper JWT library
  const timestamp = Math.floor(Date.now() / 1000);
  const expireTime = timestamp + 3600; // 1 hour expiration
  
  // Create a basic payload with required fields
  const payload = {
    app_id: AppID,
    user_id: userID,
    expire_time: expireTime,
    nonce: Math.random().toString(36).substring(2, 15)
  };
  
  // For testing, return a base64 representation (not secure for production)
  return btoa(JSON.stringify(payload));
};

function Chat() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [patientUsername, setPatientUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const zimRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  
  // Refs for message pagination
  const hasMoreMessages = useRef(true);
  const isLoadingMore = useRef(false);
  const nextMessageRef = useRef(null);
  
  // Add function to save messages to localStorage
  const saveMessagesToLocalStorage = (msgs) => {
    try {
      const key = `chat_messages_${getUsername()}`; // Use username as part of the key
      const currentMessages = JSON.parse(localStorage.getItem(key) || '{}');
      currentMessages[conversationId] = msgs;
      localStorage.setItem(key, JSON.stringify(currentMessages));
      console.log("Messages saved to localStorage for user:", getUsername());
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
  };

  // Add function to load messages from localStorage
  const loadMessagesFromLocalStorage = () => {
    try {
      const key = `chat_messages_${getUsername()}`;
      const savedMessages = localStorage.getItem(key);
      if (savedMessages) {
        const allMessages = JSON.parse(savedMessages);
        const conversationMessages = allMessages[conversationId] || [];
        // Convert string timestamps back to Date objects
        const messagesWithDates = conversationMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        console.log("Loaded messages from localStorage:", messagesWithDates.length);
        return messagesWithDates;
      }
    } catch (error) {
      console.error("Error loading messages from localStorage:", error);
    }
    return [];
  };

  // Add function to clear all chat history for the current user
  const clearAllChatHistory = () => {
    try {
      const key = `chat_messages_${getUsername()}`;
      localStorage.removeItem(key);
      console.log("Cleared all chat history for user:", getUsername());
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  // Add function to handle logout
  const handleLogout = () => {
    clearAllChatHistory();
    // Add your logout logic here
  };

  // Update useEffect to load messages from localStorage when component mounts
  useEffect(() => {
    if (conversationId) {
      const savedMessages = loadMessagesFromLocalStorage();
      if (savedMessages.length > 0) {
        console.log("Setting messages from localStorage");
        setMessages(savedMessages);
      }
    }
  }, [conversationId]);

  // Update loadMoreMessages to save messages to localStorage
  const loadMoreMessages = useCallback(async () => {
    if (!zimRef.current || !conversationId || isLoadingMore.current || !hasMoreMessages.current) {
      return;
    }
    
    isLoadingMore.current = true;
    console.log("Loading more historical messages...");
    
    try {
      // Make sure we have a valid nextMessage reference
      if (!nextMessageRef.current) {
        console.log("No next message reference available, cannot load more");
        hasMoreMessages.current = false;
        return;
      }
      
      // API signature: zim.queryHistoryMessage(params)
      const result = await zimRef.current.queryHistoryMessage({
        conversationID: conversationId,
        conversationType: 0, // One-to-one chat
        count: 30,
        reverse: true,
        nextMessage: nextMessageRef.current
      });
      
      console.log("Additional messages result:", result);
      
      if (result.messageList && result.messageList.length > 0) {
        // Format the messages
        const formattedMessages = result.messageList.map(msg => ({
          id: msg.messageID,
          content: msg.message,
          sender: msg.senderUserID,
          timestamp: new Date(msg.timestamp),
          isSelf: msg.senderUserID === getUsername(),
          extendedData: msg.extendedData,
          hasVideoCall: !msg.extendedData && 
                       msg.message && 
                       msg.message.includes('tham gia phòng khám') && 
                       msg.message.includes('http')
        }));
        
        // Update the nextMessage for future pagination
        if (result.messageList.length > 0) {
          nextMessageRef.current = result.messageList[0];
        }
        
        // If we got fewer messages than requested, we've reached the end
        if (result.messageList.length < 30) {
          hasMoreMessages.current = false;
        }
        
        // Add messages to the beginning of the list (they're older)
        setMessages(prev => {
          const newMessages = [...formattedMessages.reverse(), ...prev];
          saveMessagesToLocalStorage(newMessages);
          return newMessages;
        });
      } else {
        // No more messages to load
        hasMoreMessages.current = false;
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
      setError("Không thể tải thêm tin nhắn cũ hơn");
      setShowError(true);
      hasMoreMessages.current = false;
    } finally {
      isLoadingMore.current = false;
    }
  }, [conversationId]);

  // Helper function to check if a date is valid
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Helper function to render message time safely
  const renderMessageTime = (timestamp) => {
    try {
      if (!isValidDate(timestamp)) {
        return "Thời gian không xác định";
      }
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error("Error rendering message time:", e);
      return "Thời gian không xác định";
    }
  };

  // Group messages by date with safer handling
  const groupMessagesByDate = () => {
    const grouped = {};
    
    messages.forEach(message => {
      try {
        // Make sure timestamp is a valid date object
        let timestamp = message.timestamp;
        let dateKey;
        
        if (!isValidDate(timestamp)) {
          console.log("Invalid timestamp detected, using current date:", timestamp);
          timestamp = new Date(); // Fallback to current date
        }
        
        // Get date string in a consistent format (YYYY-MM-DD)
        dateKey = timestamp.toISOString().split('T')[0];
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        
        grouped[dateKey].push({
          ...message,
          timestamp // Ensure the timestamp is valid
        });
      } catch (e) {
        console.error("Error grouping message by date:", e, message);
        // Use a fallback group for messages with invalid dates
        const fallbackDateKey = "invalid-date";
        if (!grouped[fallbackDateKey]) {
          grouped[fallbackDateKey] = [];
        }
        grouped[fallbackDateKey].push({
          ...message,
          timestamp: new Date() // Fallback timestamp
        });
      }
    });
    
    return grouped;
  };

  // Format date for dividers
  const formatDateDivider = (dateKey) => {
    try {
      // Handle special fallback case
      if (dateKey === "invalid-date") {
        return "Ngày không xác định";
      }
      
      const messageDate = new Date(dateKey);
      
      // Check if date is valid
      if (!isValidDate(messageDate)) {
        console.log("Invalid date detected:", dateKey);
        return "Ngày không xác định";
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Reset hours for comparison (compare only date part)
      today.setHours(0, 0, 0, 0);
      yesterday.setHours(0, 0, 0, 0);
      const comparableMessageDate = new Date(messageDate);
      comparableMessageDate.setHours(0, 0, 0, 0);
      
      if (comparableMessageDate.getTime() === today.getTime()) {
        return 'Hôm nay';
      } else if (comparableMessageDate.getTime() === yesterday.getTime()) {
        return 'Hôm qua';
      } else {
        // Use a safer date formatting method
        try {
          return messageDate.toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } catch (e) {
          console.error("Error formatting date:", e);
          // Fallback formatting
          return `${messageDate.getDate()}/${messageDate.getMonth() + 1}/${messageDate.getFullYear()}`;
        }
      }
    } catch (e) {
      console.error("Error processing date:", e, dateKey);
      return "Ngày không xác định";
    }
  };

  // Process grouped messages
  const groupedMessages = groupMessagesByDate();

  // Render loading indicator at the top of the messages when loading more
  const renderLoadMoreIndicator = () => {
    if (isLoadingMore.current && hasMoreMessages.current) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 2, 
          opacity: 0.7 
        }}>
          <CircularProgress size={24} thickness={4} />
        </Box>
      );
    }
    return null;
  };

  // Function to render message content with special handling for video_invitation
  const renderMessage = (message) => {
    try {
      // Check for valid timestamp
      const timestamp = isValidDate(message.timestamp) 
        ? message.timestamp 
        : new Date(); // Use current date as fallback
      
      // Kiểm tra xem tin nhắn có extendedData không
      if (message.extendedData) {
        console.log("Message with extendedData:", message);
        console.log("ExtendedData type:", typeof message.extendedData);
        console.log("ExtendedData raw value:", message.extendedData);
        
        let extendedData = null;
        
        // Xử lý extendedData dựa trên kiểu dữ liệu
        try {
          // Nếu là chuỗi và có chứa 'video_invitation', thử phân tích
          if (typeof message.extendedData === 'string') {
            if (message.extendedData.includes('video_invitation')) {
              extendedData = JSON.parse(message.extendedData);
              console.log("Parsed extendedData:", extendedData);
            } else if (message.content.includes('tham gia phòng khám') && message.content.includes('http')) {
              // Fallback: Nếu nội dung tin nhắn chứa URL và text về phòng khám
              // Extract URL from message content
              const urlMatch = message.content.match(/(https?:\/\/[^\s]+)/);
              if (urlMatch) {
                const roomUrl = urlMatch[0];
                extendedData = {
                  type: 'video_invitation',
                  roomUrl: roomUrl,
                  timestamp: timestamp.getTime()
                };
                console.log("Created fallback extendedData from message content:", extendedData);
              }
            }
          } else if (typeof message.extendedData === 'object') {
            // Nếu đã là object, sử dụng trực tiếp
            extendedData = message.extendedData;
            console.log("Using extendedData as object:", extendedData);
          }
        } catch (e) {
          console.error("Error processing extendedData:", e, "Raw value:", message.extendedData);
        }
        
        // Nếu là lời mời tham gia video
        if (extendedData && extendedData.type === 'video_invitation') {
          return (
            <SpecialMessageContainer isSelf={message.isSelf}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5,
                gap: 1
              }}>
                <Avatar sx={{ 
                  bgcolor: 'success.main',
                  width: 36,
                  height: 36
                }}>
                  <VideocamIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Lời mời tham gia phòng khám
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Từ: {message.isSelf ? 'Bạn' : (extendedData.patientName || message.sender)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ 
                my: 1.5, 
                opacity: 0.1 
              }} />
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'medium', 
                  lineHeight: 1.6,
                  px: 0.5
                }}
              >
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </Typography>
              
              <JoinVideoButton
                variant="contained"
                startIcon={<VideocamIcon />}
                fullWidth
                onClick={() => window.open(extendedData.roomUrl, '_blank')}
              >
                Tham gia phòng khám
              </JoinVideoButton>
              
              <MessageTime isSelf={message.isSelf} sx={{ mt: 1.5, textAlign: 'right' }}>
                {renderMessageTime(timestamp)}
              </MessageTime>
            </SpecialMessageContainer>
          );
        }
      } else if (message.hasVideoCall || (message.content && message.content.includes('tham gia phòng khám') && message.content.includes('http'))) {
        // Fallback for messages with hasVideoCall flag or video call content
        console.log("Rendering message with video call content:", message);
        
        // Extract URL from message content
        const urlMatch = message.content.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          const roomUrl = urlMatch[0];
          return (
            <SpecialMessageContainer isSelf={message.isSelf}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1.5,
                gap: 1
              }}>
                <Avatar sx={{ 
                  bgcolor: 'success.main',
                  width: 36,
                  height: 36
                }}>
                  <VideocamIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Lời mời tham gia phòng khám
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Từ: {message.isSelf ? 'Bạn' : 'Người gửi'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ 
                my: 1.5, 
                opacity: 0.1 
              }} />
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'medium', 
                  lineHeight: 1.6,
                  px: 0.5
                }}
              >
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </Typography>
              
              <JoinVideoButton
                variant="contained"
                startIcon={<VideocamIcon />}
                fullWidth
                onClick={() => window.open(roomUrl, '_blank')}
              >
                Tham gia phòng khám
              </JoinVideoButton>
              
              <MessageTime isSelf={message.isSelf} sx={{ mt: 1.5, textAlign: 'right' }}>
                {renderMessageTime(timestamp)}
              </MessageTime>
            </SpecialMessageContainer>
          );
        }
      }
      
      // Nếu không phải tin nhắn đặc biệt, hiển thị như bình thường
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: message.isSelf ? 'flex-end' : 'flex-start',
            mb: 1
          }}
        >
          <MessageBubble isSelf={message.isSelf}>
            <Typography 
              variant="body2" 
              component="div"
              sx={{ lineHeight: 1.5 }}
            >
              {message.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </Typography>
            <MessageTime isSelf={message.isSelf}>
              {renderMessageTime(timestamp)}
            </MessageTime>
          </MessageBubble>
        </Box>
      );
    } catch (error) {
      console.error("Error rendering message:", error);
      return (
        <MessageBubble isSelf={message.isSelf}>
          <Typography variant="body1">{message.content || "Không có nội dung"}</Typography>
          <MessageTime isSelf={message.isSelf}>
            {renderMessageTime(message.timestamp)}
          </MessageTime>
        </MessageBubble>
      );
    }
  };

  // First, check role and fetch info accordingly
  useEffect(() => {
    const checkRoleAndFetchInfo = async () => {
      try {
        // Lấy role từ localStorage
        const role = getRole();
        setUserRole(role);
        console.log("Current user role:", role);
        
        // Kiểm tra xem có messageList được truyền từ trang chat của bác sĩ không
        const state = location.state;
        console.log("state123", state);
        if (state && state.messageList && state.messageList.length > 0) {
          console.log("Using messageList from doctor's chat page");
          setMessages(state.messageList);
          // Log messages để kiểm tra
          console.log("Messages received:", state.messageList);
          // Đánh dấu là đã có tin nhắn để không gọi API lấy tin nhắn nữa
          sessionStorage.setItem('hasLoadedMessages', 'true');
        }
        
        if (role === 'DOCTOR') {
          // Nếu là bác sĩ, sử dụng doctorId từ URL là username của patient
          console.log("Doctor role detected. Using param as patient username:", doctorId);
          
          // Thiết lập username của patient
          setPatientUsername(doctorId);
          
          // Thiết lập conversation ID trực tiếp
          setConversationId(doctorId);
          
          // Kết thúc loading
          setLoading(false);
        } else {
          // Nếu là patient, fetch thông tin doctor
          console.log("Patient role detected. Fetching doctor info for ID:", doctorId);
          const response = await doctor.getDoctorById(doctorId);
          
          if (response?.result) {
            console.log("Doctor info received:", response.result);
            setDoctorInfo(response.result);
            
            // Determine conversation ID
            const docUserName = response.result.userName || 
                                response.result.username || 
                                response.result.userId || 
                                doctorId;
            
            setConversationId(docUserName);
          } else {
            console.error("No doctor info in response:", response);
            setError('Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.');
            setShowError(true);
          }
        }
      } catch (error) {
        console.error('Error in role checking or fetching info:', error);
        setError('Có lỗi xảy ra. Vui lòng tải lại trang.');
        setShowError(true);
      }
    };

    checkRoleAndFetchInfo();
  }, [doctorId]); // Chỉ chạy khi doctorId thay đổi, không chạy lại khi navigate

  // Then initialize ZIM after info is loaded
  useEffect(() => {
    // Chỉ tiếp tục nếu đã có thông tin cần thiết
    if (userRole === 'DOCTOR' && !patientUsername) return;
    if (userRole === 'PATIENT' && !doctorInfo) return;

    // Kiểm tra xem đã có tin nhắn được load từ state chưa
    const hasLoadedMessages = sessionStorage.getItem('hasLoadedMessages') === 'true';
    
    let zimInstance = null;

    const initZIM = async () => {
      try {
        console.log("Initializing ZIM with AppID:", AppID);
        
        // Create ZIM instance
        ZIM.create({ appID: AppID });
        const zim = ZIM.getInstance();
        zimRef.current = zim;
        zimInstance = zim;

        // Set up event listeners
        zim.on('error', (zim, errorInfo) => {
          console.error('ZIM error:', errorInfo.code, errorInfo.message);
          setError(`Lỗi: ${errorInfo.code} - ${errorInfo.message}`);
          setShowError(true);
        });

        zim.on('connectionStateChanged', (zim, { state, event }) => {
          console.log('Connection state changed:', state, event);
          if (state === 0) {
            setConnected(true);
            // Try to reconnect if disconnected due to network issues
            if (event === 3 && loggedIn) {
              console.log("Trying to reconnect...");
              loginZIM(zim);
            }
          } else if (state === 1) {
            setConnected(true);
          }
        });

        zim.on('peerMessageReceived', (zim, { messageList, fromConversationID }) => {
          
          console.log("Message received from:", fromConversationID, messageList);
          
          // Determine if we should accept this message based on role
          const shouldAcceptMessage = userRole === 'DOCTOR' 
            ? fromConversationID === patientUsername
            : true; // Nếu là patient, chấp nhận tất cả tin nhắn
          
          if (shouldAcceptMessage) {
            const newMessages = messageList.map(msg => {
              // Log full details of the received message for debugging
              console.log("Full received message details:", msg);
              
              // Check for video call info in message content if extendedData is not available
              const hasVideoCall = !msg.extendedData && 
                                   msg.message && 
                                   msg.message.includes('tham gia phòng khám') && 
                                   msg.message.includes('http');
              
              if (hasVideoCall) {
                console.log("Message contains video call URL without extendedData:", msg.message);
              }
              
              return {
                id: msg.messageID,
                content: msg.message,
                sender: fromConversationID,
                timestamp: new Date(msg.timestamp),
                isSelf: false,
                extendedData: msg.extendedData,
                hasVideoCall
              };
            });
            
            setMessages(prev => [...prev, ...newMessages]);
          } else {
            console.log("Ignoring message from unrelated sender:", fromConversationID);
          }
        });

        // Login
        await loginZIM(zim);
        
        // Chỉ lấy tin nhắn lịch sử nếu chưa có tin nhắn từ state
        // if (!hasLoadedMessages) {
        //   await getMessageHistory(zim);
        // } else {
        //   console.log("Skipping message history fetch as messages were loaded from state");
        // }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing ZIM:', error);
        setLoading(false);
        setError('Không thể kết nối đến dịch vụ chat. Vui lòng thử lại sau.');
        setShowError(true);
      }
    };

    const loginZIM = async (zim) => {
      try {
        const userID = getUsername();
        if (!userID) {
          throw new Error("User ID is null or empty");
        }
        
        const userName = userID; // Use same value for both to keep it simple
        
        // Try different token generation approaches
        let token;
        try {
          token = generateToken(userID);
          console.log("Generated token from service:", token);
        } catch (tokenError) {
          console.error("Error generating token with service:", tokenError);
          token = createToken(userID);
          console.log("Generated fallback token:", token);
        }

        const userInfo = { userID, userName };
        console.log("Logging in with:", userInfo, "Token length:", token?.length);
        
        await zim.login(userInfo, token);
        console.log('Logged in successfully');
        setLoggedIn(true);
        
        // Get conversation history after successful login
        // await getMessageHistory(zim);
      } catch (error) {
        console.error('Login failed:', error);
        setError('Đăng nhập thất bại. Vui lòng thử lại sau.');
        setShowError(true);
        throw error; // Re-throw to be caught by the caller
      }
    };    //   console.log("Starting to fetch message history using ZegoCloud API");
      
    //   // Bảo đảm có ID của người nhận
    //   let convId = conversationId;
      
    //   if (!convId) {
    //     // Xác định conversationID dựa trên role
    //     if (userRole === 'DOCTOR') {
    //       convId = patientUsername;
    //     } else {
    //       // Logic cho patient
    //       if (doctorInfo?.userName) {
    //         convId = doctorInfo.userName;
    //       } else if (doctorInfo?.username) {
    //         convId = doctorInfo.username;
    //       } else if (doctorInfo?.userId) {
    //         convId = doctorInfo.userId;
    //       } else if (doctorId) {
    //         convId = doctorId;
    //       }
    //     }
        
    //     if (convId) {
    //       setConversationId(convId);
    //     }
    //   }
      
    //   console.log("Using conversation ID for history:", convId);
      
    //   if (!convId) {
    //     console.error("Could not determine valid conversationID for message history");
    //     return;
    //   }
      
    //   // Hiển thị loading trạng thái tải tin nhắn
    //   setLoading(true);
      
    //   try {
    //     // Kiểm tra xem cuộc trò chuyện có tồn tại không
    //     console.log("Checking if conversation exists...");
    //     const conversationResult = await zim.queryConversationList({
    //       count: 100
    //     });
        
    //     console.log("Conversation list result:", conversationResult);
        
    //     const conversationExists = conversationResult.conversationList.some(
    //       conv => conv.conversationID === convId
    //     );
        
    //     if (!conversationExists) {
    //       console.log("Conversation doesn't exist yet. It will be created with first message.");
    //       setMessages([]);
    //       setLoading(false);
    //       return;
    //     }
        
    //     // Reset pagination variables
    //     hasMoreMessages.current = true;
    //     nextMessageRef.current = null;
        
    //     // Truy vấn tin nhắn sử dụng queryHistoryMessage với pagination
    //     console.log("Retrieving initial messages...");
        
    //     try {
    //       // Validate conversationID before making the API call
    //       if (!convId || typeof convId !== 'string' || convId.trim() === '') {
    //         throw new Error("Invalid conversationID: " + convId);
    //       }
          
    //       // Ensure conversationID is properly formatted - must be a non-empty string
    //       const safeConvId = convId.trim();
          
    //       // Log the exact conversationID we're using
    //       console.log("Using exact conversationID for query:", safeConvId);
          
    //       // Configure pagination parameters
    //       const config = {
    //         nextMessage: null, // Start from the latest message
    //         count: 30,
    //         reverse: true
    //       };
          
    //       // Function to handle message query results
    //       const handleMessageQuery = async (result) => {
    //         console.log("Message query result:", result);
            
    //         if (result?.messageList?.length > 0) {
    //           console.log(`Retrieved ${result.messageList.length} messages`);
              
    //           // Format messages for UI
    //           const formattedMessages = result.messageList.map(msg => ({
    //             id: msg.messageID,
    //             content: msg.message,
    //             sender: msg.senderUserID,
    //             timestamp: new Date(msg.timestamp),
    //             isSelf: msg.senderUserID === getUsername(),
    //             extendedData: msg.extendedData,
    //             hasVideoCall: !msg.extendedData && 
    //                         msg.message && 
    //                         msg.message.includes('tham gia phòng khám') && 
    //                         msg.message.includes('http')
    //           }));
              
    //           // Store next message reference for pagination
    //           if (result.messageList.length > 0) {
    //             nextMessageRef.current = result.messageList[0];
    //           }
              
    //           // If fewer messages than requested, we've reached the end
    //           if (result.messageList.length < 30) {
    //             hasMoreMessages.current = false;
    //           }
              
    //           // Update messages state
    //           setMessages(prev => [...formattedMessages.reverse(), ...prev]);
              
    //           // If we have more messages to load and pagination is enabled
    //           if (hasMoreMessages.current && result.messageList.length === 30) {
    //             // Update config for next page
    //             config.nextMessage = result.messageList[0];
                
    //             // Load next page
    //             const nextResult = await zim.queryHistoryMessage({
    //               conversationID: safeConvId,
    //               conversationType: 0,
    //               ...config
    //             });
                
    //             // Process next page
    //             await handleMessageQuery(nextResult);
    //           }
    //         } else {
    //           console.log("No more messages found");
    //           hasMoreMessages.current = false;
    //         }
    //       };
          
    //       // Initial query
    //       console.log("Starting initial history query with params:", {
    //         conversationID: safeConvId,
    //         conversationType: 0,
    //         count: config.count,
    //         reverse: config.reverse
    //       });
          
    //       const initialResult = await zim.queryHistoryMessage({
    //         conversationID: safeConvId,
    //         conversationType: 0,
    //         ...config
    //       });
          
    //       // Process initial results
    //       await handleMessageQuery(initialResult);
          
    //     } catch (error) {
    //       console.error("Error querying history messages:", error);
          
    //       // Try querying specific messages as fallback
    //       try {
    //         console.log("Trying to query specific messages...");
            
    //         // Create a valid messageSeqs array with a single dummy value to avoid empty array issues
    //         // Some API implementations don't handle empty arrays well
    //         const messageSeqs = ["1"]; // Using a dummy sequence
            
    //         console.log("QueryMessages params:", {
    //           messageSeqs,
    //           conversationID: convId,
    //           conversationType: 0
    //         });
            
    //         const messagesResult = await zim.queryMessages(
    //           messageSeqs,
    //           convId,
    //           0 // One-to-one chat
    //         );
            
    //         console.log("Query specific messages result:", messagesResult);
            
    //         if (messagesResult?.messageList?.length > 0) {
    //           console.log(`Retrieved ${messagesResult.messageList.length} messages`);
              
    //           const formattedMessages = messagesResult.messageList.map(msg => ({
    //             id: msg.messageID,
    //             content: msg.message,
    //             sender: msg.senderUserID,
    //             timestamp: new Date(msg.timestamp),
    //             isSelf: msg.senderUserID === getUsername(),
    //             extendedData: msg.extendedData,
    //             hasVideoCall: !msg.extendedData && 
    //                         msg.message && 
    //                         msg.message.includes('tham gia phòng khám') && 
    //                         msg.message.includes('http')
    //           }));
              
    //           setMessages(formattedMessages.reverse());
    //         } else {
    //           console.log("No messages found with any query method");
    //           setMessages([]);
    //         }
            
    //         hasMoreMessages.current = false;
    //       } catch (secondError) {
    //         console.error("All query methods failed:", secondError);
            
    //         // Try one more approach - using conversation list only
    //         try {
    //           console.log("Attempting to use conversation list to get last message");
              
    //           const conversationResult = await zim.queryConversationList({
    //             count: 100
    //           });
              
    //           const targetConversation = conversationResult.conversationList.find(
    //             conv => conv.conversationID === convId
    //           );
              
    //           if (targetConversation && targetConversation.lastMessage) {
    //             console.log("Found last message in conversation:", targetConversation.lastMessage);
                
    //             const lastMsg = targetConversation.lastMessage;
    //             const formattedMessage = {
    //               id: lastMsg.messageID || "temp-id",
    //               content: lastMsg.message || "",
    //               sender: lastMsg.senderUserID || "",
    //               timestamp: new Date(lastMsg.timestamp || Date.now()),
    //               isSelf: (lastMsg.senderUserID || "") === getUsername(),
    //               extendedData: lastMsg.extendedData || "",
    //               hasVideoCall: lastMsg.message && 
    //                             lastMsg.message.includes('tham gia phòng khám') && 
    //                             lastMsg.message.includes('http')
    //             };
                
    //             setMessages([formattedMessage]);
    //           } else {
    //             console.log("No last message found in conversation list");
    //             setMessages([]);
    //           }
    //         } catch (thirdError) {
    //           console.error("All recovery methods failed:", thirdError);
    //           setMessages([]);
    //         }
            
    //         hasMoreMessages.current = false;
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error querying ZegoCloud API:', error);
    //     setError(`Không thể tải lịch sử tin nhắn: ${error.message || 'Lỗi không xác định'}`);
    //     setShowError(true);
    //     setMessages([]);
    //     hasMoreMessages.current = false;
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    initZIM();

    // Cleanup
    return () => {
      if (zimInstance) {
        try {
          console.log("Cleaning up ZIM instance");
          zimInstance.logout();
        } catch (e) {
          console.error('Error during logout:', e);
        }
      }
    };
  }, [userRole, doctorInfo, patientUsername, conversationId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !zimRef.current) {
      console.warn("Can't send message: missing input or ZIM instance");
      return;
    }
    
    if (!loggedIn) {
      console.error("Not logged in, cannot send message");
      setError("Bạn chưa đăng nhập. Vui lòng thử lại sau.");
      setShowError(true);
      return;
    }
    
    // Kiểm tra thông tin người nhận dựa trên role
    if (userRole === 'DOCTOR' && !patientUsername) {
      console.error("patientUsername is not set for doctor role");
      setError("Không thể xác định người nhận. Vui lòng tải lại trang.");
      setShowError(true);
      return;
    } else if (userRole === 'PATIENT' && !doctorInfo) {
      console.error("doctorInfo is null for patient role");
      setError("Không thể tìm thấy thông tin bác sĩ. Vui lòng tải lại trang.");
      setShowError(true);
      return;
    }
    
    try {
      setSending(true);
      // Xác định ID người nhận dựa trên role
      let toConversationID = conversationId;
      
      if (!toConversationID) {
        if (userRole === 'DOCTOR') {
          toConversationID = patientUsername;
        } else {
          toConversationID = doctorInfo?.userName || doctorId;
        }
      }
      
      // Nếu không có conversationId được thiết lập, thiết lập nó
      if (!conversationId && toConversationID) {
        setConversationId(toConversationID);
      }
      
      const conversationType = 0; // One-to-one chat
      const config = { priority: 1 };
      const notification = {
        onMessageAttached: (message) => {
          console.log('Message attached:', message);
        }
      };
      
      // Kiểm tra xem có phải tin nhắn chứa thông tin video call không
      const isVideoInvitation = inputMessage.includes('tham gia phòng khám') && 
                                inputMessage.includes('http');
      
      let extendedDataValue = 'text';
      
      // Nếu là lời mời video call, tạo extendedData phù hợp
      if (isVideoInvitation) {
        console.log("Detected video invitation in message:", inputMessage);
        
        // Extract URL from message
        const urlMatch = inputMessage.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          const roomUrl = urlMatch[0];
          
          // Tạo extendedData dạng JSON string
          const extendedDataObj = {
            type: 'video_invitation',
            roomUrl: roomUrl,
            doctorName: doctorInfo?.name || 'Bác sĩ',
            patientName: getRole() === 'PATIENT' ? 'Bệnh nhân' : patientUsername,
            timestamp: Date.now()
          };
          
          extendedDataValue = JSON.stringify(extendedDataObj);
          console.log("Created extendedData for video invitation:", extendedDataObj);
        }
      }
      
      const messageTextObj = { 
        type: 1, // Text message
        message: inputMessage, 
        extendedData: extendedDataValue
      };

      console.log("Sending message to:", toConversationID);
      console.log("Message object:", messageTextObj);
      
      const { message } = await zimRef.current.sendMessage(
        messageTextObj, 
        toConversationID, 
        conversationType, 
        config, 
        notification
      );
      
      console.log("Message sent successfully:", message);
      
      const newMessage = {
        id: message.messageID,
        content: inputMessage,
        sender: getUsername(),
        timestamp: new Date(),
        isSelf: true,
        extendedData: message.extendedData,
        hasVideoCall: isVideoInvitation
      };
      
      setMessages(prev => {
        const newMessages = [...prev, newMessage];
        saveMessagesToLocalStorage(newMessages);
        return newMessages;
      });
      setInputMessage('');
      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
      
      // Try to reconnect if not logged in
      if (error.code === 6000121) { // "Not logged with call"
        setError("Kết nối bị mất. Đang thử kết nối lại...");
        setShowError(true);
        
        try {
          // Try to re-login
          if (zimRef.current) {
            const userID = getUsername();
            const userName = userID;
            const token = generateToken(userID);
            await zimRef.current.login({ userID, userName }, token);
            setLoggedIn(true);
            setError("Kết nối lại thành công. Vui lòng thử gửi tin nhắn lại.");
            setShowError(true);
          }
        } catch (loginError) {
          console.error("Failed to reconnect:", loginError);
          setError("Không thể kết nối lại. Vui lòng tải lại trang.");
          setShowError(true);
        }
      } else {
        setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
        setShowError(true);
      }
    }
  };

  const handleGoBack = () => {
    // Điều hướng dựa trên role
    if (userRole === 'DOCTOR') {
      navigate('/doctor_chat');
    } else {
      navigate(`/doctor/${doctorId}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.isSelf) {
        // If the last message is from the current user, scroll to bottom
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    }
  }, [messages]);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    const messageContainer = document.querySelector('[data-message-container]');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Add cleanup function to remove messages from localStorage when component unmounts
  useEffect(() => {
    return () => {
      if (conversationId) {
        const key = `chat_messages_${conversationId}`;
        localStorage.removeItem(key);
        console.log("Cleaned up messages from localStorage for key:", key);
      }
    };
  }, [conversationId]);

  // Listen for new messages and save them to localStorage
  useEffect(() => {
    if (zimRef.current) {
      const handleMessageReceived = (zim, { messageList, fromConversationID }) => {
        if (fromConversationID === conversationId) {
          const newMessages = messageList.map(msg => ({
            id: msg.messageID,
            content: msg.message,
            sender: msg.senderUserID,
            timestamp: new Date(msg.timestamp),
            isSelf: msg.senderUserID === getUsername(),
            extendedData: msg.extendedData,
            hasVideoCall: !msg.extendedData && 
                         msg.message && 
                         msg.message.includes('tham gia phòng khám') && 
                         msg.message.includes('http')
          }));
          
          setMessages(prev => {
            const updatedMessages = [...prev, ...newMessages];
            saveMessagesToLocalStorage(updatedMessages);
            return updatedMessages;
          });
        }
      };

      zimRef.current.on('peerMessageReceived', handleMessageReceived);

      return () => {
        if (zimRef.current) {
          zimRef.current.off('peerMessageReceived', handleMessageReceived);
        }
      };
    }
  }, [conversationId]);

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
        background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`
      }}>
        <CircularProgress size={48} thickness={4} />
        <Typography variant="h6" color="text.secondary" fontWeight={500}>Đang kết nối...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: theme => theme.palette.background.default
    }}>
      <HeaderComponent />
      
      <ChatContainer>
        {/* Header with user info based on role */}
        <ChatHeader>
          <IconButton 
            onClick={handleGoBack}
            sx={{ 
              backgroundColor: theme => alpha(theme.palette.divider, 0.04),
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.divider, 0.1),
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box sx={{ position: 'relative' }}>
            <StyledAvatar 
              src={userRole === 'DOCTOR' ? undefined : doctorInfo?.img} 
              alt={userRole === 'DOCTOR' ? patientUsername : (doctorInfo?.name || 'Bác sĩ')}
              sx={{ width: 48, height: 48 }}
            >
              {userRole === 'DOCTOR' && patientUsername && patientUsername.charAt(0).toUpperCase()}
            </StyledAvatar>
            <StatusIndicator online={connected} />
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {userRole === 'DOCTOR' ? patientUsername : (doctorInfo?.name || 'Bác sĩ')}
              </Typography>
              {loggedIn && (
                <Tooltip title="Đã kết nối">
                  <CheckCircleIcon 
                    fontSize="small" 
                    color="success" 
                    sx={{ ml: 1, fontSize: 16, opacity: 0.8 }}
                  />
                </Tooltip>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              {userRole === 'DOCTOR' ? 'Bệnh nhân' : (doctorInfo?.specialization || 'Chuyên khoa')}
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: connected ? 'success.main' : 'text.disabled',
                  mx: 1
                }} 
              />
              {connected ? 'Trực tuyến' : 'Ngoại tuyến'}
            </Typography>
          </Box>
        </ChatHeader>
        
        {/* Messages area */}
        <MessageContainer data-message-container>
          {renderLoadMoreIndicator()}
          
          {messages.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              gap: 2
            }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  opacity: 0.6,
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  mb: 2
                }}
              >
                <SendIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography color="text.secondary" variant="h6" textAlign="center">
                {userRole === 'DOCTOR' 
                  ? `Bắt đầu cuộc trò chuyện với bệnh nhân ${patientUsername}`
                  : `Bắt đầu cuộc trò chuyện với bác sĩ ${doctorInfo?.name || ''}`
                }
              </Typography>
              <Typography color="text.disabled" variant="body2" textAlign="center" sx={{ maxWidth: 400 }}>
                Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện. Bạn có thể gửi tin nhắn văn bản,
                hoặc lời mời tham gia phòng khám trực tuyến.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              {messages.map((message, index) => {
                // Kiểm tra xem tin nhắn có chứa URL phòng khám không
                const isVideoInvitation = message.content && 
                  typeof message.content === 'string' && 
                  message.content.includes('http') && 
                  (message.content.toLowerCase().includes('phòng khám') || 
                   message.content.toLowerCase().includes('tham gia'));
                
                // Nếu là tin nhắn mời tham gia phòng khám, hiển thị dạng đặc biệt
                if (isVideoInvitation) {
                  const urlMatch = message.content.match(/(https?:\/\/[^\s]+)/);
                  const roomUrl = urlMatch ? urlMatch[0] : '';
                  
                  return (
                    <SpecialMessageContainer key={index} isSelf={message.isSelf}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1.5,
                        gap: 1
                      }}>
                        <Avatar sx={{ 
                          bgcolor: 'success.main',
                          width: 36,
                          height: 36
                        }}>
                          <VideocamIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Lời mời tham gia phòng khám
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            Từ: {message.isSelf ? 'Bạn' : message.sender}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ 
                        my: 1.5, 
                        opacity: 0.1 
                      }} />
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 'medium', 
                          lineHeight: 1.6,
                          px: 0.5
                        }}
                      >
                        {message.content.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < message.content.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </Typography>
                      
                      <JoinVideoButton
                        variant="contained"
                        startIcon={<VideocamIcon />}
                        fullWidth
                        onClick={() => window.open(roomUrl, '_blank')}
                      >
                        Tham gia phòng khám
                      </JoinVideoButton>
                      
                      <MessageTime isSelf={message.isSelf} sx={{ mt: 1.5, textAlign: 'right' }}>
                        {renderMessageTime(message.timestamp)}
                      </MessageTime>
                    </SpecialMessageContainer>
                  );
                }
                
                // Hiển thị tin nhắn thông thường
                return (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: message.isSelf ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <MessageBubble isSelf={message.isSelf}>
                      <Typography variant="body2">
                        {message.content != null ? message.content : message.message}
                      </Typography>

                      <MessageTime isSelf={message.isSelf}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </MessageTime>
                    </MessageBubble>
                  </Box>
                );
              })}
            </Box>
          )}
          
          {/* Scroll to bottom button */}
          <Zoom in={showScrollBottom}>
            <Fab
              size="small"
              color="primary"
              aria-label="scroll to bottom"
              onClick={scrollToBottom}
              sx={{
                position: 'absolute',
                right: 16,
                bottom: 16,
                opacity: 0.8,
                boxShadow: theme => `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
                '&:hover': {
                  opacity: 1,
                  transform: 'translateY(-2px)'
                },
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              <ArrowDownwardIcon />
            </Fab>
          </Zoom>
          
          <div ref={messagesEndRef} />
        </MessageContainer>
        
        {/* Input area */}
        <ChatInputContainer>
          <Tooltip title="Đính kèm tệp tin">
            <IconButton 
              color="primary" 
              sx={{ 
                opacity: 0.7,
                width: 40,
                height: 40
              }}
              disabled={!loggedIn}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
          
          <TextField
            fullWidth
            placeholder={loggedIn ? "Nhập tin nhắn..." : "Đang kết nối..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            variant="outlined"
            size="small"
            disabled={!loggedIn}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor: theme => alpha(theme.palette.background.paper, 0.8),
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                backdropFilter: 'blur(10px)',
                '&.Mui-focused': {
                  boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Biểu tượng cảm xúc">
                    <IconButton 
                      edge="end" 
                      disabled={!loggedIn}
                      sx={{ opacity: 0.7 }}
                    >
                      <InsertEmoticonIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
          
          <Tooltip title="Gửi tin nhắn">
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || sending || !loggedIn}
                sx={{
                  minWidth: 'unset',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  '&:hover': {
                    boxShadow: theme => `0 6px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
                    transform: !(!inputMessage.trim() || sending || !loggedIn) ? 'translateY(-2px)' : 'none'
                  },
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Tooltip>
        </ChatInputContainer>
      </ChatContainer>
      
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Chat;
