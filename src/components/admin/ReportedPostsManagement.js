import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Typography,
  Modal,
  Tag,
  Divider,
  Card,
  Image,
  Pagination,
  Empty,
  Spin,
  message,
  Tooltip,
} from "antd";
import {
  ExclamationCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  getReportedPosts,
  getReportsByPost,
  resolveReports,
  rejectReport,
} from "../../api/socialNetworkApi";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const ReportedPostsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [reportDetails, setReportDetails] = useState([]);
  const [reportsPagination, setReportsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchReportedPosts();
  }, [pagination.current]);

  const fetchReportedPosts = async () => {
    setLoading(true);
    try {
      const data = await getReportedPosts(
        pagination.current - 1,
        pagination.pageSize
      );

      if (data) {
        setReportedPosts(data.content || []);
        setPagination({
          ...pagination,
          total: data.totalElements || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching reported posts:", error);
      message.error("Không thể tải danh sách bài viết bị báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const fetchReportDetails = async (postId) => {
    setLoadingDetails(true);
    try {
      const data = await getReportsByPost(
        postId,
        reportsPagination.current - 1,
        reportsPagination.pageSize
      );

      if (data) {
        setReportDetails(data.content || []);
        setReportsPagination({
          ...reportsPagination,
          total: data.totalElements || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
      message.error("Không thể tải chi tiết báo cáo");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setDetailsModalVisible(true);
    setReportsPagination({ ...reportsPagination, current: 1 });
    fetchReportDetails(post.postId);
  };

  const handleReportsPageChange = (page) => {
    setReportsPagination({
      ...reportsPagination,
      current: page,
    });
    fetchReportDetails(selectedPost.postId);
  };

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      current: page,
    });
  };

  const handleConfirmDeletePost = (postId) => {
    confirm({
      title: "Xác nhận xóa bài viết",
      icon: <ExclamationCircleOutlined />,
      content:
        "Bạn có chắc chắn muốn xóa bài viết này và đánh dấu đã giải quyết các báo cáo không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await resolveReports(postId);
          message.success("Đã xóa bài viết và giải quyết báo cáo");
          fetchReportedPosts();
          if (detailsModalVisible && selectedPost?.postId === postId) {
            setDetailsModalVisible(false);
          }
        } catch (error) {
          console.error("Error resolving reports:", error);
          message.error("Không thể xóa bài viết. Vui lòng thử lại sau");
        }
      },
    });
  };

  const handleRejectReport = (reportId) => {
    confirm({
      title: "Xác nhận từ chối báo cáo",
      icon: <CloseCircleOutlined />,
      content:
        'Báo cáo này sẽ bị đánh dấu là "từ chối". Bạn có chắc chắn không?',
      okText: "Từ chối báo cáo",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await rejectReport(reportId);
          message.success("Đã từ chối báo cáo");
          fetchReportDetails(selectedPost.postId);
        } catch (error) {
          console.error("Error rejecting report:", error);
          message.error("Không thể từ chối báo cáo. Vui lòng thử lại sau");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID Bài viết",
      dataIndex: "postId",
      key: "postId",
      width: "15%",
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: "snippet",
      key: "snippet",
      ellipsis: true,
      render: (snippet) => (
        <Tooltip title={snippet}>
          <Text>{snippet}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (date) =>
        format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi }),
    },
    {
      title: "Số lượng báo cáo",
      dataIndex: "newReportCount",
      key: "newReportCount",
      width: "15%",
      render: (count) => <Tag color="red">{count} báo cáo</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Xem chi tiết
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleConfirmDeletePost(record.postId)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const renderReportStatus = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag color="processing">Đang xử lý</Tag>;
      case "RESOLVED":
        return <Tag color="success">Đã xử lý</Tag>;
      case "REJECTED":
        return <Tag color="default">Đã từ chối</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const PageTitle = styled(Typography)(() => ({
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 24,
    position: "relative",
    paddingBottom: 12,
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: "#1976d2",
    },
  }));

  return (
    <Box sx={{ ml: "280px" }}>
      <PageTitle variant="h4">Quản lý báo cáo bài viết</PageTitle>
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={reportedPosts.map((post) => ({
              ...post,
              key: post.postId,
            }))}
            pagination={false}
            rowKey="postId"
            locale={{
              emptyText: (
                <Empty description="Không có bài viết nào bị báo cáo" />
              ),
            }}
          />
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `Tổng ${total} bản ghi`}
            />
          </div>
        </Spin>
      </Card>

      {/* Chi tiết báo cáo Modal */}
      <Modal
        title={
          <div>
            <div>Chi tiết báo cáo</div>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Bài viết ID: {selectedPost?.postId}
            </Text>
          </div>
        }
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Spin spinning={loadingDetails}>
          <div
            style={{ maxHeight: "600px", overflowY: "auto", padding: "0 16px" }}
          >
            {reportDetails.length > 0 ? (
              reportDetails.map((report) => (
                <Card
                  key={report.reportId}
                  style={{ marginBottom: 16 }}
                  actions={[
                    <Button
                      key="reject"
                      danger
                      type="text"
                      disabled={report.status !== "PENDING"}
                      onClick={() => handleRejectReport(report.reportId)}
                    >
                      Từ chối báo cáo
                    </Button>,
                  ]}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text strong>
                      Người báo cáo: {report.reporterName} (ID:{" "}
                      {report.reporterId})
                    </Text>
                    {renderReportStatus(report.status)}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">
                      {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </Text>
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <Paragraph>{report.content}</Paragraph>

                  {report.imageUrls && report.imageUrls.length > 0 && (
                    <div>
                      <Divider style={{ margin: "8px 0" }} />
                      <Text strong>Hình ảnh đính kèm:</Text>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          marginTop: 8,
                        }}
                      >
                        {report.imageUrls.map((url, index) => (
                          <Image
                            key={index}
                            src={url}
                            alt={`Ảnh minh chứng ${index + 1}`}
                            style={{
                              width: 150,
                              height: 150,
                              objectFit: "cover",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Empty description="Không có chi tiết báo cáo nào" />
            )}

            {reportDetails.length > 0 && (
              <div style={{ textAlign: "center", margin: "16px 0" }}>
                <Pagination
                  current={reportsPagination.current}
                  pageSize={reportsPagination.pageSize}
                  total={reportsPagination.total}
                  onChange={handleReportsPageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </Spin>
      </Modal>
    </Box>
  );
};

export default ReportedPostsManagement;
