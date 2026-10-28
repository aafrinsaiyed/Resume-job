// ✅ UPDATED:
//  - /admin/jobs/add and /admin/jobs/edit/:id REMOVED (admins can't manage jobs)
//  - /admin/recruiters → AllRecruiters (list)
//  - /admin/recruiters/add → AddRecruiter (form)
//  - /admin/profile → AdminProfile (new)
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Components/Userpanel/Home";
import Login from "./Components/Authentication/Login";
import Registration from "./Components/Authentication/Registration";
import ForgotPassword from "./Components/Authentication/Forgotpassword";
import Dashboard from "./Components/Userpanel/Dashboard";
import ResumeBuilder from "./Components/Userpanel/ResumeBuilder";
import Preview from "./Components/Userpanel/Preview";
import TemplateSelect from "./Components/Userpanel/TemplateSelect";
import UserProfile from "./Components/Userpanel/UserProfile";
import JobOpportunities from "./Components/Userpanel/JobOpportunities";
import JobDetails from "./Components/Userpanel/JobDetails";
import SavedJobs from "./Components/Userpanel/SavedJobs";
import ApplicationTracking from "./Components/Userpanel/ApplicationTracking";
import NotFound from "./Components/Userpanel/NotFound";
import RecruiterProfile from "./Components/RecruiterPanel/RecruiterProfile";



// Admin
import AdminDashboard from "./Components/Admin/AdminDashboard";
import ManageJobs from "./Components/Admin/ManageJobs";
import ManageUsers from "./Components/Admin/ManageUsers";
import JobApplications from "./Components/Admin/JobApplications";
import AddRecruiter from "./Components/Admin/AddRecruiter";
import AllRecruiters from "./Components/Admin/AllRecruiters";
import AdminProfile from "./Components/Admin/AdminProfile";

// Recruiter
import RecruiterDashboard from "./Components/RecruiterPanel/RecruiterDashboard";
import MyJobs from "./Components/RecruiterPanel/MyJobs";
import JobForm from "./Components/RecruiterPanel/JobForm";
import JobApplicants from "./Components/RecruiterPanel/JobApplicants";
import CandidateDetail from "./Components/RecruiterPanel/CandidateDetail";
import HiringPipeline from "./Components/RecruiterPanel/HiringPipeline";


const RoleRoute = ({ children, allowed }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    user = null;
  }

  const token = localStorage.getItem("token");
  const role = String(user?.role || "").toLowerCase();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowed && !allowed.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "recruiter") {
      return <Navigate to="/recruiter" replace />;
    }

    if (role === "user") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  useEffect(() => {
    console.log("🚀 App mounted");
  }, []);

  return (
    <div className="min-h-screen bg-soft">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User */}
        <Route path="/dashboard" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><Dashboard /></RoleRoute>} />
        <Route path="/builder" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><ResumeBuilder /></RoleRoute>} />
        <Route path="/templates" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><TemplateSelect /></RoleRoute>} />
        <Route path="/preview" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><Preview /></RoleRoute>} />
        <Route path="/profile" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><UserProfile /></RoleRoute>} />
        <Route path="/jobs" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><JobOpportunities /></RoleRoute>} />
        <Route path="/jobs/:id" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><JobDetails /></RoleRoute>} />
        <Route path="/saved-jobs" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><SavedJobs /></RoleRoute>} />
        <Route path="/applications" element={<RoleRoute allowed={["user", "admin", "recruiter"]}><ApplicationTracking /></RoleRoute>} />

        {/* ✅ Admin — job editing removed */}
        <Route path="/admin" element={<RoleRoute allowed={["admin"]}><AdminDashboard /></RoleRoute>} />
        <Route path="/admin/jobs" element={<RoleRoute allowed={["admin"]}><ManageJobs /></RoleRoute>} />
        <Route path="/admin/users" element={<RoleRoute allowed={["admin"]}><ManageUsers /></RoleRoute>} />
        <Route path="/admin/recruiters" element={<RoleRoute allowed={["admin"]}><AllRecruiters /></RoleRoute>} />
        <Route path="/admin/recruiters/add" element={<RoleRoute allowed={["admin"]}><AddRecruiter /></RoleRoute>} />
        <Route path="/admin/applications" element={<RoleRoute allowed={["admin"]}><JobApplications /></RoleRoute>} />
        <Route path="/admin/profile" element={<RoleRoute allowed={["admin"]}><AdminProfile /></RoleRoute>} />

        {/* Recruiter */}
        <Route path="/recruiter" element={<RoleRoute allowed={["recruiter"]}><RecruiterDashboard /></RoleRoute>} />
        <Route path="/recruiter/jobs" element={<RoleRoute allowed={["recruiter"]}><MyJobs /></RoleRoute>} />
        <Route path="/recruiter/jobs/new" element={<RoleRoute allowed={["recruiter"]}><JobForm /></RoleRoute>} />
        <Route path="/recruiter/jobs/edit/:id" element={<RoleRoute allowed={["recruiter"]}><JobForm /></RoleRoute>} />
        <Route path="/recruiter/jobs/:jobId/applicants" element={<RoleRoute allowed={["recruiter"]}><JobApplicants /></RoleRoute>} />
        <Route path="/recruiter/profile" element={<RoleRoute allowed={["recruiter"]}><RecruiterProfile /></RoleRoute>} />
        <Route path="/recruiter/pipeline" element={<RoleRoute allowed={["recruiter"]}><HiringPipeline /></RoleRoute>} />
        <Route path="/recruiter/candidate/:userId" element={<RoleRoute allowed={["recruiter"]}><CandidateDetail /></RoleRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </div>
  );
}

export default App;