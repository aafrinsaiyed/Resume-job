// ✅ PATCHED:
//  - Uses `api` helper
//  - Adds "Role" column
//  - Adds filter buttons (All / Users / Recruiters / Admins)
//  - Same UI, adds small role badges
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const roleBadge = (role) => {
  const map = {
    admin: "bg-purple-50 text-purple-600",
    recruiter: "bg-blue-50 text-blue-600",
    user: "bg-emerald-50 text-emerald-600",
  };
  return map[role || "user"] || "bg-gray-100 text-gray-600";
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/get-user")
      .then((res) => setUsers(res.data.data || []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const filtered = filter === "all" ? users : users.filter((u) => (u.role || "user") === filter);

  return (
    <>
      <AdminNavbar />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <Users />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">Admin</p>
              <h1 className="text-3xl font-black">Manage Users</h1>
            </div>
          </div>
          <BackButton fallback="/admin" />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["user", "Users"],
            ["recruiter", "Recruiters"],
            ["admin", "Admins"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                filter === key
                  ? "bg-brand text-white"
                  : "bg-white text-gray-600 hover:bg-indigo-50 hover:text-brand shadow-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Company</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((u, idx) => (
                    <tr key={u._id || idx} className="border-t border-gray-100">
                      <td className="p-5 font-bold">{u.name}</td>
                      <td className="p-5">{u.email}</td>
                      <td className="p-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${roleBadge(
                            u.role
                          )}`}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="p-5">{u.company || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-5 text-center text-gray-500">
                      No users to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default ManageUsers;