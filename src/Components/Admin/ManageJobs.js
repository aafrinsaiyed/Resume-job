// ✅ UPDATED:
//  - Actions column removed
//  - "+ Add Job" top-bar button removed
//  - Admin is now read-only for jobs (view only)
import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/get-jobs")
      .then((res) => setJobs(res.data.data || []))
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <Briefcase />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">
                Admin
              </p>
              <h1 className="text-3xl font-black">Manage Jobs</h1>
              <p className="text-sm text-gray-500 mt-1">
                Read-only view — jobs are managed by recruiters.
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
                    <th className="p-5">Job</th>
                    <th className="p-5">Company</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Type</th>
                    <th className="p-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length ? (
                    jobs.map((j) => (
                      <tr key={j._id || j.id} className="border-t border-gray-100">
                        <td className="p-5 font-black">{j.title}</td>
                        <td className="p-5">{j.company}</td>
                        <td className="p-5">{j.location}</td>
                        <td className="p-5">{j.type}</td>
                        <td className="p-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              (j.status || "open") === "open"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {j.status || "open"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500">
                        No jobs posted yet.
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

export default ManageJobs;