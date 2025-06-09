import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/patient/Home";
import Login from "./pages/patient/Login";
import Register from "./pages/patient/Register";
import DoctorDetail from "./pages/patient/DoctorDetail";
import TeamOfDoctors from "./pages/patient/TeamOfDoctors";
import Profile from "./pages/patient/Profile";
import ViewProfile from "./pages/patient/ViewProfile";
import UserDetail from "./pages/patient/UserDetail";
import AppointmentHistory from "./pages/patient/AppointmentHistory";
import ScheduleManagement from "./pages/doctor/ScheduleManagement";
import PatientManagement from "./pages/doctor/PatientManagement";
import AppointmentManagement from "./pages/doctor/AppointmentManagement";
import PrescriptionManagement from "./pages/doctor/PrescriptionManagement";
import ManageAppointmentHistory from "./pages/doctor/ManageAppointmentHistory";
import EvaluateForm from "./components/patient/evaluateForm";
import Layout from "./components/doctor/Layout";
import { ToastContainer } from "react-toastify";
import PatientDetail from "./pages/doctor/PatientDetail";
import AppointmentDetail from "./pages/doctor/AppointmentDetail";
import AppointmentList from "./pages/patient/AppointmentList";
import AppointmentDetailPatient from "./pages/patient/AppointmentDetailPatient";
import Authenticate from "./pages/patient/Authentication";
import NotFound from "./pages/patient/NotFound";
import { getRole } from "./service/otherService/localStorage";
import AdminDashboard from "./pages/admin/Dashboard";
import DoctorDetailAdmin from "./pages/admin/DoctorDetailAdmin";
import PatientDetailAdmin from "./pages/admin/PatientDetailAdmin";
import StatisticsPage from "./pages/admin/StatisticsPage";
import PostPage from "./pages/social-network/PostPage";
import CreatePostPage from "./pages/social-network/CreatePostPage";
import SavedPostsPage from "./pages/social-network/SavedPostsPage";
import FollowPage from "./pages/social-network/FollowPage";
import VideoCall from "./pages/patient/VideoCall";
import Chat from "./pages/patient/Chat";
import ChatDoctor from "./pages/doctor/Chat";

// News pages
import NewsHomePage from "./pages/news/HomePage";
import NewsDetailPage from "./pages/news/DetailPage";
import CreateNewsPage from "./pages/news/CreatePage";
import EditNewsPage from "./pages/news/EditPage";
import SavedNewsPage from "./pages/news/SavedNewsPage";
import MyArticlesPage from "./pages/news/MyArticlesPage";
import PostDetailPage from "./pages/social-network/PostDetailPage";
import NewsDetailUnrestrictedPage from "./pages/news/NewsDetailUnrestrictedPage";

// New news management pages
import DoctorNewsManagementPage from "./pages/doctor/NewsManagementPage";
import DoctorNewsReviewPage from "./pages/doctor/NewsReviewPage";
import AdminNewsManagementPage from "./pages/admin/NewsManagementPage";
import DoctorArticlesPage from "./pages/news/DoctorArticlesPage";

const PrivateRoute = ({ children }) => {
  const role = getRole();

  if (!role || role !== "DOCTOR") {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const role = getRole();

  if (!role || role !== "ADMIN") {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

const DoctorOrAdminRoute = ({ children }) => {
  const role = getRole();

  if (!role || (role !== "DOCTOR" && role !== "ADMIN")) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/doctor-detail" element={<DoctorDetailAdmin />} />
      <Route path="/admin/patient-detail" element={<PatientDetailAdmin />} />
      <Route
        path="/admin/news-management"
        element={
          <AdminRoute>
            <AdminNewsManagementPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/statistics/:statType"
        element={
          <AdminRoute>
            <StatisticsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/statistics"
        element={
          <AdminRoute>
            <StatisticsPage />
          </AdminRoute>
        }
      />

      <Route index element={<Navigate to="/home" replace />} />
      <Route path="/evaluate" element={<EvaluateForm />} />
      <Route path="/authenticate" element={<Authenticate />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor/:id" element={<DoctorDetail />} />
      <Route path="/video-call/:doctorId" element={<VideoCall />} />
      <Route path="/team-of-doctors" element={<TeamOfDoctors />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:userId" element={<ViewProfile />} />
      <Route path="/user-detail" element={<UserDetail />} />
      <Route path="/appointment-list" element={<AppointmentList />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route
        path="/appointment-list/:id"
        element={<AppointmentDetailPatient />}
      />
      <Route path="/appointment-history" element={<AppointmentHistory />} />

      <Route
        path="/doctor/manage-appointment-history"
        element={
          <PrivateRoute>
            <ManageAppointmentHistory />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor/prescription-management"
        element={
          <PrivateRoute>
            <PrescriptionManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor/news-management"
        element={
          <PrivateRoute>
            <DoctorNewsManagementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor/news-review"
        element={
          <PrivateRoute>
            <DoctorNewsReviewPage />
          </PrivateRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route
          path="/doctor/schedule-management"
          element={<ScheduleManagement />}
        />
        <Route
          path="/doctor/patient-management"
          element={<PatientManagement />}
        />
        <Route
          path="/doctor/appointment-management"
          element={<AppointmentManagement />}
        />
        <Route
          path="/doctor/patient-management/:id"
          element={<PatientDetail />}
        />
        <Route
          path="/doctor/appointment-management/:id"
          element={<AppointmentDetail />}
        />
        <Route path="/doctor_chat" element={<ChatDoctor />} />
      </Route>

      {/* News Routes - Order matters: specific routes first, then dynamic routes */}
      <Route path="/news" element={<NewsHomePage />} />
      <Route
        path="/news/create"
        element={
          <PrivateRoute>
            <CreateNewsPage />
          </PrivateRoute>
        }
      />
      <Route path="/news/saved" element={<SavedNewsPage />} />
      <Route
        path="/news/my-articles"
        element={
          <PrivateRoute>
            <MyArticlesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/news/edit/:id"
        element={
          <PrivateRoute>
            <EditNewsPage />
          </PrivateRoute>
        }
      />
      <Route path="/news/doctor/:doctorId" element={<DoctorArticlesPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />

      {/* Restricted News routes for doctors and admins */}
      <Route
        path="/news/review/:id"
        element={
          <DoctorOrAdminRoute>
            <NewsDetailUnrestrictedPage />
          </DoctorOrAdminRoute>
        }
      />

      {/* Social Network Routes */}
      <Route path="/social-network" element={<PostPage />} />
      <Route path="/social-network/post/:postId" element={<PostDetailPage />} />
      <Route path="/social-network/create-post" element={<CreatePostPage />} />
      <Route path="/social-network/saved-posts" element={<SavedPostsPage />} />
      <Route path="/social-network/follow" element={<FollowPage />} />

      <Route path="/chat/:doctorId" element={<Chat />} />
    </Routes>
  );
};

export default AppRouter;
