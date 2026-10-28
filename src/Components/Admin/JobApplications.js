// ✅ UPDATED:
//  - Actions/Delete column removed
//  - Status is now a read-only colored badge (no dropdown)
//  - Admin cannot change application status
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const StatusBadge = ({ status }) => {
  const map = {
    Pending: "bg-yellow-50 text-yellow-600",
    Shortlisted: "bg-blue-50 text-blue-600",
    Interview: "bg-purple-50 text-purple-600",
    Hired: "bg-emerald-50 text-emerald-600",
    Rejected: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

const JobApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/get-applications")
      .then((res) => setApps(res.data.data || []))
      .catch((err) => console.error("Error fetching applications:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <ClipboardList />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">
                Admin
              </p>
              <h1 className="text-3xl font-black">Job Applications</h1>
              <p className="text-sm text-gray-500 mt-1">
                Read-only — statuses are managed by recruiters.
              </p>
            </div>
          </div>
          <BackButton fallback="/admin" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500 font-semibold">Loading...</div>
        ) : (
          <div className="mt-7 overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="p-5">Candidate</th>
                    <th className="p-5">Job</th>
                    <th className="p-5">Company</th>
                    <th className="p-5">Applied</th>
                    <th className="p-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.length ? (
                    apps.map((a) => (
                      <tr key={a._id || a.id} className="border-t border-gray-100">
                        <td className="p-5 font-bold">{a.candidate}</td>
                        <td className="p-5">{a.jobTitle}</td>
                        <td className="p-5">{a.company}</td>
                        <td className="p-5">{a.appliedAt}</td>
                        <td className="p-5">
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500">
                        No applications received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default JobApplications;