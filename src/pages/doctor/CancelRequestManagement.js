import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  alpha,
  useTheme,
  Fade,
  Container,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  CardActions,
} from "@mui/material";
import {
  NotificationsNone as NotificationsIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
  CheckCircle as ApproveIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import Layout from "../../components/doctor/Layout";
import { doctor } from "../../api/doctor";
import notificationApi from "../../api/notification";
import { appointment } from "../../api/appointment";

const CancelRequestManagement = () => {
  const theme = useTheme();
  const [cancelRequests, setCancelRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionNote, setActionNote] = useState("");
  const [processing, setProcessing] = useState(false);

  // Fetch doctor info
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await doctor.getInfo();
        if (response.code === 1000) {
          setDoctorId(response.result.id);
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error);
        toast.error("Không thể tải thông tin bác sĩ");
      }
    };

    fetchDoctorInfo();
  }, []);

  // Fetch cancel requests
  const fetchCancelRequests = useCallback(async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      const response = await notificationApi.getNotificationByDoctorId(doctorId);
      
      if (response.code === 1000) {
        setCancelRequests(response.result);
        // Count unread notifications
        const unread = response.result.filter(req => !req.read).length;
        setUnreadCount(unread);
      } else {
        toast.error("Không thể tải danh sách yêu cầu hủy");
      }
    } catch (error) {
      console.error("Error fetching cancel requests:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách yêu cầu hủy");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchCancelRequests();
  }, [fetchCancelRequests]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.putNotification(notificationId);
      // Update local state
      setCancelRequests(prev => 
        prev.map(req => 
          req.id === notificationId ? { ...req, read: true } : req
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Handle approve/reject request
  const handleAction = async () => {
    if (!selectedRequest || !actionType) return;

    setProcessing(true);
    try {
      const data = {
        idDoctor: doctorId,
        status: actionType === "approve" ? "CANCELLED" : "CONFIRMED",
        note: actionNote || (actionType === "approve" ? "Đã chấp nhận yêu cầu hủy" : "Từ chối yêu cầu hủy"),
      };

      const response = await appointment.changeAppointmentStatus(
        selectedRequest.idReference,
        data
      );

      if (response.code === 1000) {
        toast.success(
          actionType === "approve" 
            ? "Đã chấp nhận yêu cầu hủy lịch khám" 
            : "Đã từ chối yêu cầu hủy lịch khám"
        );
        
        // Mark notification as read
        await markAsRead(selectedRequest.id);
        
        // Remove from list
        setCancelRequests(prev => 
          prev.filter(req => req.id !== selectedRequest.id)
        );
        
        setOpenActionDialog(false);
        setSelectedRequest(null);
        setActionNote("");
      } else {
        toast.error("Không thể xử lý yêu cầu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setOpenDetailDialog(true);
    // Mark as read when viewing
    if (!request.read) {
      markAsRead(request.id);
    }
  };

  const handleActionClick = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setOpenActionDialog(true);
  };

  const formatDateTime = (dateTimeString) => {
    try {
      return format(new Date(dateTimeString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch (error) {
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "primary";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={500}>
          <Box>
            {/* Header */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                background: `linear-gradient(120deg, ${alpha(
                  theme.palette.warning.main,
                  0.08
                )} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon 
                      sx={{ 
                        fontSize: 32, 
                        color: theme.palette.warning.main 
                      }} 
                    />
                  </Badge>
                  <Box>
                    <Typography variant="h4" fontWeight="700" color="warning.main">
                      Quản lý hủy lịch khám
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {unreadCount > 0 
                        ? `${unreadCount} yêu cầu hủy mới cần xử lý`
                        : "Không có yêu cầu hủy mới"
                      }
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchCancelRequests}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Làm mới
                </Button>
              </Box>
            </Paper>

            {/* Cancel Requests List */}
            {cancelRequests.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <InfoIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Không có yêu cầu hủy lịch khám
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tất cả yêu cầu hủy lịch khám đã được xử lý
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {cancelRequests.map((request) => (
                  <Grid item xs={12} md={6} lg={4} key={request.id}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.1)}`,
                        },
                        ...(request.read === false && {
                          borderColor: theme.palette.warning.main,
                          backgroundColor: alpha(theme.palette.warning.main, 0.02),
                        }),
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: theme.palette.primary.main,
                              }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {request.patientName || "Bệnh nhân"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDateTime(request.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {!request.read && (
                            <Chip
                              label="Mới"
                              size="small"
                              color="warning"
                              sx={{ fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <EventIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2">
                              <strong>Ngày khám:</strong> {formatDateTime(request.appointmentDate)}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTimeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2">
                              <strong>Thời gian:</strong> {request.appointmentTime}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Lý do hủy:</strong>
                            </Typography>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                bgcolor: alpha(theme.palette.background.default, 0.7),
                                borderRadius: 1,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              }}
                            >
                              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                                {request.reason || "Không có lý do"}
                              </Typography>
                            </Paper>
                          </Box>
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Stack direction="row" spacing={1} width="100%">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetail(request)}
                            sx={{ 
                              flex: 1, 
                              borderRadius: 2, 
                              textTransform: "none",
                              borderColor: theme.palette.info.main,
                              color: theme.palette.info.main,
                            }}
                          >
                            Chi tiết
                          </Button>
                          
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleActionClick(request, "approve")}
                            sx={{ 
                              flex: 1, 
                              borderRadius: 2, 
                              textTransform: "none",
                            }}
                          >
                            Chấp nhận
                          </Button>
                          
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleActionClick(request, "reject")}
                            sx={{ 
                              flex: 1, 
                              borderRadius: 2, 
                              textTransform: "none",
                            }}
                          >
                            Từ chối
                          </Button>
                        </Stack>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>

        {/* Detail Dialog */}
        <Dialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                Chi tiết yêu cầu hủy lịch khám
              </Typography>
              <IconButton onClick={() => setOpenDetailDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            {selectedRequest && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Thông tin bệnh nhân
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Typography variant="body1">
                      <strong>Tên:</strong> {selectedRequest.patientName || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {selectedRequest.patientEmail || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Số điện thoại:</strong> {selectedRequest.patientPhone || "N/A"}
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Thông tin lịch khám
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                    <Typography variant="body1">
                      <strong>Ngày khám:</strong> {formatDateTime(selectedRequest.appointmentDate)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Thời gian:</strong> {selectedRequest.appointmentTime}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Tiêu đề:</strong> {selectedRequest.appointmentTitle || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Mô tả:</strong> {selectedRequest.appointmentDescription || "N/A"}
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Lý do hủy
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                      {selectedRequest.reason || "Không có lý do"}
                    </Typography>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Thời gian yêu cầu
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(selectedRequest.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setOpenDetailDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        {/* Action Dialog */}
        <Dialog
          open={openActionDialog}
          onClose={() => setOpenActionDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                {actionType === "approve" ? "Chấp nhận hủy lịch khám" : "Từ chối yêu cầu hủy"}
              </Typography>
              <IconButton onClick={() => setOpenActionDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Alert 
              severity={actionType === "approve" ? "warning" : "info"} 
              sx={{ mb: 3 }}
            >
              {actionType === "approve" 
                ? "Bạn có chắc chắn muốn chấp nhận yêu cầu hủy lịch khám này?"
                : "Bạn có chắc chắn muốn từ chối yêu cầu hủy lịch khám này?"
              }
            </Alert>
            
            <TextField
              label="Ghi chú (tùy chọn)"
              multiline
              rows={3}
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              fullWidth
              placeholder={actionType === "approve" 
                ? "Nhập ghi chú cho việc chấp nhận hủy lịch khám..."
                : "Nhập lý do từ chối yêu cầu hủy lịch khám..."
              }
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setOpenActionDialog(false)}
              variant="outlined"
              disabled={processing}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleAction}
              variant="contained"
              color={actionType === "approve" ? "success" : "error"}
              disabled={processing}
              startIcon={processing ? <CircularProgress size={16} /> : null}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              {processing 
                ? "Đang xử lý..." 
                : (actionType === "approve" ? "Chấp nhận" : "Từ chối")
              }
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default CancelRequestManagement; 