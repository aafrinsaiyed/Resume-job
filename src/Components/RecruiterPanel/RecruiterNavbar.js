// ✅ UPDATED: Added Profile link + Profile Picture in navbar
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  KanbanSquare,
  LogOut,
  UserRound,
} from "lucide-react"; // 👈 UserRound import kiya

const RecruiterNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ LocalStorage se recruiter user nikaalein
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  const links = [
    { to: "/recruiter", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/recruiter/jobs", label: "My Jobs", icon: <BriefcaseBusiness size={18} /> },
    { to: "/recruiter/pipeline", label: "Pipeline", icon: <KanbanSquare size={18} /> },
    { to: "/recruiter/profile", label: "Profile", icon: <UserRound size={18} /> }, // ✅ NAYA LINK
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="mx-auto max-w-7xl px-5 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/80 p-2 shadow-soft backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-3 px-3 text-sm font-black uppercase tracking-wider text-brand">
            Recruiter
          </span>
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-brand"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
        
        {/* ✅ Profile Pic + Logout Section */}
        <div className="flex items-center gap-2">
          <Link
            to="/recruiter/profile"
            className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-gray-50"
          >
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-brand">
                <UserRound size={16} />
              </div>
            )}
            <span className="text-sm font-bold text-gray-700 hidden sm:block">
              {user?.name || "Recruiter"}
            </span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default RecruiterNavbar;