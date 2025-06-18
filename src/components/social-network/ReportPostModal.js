import React, { useState } from "react";
import { Modal, Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UploadService from "../../service/otherService/upload";
import { reportPost } from "../../api/socialNetworkApi";

const { TextArea } = Input;

const ReportPostModal = ({ visible, onCancel, postId, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let imageUrls = [];

      // Upload images if any
      if (fileList.length > 0) {
        setUploading(true);
        try {
          const response = await UploadService.upload(fileList, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
          });
          imageUrls = response.result;
          setUploading(false);
        } catch (error) {
          console.error("Upload error:", error);
          message.error("Không thể tải lên hình ảnh. Vui lòng thử lại.");
          setUploading(false);
          setLoading(false);
          return;
        }
      }

      // Submit report
      await reportPost(postId, {
        content: values.content,
        imageUrls: imageUrls,
      });

      message.success("Báo cáo đã được gửi thành công");
      form.resetFields();
      setFileList([]);
      onSuccess && onSuccess();
      onCancel();
    } catch (error) {
      console.error("Report error:", error);
      message.error("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // Check file type
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ có thể tải lên file hình ảnh!");
        return Upload.LIST_IGNORE;
      }

      // Check file size (limit to 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Kích thước hình ảnh phải nhỏ hơn 5MB!");
        return Upload.LIST_IGNORE;
      }

      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title="Báo cáo bài viết"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Gửi báo cáo
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="content"
          label="Lý do báo cáo"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập lý do báo cáo",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Mô tả chi tiết lý do báo cáo bài viết này"
          />
        </Form.Item>

        <Form.Item label="Hình ảnh minh chứng (nếu có)">
          <Upload {...uploadProps} listType="picture" multiple maxCount={3}>
            <Button icon={<UploadOutlined />} disabled={uploading}>
              {uploading ? `Đang tải lên ${progress}%` : "Chọn hình ảnh"}
            </Button>
          </Upload>
          <div style={{ marginTop: 8 }}>
            <small>* Tối đa 3 hình ảnh, mỗi hình dưới 5MB</small>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportPostModal;
