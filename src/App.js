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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/evaluate" element={<EvaluateForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route index element={<Register />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />
        <Route path="/team-of-doctors" element={<TeamOfDoctors />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-detail" element={<UserDetail />} />
        <Route path="/appointment-history" element={<AppointmentHistory />} />

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
          path="/doctor/prescription-management"
          element={<PrescriptionManagement />}
        />
        <Route
          path="/doctor/manage-appointment-history"
          element={<ManageAppointmentHistory />}
        />
      </Routes>
      <ToastContainer />
    </Router>
    // <div className="container" style={{ width: "600px" }}>
    //   <div style={{ margin: "20px" }}>
    //     <h3>bezkoder.com</h3>
    //     <h4>React upload Files</h4>
    //   </div>

    //   <UploadFiles />
    // </div>
  );
};

export default App;
