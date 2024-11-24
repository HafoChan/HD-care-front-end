import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/evaluate" element={<EvaluateForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route index element={<Register />} />
      <Route path="/doctor/:id" element={<DoctorDetail />} />
      <Route path="/team-of-doctors" element={<TeamOfDoctors />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/user-detail" element={<UserDetail />} />

      <Route path="/doctor/manage-appointment-history" element={<ManageAppointmentHistory />} />
      <Route path="/doctor/prescription-management" element={<PrescriptionManagement />} />

      <Route element={<Layout />}>  {/* Không cần path="/" ở đây */}
        <Route path="/appointment-history" element={<AppointmentHistory />} />
        <Route path="/doctor/schedule-management" element={<ScheduleManagement />} />
        <Route path="/doctor/patient-management" element={<PatientManagement />} />
        <Route path="/doctor/appointment-management" element={<AppointmentManagement />} />
      </Route>

    </Routes>
  );
};

export default AppRouter; 