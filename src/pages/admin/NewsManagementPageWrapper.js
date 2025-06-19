import React from "react";
import { Layout } from "antd";
import Sidebar from "../../components/admin/Sidebar";
import NewsManagementPage from "./NewsManagementPage";
import { remove } from "../../service/otherService/localStorage";

const { Content } = Layout;

const NewsManagementPageWrapper = () => {
  const handleLogout = () => {
    console.log("Logging out...");
    remove();
    window.location.href = "/login";
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey="news" onLogout={handleLogout} />
      <Layout className="site-layout">
        <Content
          style={{
            margin: "0",
            padding: 0,
            minHeight: "100%",
            background: "#f8f9fa",
          }}
        >
          <NewsManagementPage />
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewsManagementPageWrapper;
