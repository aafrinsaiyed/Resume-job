// ✅ ENTERPRISE PROFESSIONAL DASHBOARD
import { useEffect, useState } from "react";
import ChatBot from "../ChatBot";
import { Link, useNavigate } from "react-router-dom";
import {
  Users, Briefcase, ClipboardList, ShieldAlert, LogOut, ArrowRight,
  UserPlus, ListChecks, UserRound, TrendingUp, Activity, Building2,
  CheckCircle2, Clock, ChevronRight, BarChart3
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import api from "../../utils/api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    usersCount: 0, jobsCount: 0, applicationsCount: 0, recruitersCount: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topRecruiters, setTopRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  useEffect(() => {
    if (!adminUser || adminUser.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [usersRes, jobsRes, appsRes] = await Promise.all([
          api.get("/get-user"),
          api.get("/get-jobs"),
          api.get("/get-applications"),
        ]);

        const users = usersRes.data?.data || [];
        const jobs = jobsRes.data?.data || [];
        const apps = appsRes.data?.data || [];
        const recruiters = users.filter((u) => u.role === "recruiter");

        setStats({
          usersCount: users.filter((u) => (u.role || "user") === "user").length,
          jobsCount: jobs.length,
          applicationsCount: apps.length,
          recruitersCount: recruiters.length,
        });

        setRecentUsers(users.slice(-5).reverse());
        setRecentApps(apps.slice(0, 5));

        // ✅ Status breakdown for Pie Chart
        const statusCounts = { Pending: 0, Shortlisted: 0, Interview: 0, Hired: 0, Rejected: 0 };
        apps.forEach((a) => { if (statusCounts[a.status] !== undefined) statusCounts[a.status]++; });
        setStatusData(
          Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
        );

        // ✅ Top Recruiters (based on job count)
        const recruiterStats = recruiters.map((r) => ({
          ...r,
          jobCount: jobs.filter((j) => String(j.employerId) === String(r._id)).length,
        })).sort((a, b) => b.jobCount - a.jobCount).slice(0, 4);
        setTopRecruiters(recruiterStats);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Professional Loading Skeleton
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10 space-y-6">
        <div className="h-40 rounded-[2rem] bg-gray-100 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-[2rem] bg-gray-100 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 rounded-[2rem] bg-gray-100 animate-pulse" />
          <div className="h-80 rounded-[2rem] bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      
      {/* ✅ HERO HEADER */}
      <div className="rounded-[2rem] bg-gradient-to-br from-indigo-950 via-brand to-violet-600 p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-white/5" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-200 uppercase tracking-widest">
            <ShieldAlert size={14} /> Control Center
          </div>
          <h1 className="mt-3 text-4xl font-black">Welcome, {adminUser?.name || "Admin"} 👋</h1>
          <p className="mt-3 max-w-xl text-indigo-100">
            Manage users, recruiters, jobs, and applications from one central hub.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/admin/recruiters/add" className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-brand hover:bg-indigo-50 shadow-lg">
              <UserPlus size={18} /> Add Recruiter
            </Link>
            <Link to="/admin/applications" className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-bold hover:bg-white/20 border border-white/20">
              <ClipboardList size={18} /> Review Applications
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-indigo-200 uppercase">Platform Health</p>
            <p className="text-2xl font-black">Good</p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
            <CheckCircle2 size={28} />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>
      )}

      {/* ✅ STAT CARDS */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Total Users" value={stats.usersCount} Icon={Users} color="from-emerald-500 to-emerald-600" trend="+12%" />
        <StatCard label="Recruiters" value={stats.recruitersCount} Icon={UserPlus} color="from-blue-500 to-blue-600" trend="+5%" />
        <StatCard label="Active Jobs" value={stats.jobsCount} Icon={Briefcase} color="from-purple-500 to-purple-600" trend="+8%" />
        <StatCard label="Applications" value={stats.applicationsCount} Icon={ClipboardList} color="from-amber-500 to-amber-600" trend="+23%" />
      </div>

      {/* ✅ CHARTS ROW */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        
        {/* Bar Chart - Applications by Status */}
        <div className="lg:col-span-2 rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-brand" size={20} />
              <h2 className="text-lg font-black">Application Status Overview</h2>
            </div>
            <Link to="/admin/applications" className="text-xs font-bold text-brand flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Platform Distribution */}
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <h2 className="text-lg font-black mb-5">Platform Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Users", value: stats.usersCount },
                    { name: "Recruiters", value: stats.recruitersCount },
                    { name: "Jobs", value: stats.jobsCount },
                  ]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value"
                >
                  {[0, 1, 2].map((i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ✅ RECENT ACTIVITY */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        
        {/* Recent Users */}
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="text-emerald-600" size={18} />
              <h2 className="font-black">Recent Users</h2>
            </div>
            <Link to="/admin/users" className="text-xs font-bold text-brand">View →</Link>
          </div>
          <div className="space-y-2">
            {recentUsers.length ? recentUsers.map((u) => (
              <div key={u._id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-sm">
                  {u.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 py-4 text-sm">No users yet.</p>}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={18} />
              <h2 className="font-black">Recent Applications</h2>
            </div>
            <Link to="/admin/applications" className="text-xs font-bold text-brand">View →</Link>
          </div>
          <div className="space-y-2">
            {recentApps.length ? recentApps.map((a) => (
              <div key={a._id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-sm">
                  {a.candidate?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{a.candidate}</p>
                  <p className="text-xs text-gray-500 truncate">{a.jobTitle}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            )) : <p className="text-center text-gray-500 py-4 text-sm">No applications yet.</p>}
          </div>
        </div>

        {/* Top Recruiters */}
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="text-blue-600" size={18} />
              <h2 className="font-black">Top Recruiters</h2>
            </div>
            <Link to="/admin/recruiters" className="text-xs font-bold text-brand">View →</Link>
          </div>
          <div className="space-y-2">
            {topRecruiters.length ? topRecruiters.map((r, i) => (
              <div key={r._id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm">
                  {r.companyLogo ? <img src={r.companyLogo} alt="" className="h-full w-full rounded-full object-cover" /> : (r.name?.charAt(0) || "?")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{r.name}</p>
                  <p className="text-xs text-gray-500 truncate">{r.company || "No company"}</p>
                </div>
                <span className="text-xs font-black text-brand bg-indigo-50 px-2 py-1 rounded-full">{r.jobCount} jobs</span>
              </div>
            )) : <p className="text-center text-gray-500 py-4 text-sm">No recruiters yet.</p>}
          </div>
        </div>
      </div>

      {/* ✅ QUICK ACTIONS */}
      <h2 className="text-xl font-black text-gray-900 mb-5">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ModuleCard to="/admin/jobs" Icon={Briefcase} title="Manage Jobs" desc="View all jobs posted by recruiters." action="Open" />
        <ModuleCard to="/admin/users" Icon={Users} title="Manage Users" desc="View registered candidates." action="Open" />
        <ModuleCard to="/admin/recruiters" Icon={ListChecks} title="All Recruiters" desc="View, edit, or remove recruiter accounts." action="Open" />
        <ModuleCard to="/admin/applications" Icon={ClipboardList} title="Job Applications" desc="Track statuses set by recruiters." action="Review" />
        <ModuleCard to="/admin/profile" Icon={UserRound} title="My Profile" desc="Update your admin account details." action="Open" />
        <ModuleCard to="/admin/recruiters/add" Icon={UserPlus} title="Add Recruiter" desc="Create a new recruiter account." action="Create" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, Icon, color, trend }) => (
  <div className="rounded-[2rem] bg-white p-6 shadow-soft relative overflow-hidden group hover:shadow-xl transition">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-black text-gray-900 mt-2">{value}</h3>
        <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
          <TrendingUp size={12} /> {trend} this month
        </p>
      </div>
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon size={22} />
      </div>
            <ChatBot panel="admin" />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Pending: "bg-yellow-50 text-yellow-600",
    Shortlisted: "bg-blue-50 text-blue-600",
    Interview: "bg-purple-50 text-purple-600",
    Hired: "bg-emerald-50 text-emerald-600",
    Rejected: "bg-red-50 text-red-600",
  };
  return <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${map[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
};

const ModuleCard = ({ to, Icon, title, desc, action }) => (
  <Link to={to} className="rounded-[2rem] bg-white p-6 shadow-soft flex flex-col justify-between transition hover:shadow-lg group border border-transparent hover:border-indigo-100">
    <div>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-brand mb-4 group-hover:bg-brand group-hover:text-white transition">
        <Icon size={22} />
      </span>
      <h3 className="text-lg font-black text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
    <div className="mt-6 flex items-center gap-1 text-sm font-bold text-brand">
      {action} <ArrowRight size={16} />
    </div>
  </Link>
);

export default AdminDashboard;