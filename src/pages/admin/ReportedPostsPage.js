import React from "react";
import { Layout } from "antd";
import ReportedPostsManagement from "../../components/admin/ReportedPostsManagement";
import Sidebar from "../../components/admin/Sidebar";
import { remove } from "../../service/otherService/localStorage";

const { Content } = Layout;

const ReportedPostsPage = () => {
  const handleLogout = () => {
    console.log("Logging out...");
    remove();
    window.location.href = "/login";
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey="reported-posts" onLogout={handleLogout} />
      <Layout className="site-layout">
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100%",
            background: "#fff",
          }}
        >
          <ReportedPostsManagement />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ReportedPostsPage;
