import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ClipboardList, Eye } from "lucide-react";
import RecruiterNavbar from "./RecruiterNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const statusOptions = ["Pending", "Shortlisted", "Interview", "Hired", "Rejected"];

const JobApplicants = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get(`/recruiter/jobs/${jobId}/applicants`);
      setJob(res.data.data.job);
      setApps(res.data.data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/recruiter/applications/${appId}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <RecruiterNavbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <ClipboardList />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">
                Applicants
              </p>
              <h1 className="text-3xl font-black">
                {job?.title || "Job Applicants"}
              </h1>
              {job?.company && (
                <p className="text-sm text-gray-500">{job.company}</p>
              )}
            </div>
          </div>
          <BackButton fallback="/recruiter/jobs" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500 font-semibold">
            Loading applicants...
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="p-5">Candidate</th>
                    <th className="p-5">Applied</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.length ? (
                    apps.map((a) => (
                      <tr key={a._id} className="border-t border-gray-100">
                        <td className="p-5 font-bold">{a.candidate}</td>
                        <td className="p-5">{a.appliedAt}</td>
                        <td className="p-5">
                          <select
                            value={a.status}
                            onChange={(e) => updateStatus(a._id, e.target.value)}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold focus:border-brand outline-none"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-5">
                          <Link
                            to={`/recruiter/candidate/${a.userId}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-brand hover:bg-indigo-100"
                          >
                            <Eye size={14} /> View Resume
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-500">
                        No applicants yet.
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

export default JobApplicants;