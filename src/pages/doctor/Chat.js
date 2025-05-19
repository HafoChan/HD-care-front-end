import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Paper, 
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  Grid,
  TextField,
  InputAdornment,
  Card,
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ZIM } from 'zego-zim-web';
import { AppID } from "../../utils";
import { generateToken } from "../../service/patientService/ZimSerivce";
import { getUsername, getRole } from '../../service/otherService/localStorage';
import Sidebar from "../../components/doctor/Sidebar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RefreshIcon from '@mui/icons-material/Refresh';
import VideocamIcon from '@mui/icons-material/Videocam';
import { styled } from '@mui/material/styles';

// Styled components for modern chat
const ChatBubble = styled(Paper)(({ theme, isSelf }) => ({
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

function Chat() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [messageList, setMessageList] = useState(null);
  
  // New states for conversation list
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Reference to keep track of ZIM instance
  const zimRef = useRef(null);

  // New state for auto-refresh
  const [autoRefreshing, setAutoRefreshing] = useState(false);

  const theme = useTheme();

  // Initialize ZIM to activate account
  useEffect(() => {
    let zimInstance = null;
    fetchConversations()
    const initZIM = async () => {
      try {
        console.log("Initializing ZIM with AppID:", AppID);
        
        // Create ZIM instance
        ZIM.create({ appID: AppID });
        const zim = ZIM.getInstance();
        zimInstance = zim;
        zimRef.current = zim;

        // Set up event listeners
        zim.on('error', (zim, errorInfo) => {
          console.error('ZIM error:', errorInfo.code, errorInfo.message);
          setError(`Lỗi: ${errorInfo.code} - ${errorInfo.message}`);
          setShowError(true);
        });

        zim.on('connectionStateChanged', (zim, { state }) => {
          console.log('Connection state changed:', state);
          if (state === 0) {
            setConnected(false);
            // Try to reconnect if disconnected
            if (loggedIn) {
              console.log("Connection lost, attempting to reconnect...");
              setTimeout(() => loginZIM(zim), 3000);
            }
          } else if (state === 1) {
            setConnected(true);
          }
        });

        zim.on('peerMessageReceived', (zim, { messageList, fromConversationID }) => {
          console.log("Message received from:", fromConversationID, messageList);
          fetchConversations()
          // Update unread count and last message information
          setUnreadCount(prev => prev + messageList.length);
          setMessageList(messageList)
          if (messageList.length > 0) {
            const message = messageList[messageList.length - 1];
            setLastMessage({
              sender: fromConversationID,
              content: message.message,
              timestamp: new Date(message.timestamp)
            });
            
            // Automatically fetch updated conversation list when new message arrives
            fetchConversations(zim);
            
            // Play notification sound
            try {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(e => console.log('Sound notification error:', e));
            } catch (error) {
              console.log('Could not play notification sound', error);
            }
          }
        });

        // Login
        await loginZIM(zim);
        
        // Fetch conversations after login
        await fetchConversations(zim);
        
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
        
        // Make sure we use a valid userName for the doctor
        const userName = userID; 
        
        // Generate token with proper error handling
        let token;
        try {
          token = generateToken(userID);
          console.log("Generated token for login (length):", token?.length);
        } catch (tokenError) {
          console.error("Error generating token:", tokenError);
          // Create a fallback token if the main generation fails
          token = createFallbackToken(userID);
          console.log("Using fallback token (length):", token?.length);
        }

        if (!token) {
          throw new Error("Failed to generate valid token");
        }
        
        const userInfo = { userID, userName };
        console.log("Doctor logging in with userID:", userID);
        
        // Attempt login with retry
        let retryCount = 0;
        const maxRetries = 2;
        
        while (retryCount <= maxRetries) {
          try {
            await zim.login(userInfo, token);
            console.log('Doctor logged in successfully');
            setLoggedIn(true);
            break; // Exit loop on success
          } catch (loginError) {
            console.error(`Login attempt ${retryCount + 1} failed:`, loginError);
            
            if (retryCount === maxRetries) {
              throw loginError; // Re-throw after max retries
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
            retryCount++;
          }
        }
      } catch (error) {
        console.error('Login failed after retries:', error);
        setError(`Đăng nhập thất bại: ${error.message || 'Vui lòng thử lại sau.'}`);
        setShowError(true);
        setLoggedIn(false);
      }
    };
    
    // Function to create a fallback token if the main token generation fails
    const createFallbackToken = (userID) => {
      try {
        // Basic implementation similar to the one in the patient Chat.js
        const timestamp = Math.floor(Date.now() / 1000);
        const expireTime = timestamp + 3600; // 1 hour expiration
        
        const payload = {
          app_id: AppID,
          user_id: userID,
          expire_time: expireTime,
          nonce: Math.random().toString(36).substring(2, 15)
        };
        
        return btoa(JSON.stringify(payload));
      } catch (error) {
        console.error("Error creating fallback token:", error);
        return null;
      }
    };

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
  }, [doctorId]);

  // Function to fetch conversation list
  const fetchConversations = async (zim, isAutoRefresh = false) => {
    const zimToUse = zim || zimRef.current;
    if (!zimToUse || !loggedIn) {
      console.warn("Cannot fetch conversations: ZIM instance not available or not logged in");
      return;
    }
    
    if (isAutoRefresh) {
      setAutoRefreshing(true);
    } else {
      setLoadingConversations(true);
    }

    try {
      const { conversationList } = await zimToUse.queryConversationList({
        count: 100,
        nextConversation: null
      });
      
      setConversations(conversationList);
      
      // Calculate total unread count
      const totalUnread = conversationList.reduce((sum, conversation) => 
        sum + conversation.unreadMessageCount, 0);
      setUnreadCount(totalUnread);
      
    } catch (error) {
      console.error("Error fetching conversation list:", error);
      setError(`Không thể tải danh sách hội thoại: ${error.message}`);
      setShowError(true);
    } finally {
      if (isAutoRefresh) {
        setAutoRefreshing(false);
      } else {
        setLoadingConversations(false);
      }
    }
  };
  
  // Handle refresh conversations
  const handleRefreshConversations = () => {
    fetchConversations();
  };

  // Handle view conversation detail
  const handleViewConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Save messageList to localStorage
    try {
      const key = `chat_messages_${getUsername()}`;
      const currentMessages = JSON.parse(localStorage.getItem(key) || '{}');
      currentMessages[conversation.conversationID] = messageList;
      localStorage.setItem(key, JSON.stringify(currentMessages));
      console.log("Messages saved to localStorage for conversation:", conversation.conversationID);
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }

    // Navigate to the chat detail page with messageList in state
    navigate(`/chat/${conversation.conversationID}`, {
      state: {
        messageList: messageList,
        conversationID: conversation.conversationID,
        conversationName: conversation.conversationName
      }
    });
  };

  const handleGoBack = () => {
    navigate(`/doctor_chat`);
  };

  // Get filtered conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.conversationID.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conversation.conversationName && 
     conversation.conversationName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to render special message types
  const renderSpecialMessage = (conversation) => {
    try {
      // Kiểm tra xem tin nhắn cuối cùng có extendedData không
      if (conversation.lastMessage?.extendedData) {
        let extendedData;
        try {
          extendedData = typeof conversation.lastMessage.extendedData === 'string'
            ? JSON.parse(conversation.lastMessage.extendedData)
            : conversation.lastMessage.extendedData;

          console.log("Rendering conversation with extendedData:", extendedData);

          // Nếu là lời mời tham gia video
          if (extendedData.type === 'video_invitation') {
            return (
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<VideocamIcon />}
                sx={{ mt: 1, mb: 1 }}
                onClick={() => window.open(extendedData.roomUrl, '_blank')}
              >
                Tham gia phòng khám
              </Button>
            );
          }
        } catch (e) {
          console.error("Error parsing extendedData:", e, "Raw value:", conversation.lastMessage.extendedData);
        }
      }
      
      // Nếu không phải tin nhắn đặc biệt, không hiển thị gì cả
      return null;
    } catch (error) {
      console.error("Error rendering special message:", error);
      return null;
    }
  };

  // Add auto-refresh for conversations
  useEffect(() => {
    if (loggedIn) {
      // Initial fetch
      fetchConversations();
      
      // Set up periodic refresh - less frequent since we also refresh on new messages
      const interval = setInterval(() => {
        fetchConversations();
      }, 60000); // Refresh every minute as backup
      
      return () => clearInterval(interval);
    }
  }, [loggedIn]);

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2 
      }}>
        <CircularProgress />
        <Typography variant="body1">Đang kết nối...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      bgcolor: theme => alpha(theme.palette.background.default, 0.95)
    }}>
      <Sidebar />
      
      <Box sx={{ 
        flexGrow: 1, 
        ml: { xs: 0, md: "280px" },
        p: 3,
        transition: "margin 0.2s ease",
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          gap: 2
        }}>
          <IconButton onClick={handleGoBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Tin nhắn
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Chat list */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              minHeight: 500, 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`
            }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: theme => alpha(theme.palette.background.paper, 0.8),
                      '&:hover': {
                        backgroundColor: theme => alpha(theme.palette.background.paper, 0.9),
                      }
                    }
                  }}
                />
              </Box>
              
              <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                {loadingConversations && conversations.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <CircularProgress size={30} />
                  </Box>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <ListItem 
                      key={conversation.conversationID} 
                      divider 
                      onClick={() => handleViewConversation(conversation)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedConversation?.conversationID === conversation.conversationID 
                          ? alpha(theme.palette.primary.main, 0.08)
                          : 'transparent',
                        borderRadius: '12px',
                        my: 0.5,
                        mx: 1,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <StyledAvatar>
                          {conversation.conversationName[0].toUpperCase()}
                        </StyledAvatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={conversation.conversationName}
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ 
                              display: 'block', 
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {conversation.lastMessage?.message || 'Chưa có tin nhắn'}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      {searchQuery ? 'Không tìm thấy kết quả' : 'Không có cuộc trò chuyện nào'}
                    </Typography>
                  </Box>
                )}
              </List>
            </Card>
          </Grid>
          
          {/* Chat preview */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 2, 
                height: '100%',
                minHeight: 500,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: theme => alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                color: 'white',
                boxShadow: theme => `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
              }}>
                <ChatIcon sx={{ fontSize: 40 }} />
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Chọn một cuộc trò chuyện
              </Typography>
              
              <Typography variant="body1" sx={{ 
                mb: 3, 
                color: 'text.secondary', 
                textAlign: 'center', 
                maxWidth: 400 
              }}>
                Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu chat
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
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