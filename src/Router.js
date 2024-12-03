import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/patient/Home";
import Login from "./pages/patient/Login";
import Register from "./pages/patient/Register";
import DoctorDetail from "./pages/patient/DoctorDetail";
import TeamOfDoctors from "./pages/patient/TeamOfDoctors";
import Profile from "./pages/patient/Profile";
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

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || user.role !== 'DOCTOR') {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/evaluate" element={<EvaluateForm />} />
      <Route path="/authenticate" element={<Authenticate />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor/:id" element={<DoctorDetail />} />
      <Route path="/team-of-doctors" element={<TeamOfDoctors />} />
      <Route path="/profile" element={<Profile />} />
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
      </Route>
    </Routes>
  );
};

export default AppRouter;
