import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FileText, LayoutDashboard, BriefcaseBusiness, User, LogOut, Menu, X, Shield, ClipboardList } from "lucide-react";

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("currentUser") || "null");
    setUser(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setOpen(false);
  };

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/builder", label: "Resume Builder", icon: FileText },
    { to: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
    { to: "/saved-jobs", label: "Saved Jobs", icon: BriefcaseBusiness },
    { to: "/applications", label: "My Applications", icon: ClipboardList },
  ];

  const extraLinks = [];
  if (user?.role === "recruiter") {
    extraLinks.push({ to: "/recruiter", label: "Recruiter Panel", icon: BriefcaseBusiness });
  }
  if (user?.role === "admin") {
    extraLinks.push({ to: "/admin", label: "Admin Panel", icon: Shield });
  }

  // ✅ Profile Image ya Icon dikhane ke liye helper
  const ProfileAvatar = ({ size = 24 }) => {
    if (user?.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt="Profile"
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      );
    }
    return <User size={size} className="text-gray-400" />;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white shadow-soft">
            <FileText size={20} />
          </span>
          <div>
            <div className="text-lg font-black tracking-tight text-gray-900">CareerCraft</div>
            <div className="text-[10px] font-bold uppercase tracking-[.18em] text-gray-400">
              Resume • Jobs
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold ${
                  isActive ? "bg-indigo-50 text-brand" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          {extraLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-brand hover:bg-indigo-100"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {/* ✅ Yahan Profile Pic dikhegi */}
              <ProfileAvatar size={24} />
              {user?.name || "Profile"}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-gray-200 p-2 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-5 py-3 md:hidden">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {extraLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-3 font-semibold text-brand"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ProfileAvatar size={20} />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 font-semibold text-red-600 hover:bg-red-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;