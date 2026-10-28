import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import RecruiterNavbar from "./RecruiterNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const COLUMNS = [
  { key: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { key: "Shortlisted", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "Interview", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "Hired", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
];

const HiringPipeline = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await api.get("/recruiter/applicants");
      setApps(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/recruiter/applications/${appId}/status`, { status });
      fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <RecruiterNavbar />
      <main className="mx-auto max-w-[1400px] px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand">
              Recruiter
            </p>
            <h1 className="text-3xl font-black">Hiring Pipeline</h1>
            <p className="mt-1 text-gray-500">
              Drag-free kanban — use the dropdown on each card to move a candidate.
            </p>
          </div>
          <BackButton fallback="/recruiter" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500 font-semibold">Loading...</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-5">
            {COLUMNS.map((col) => {
              const colApps = apps.filter((a) => a.status === col.key);
              return (
                <div key={col.key} className="rounded-2xl bg-white p-4 shadow-soft">
                  <div
                    className={`mb-3 rounded-xl border px-3 py-2 text-center text-sm font-black uppercase ${col.color}`}
                  >
                    {col.key} ({colApps.length})
                  </div>
                  <div className="space-y-2">
                    {colApps.map((a) => (
                      <div
                        key={a._id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                      >
                        <p className="font-bold text-sm">{a.candidate}</p>
                        <p className="text-xs text-gray-500 mt-1">{a.jobTitle}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.appliedAt}</p>

                        <div className="mt-2 flex gap-1">
                          <select
                            value={a.status}
                            onChange={(e) => updateStatus(a._id, e.target.value)}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-bold outline-none focus:border-brand"
                          >
                            {COLUMNS.map((c) => (
                              <option key={c.key} value={c.key}>
                                {c.key}
                              </option>
                            ))}
                          </select>
                          <Link
                            to={`/recruiter/candidate/${a.userId}`}
                            className="grid place-items-center rounded-lg bg-indigo-50 px-2 text-brand hover:bg-indigo-100"
                            title="View resume"
                          >
                            <Eye size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                    {colApps.length === 0 && (
                      <p className="text-center text-xs text-gray-400 py-6">—</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default HiringPipeline;