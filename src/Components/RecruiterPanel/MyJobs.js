import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import RecruiterNavbar from "./RecruiterNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/recruiter/jobs");
      setJobs(res.data.data || []);
    } catch (err) {
      console.error("Error fetching my jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const removeJob = async (id) => {
    if (!window.confirm("Delete this job and all its applications?")) return;
    try {
      await api.delete(`/recruiter/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  return (
    <>
      <RecruiterNavbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand">
              Recruiter
            </p>
            <h1 className="text-3xl font-black">My Jobs</h1>
          </div>
          <div className="flex items-center gap-3">
            <BackButton fallback="/recruiter" />
            <Link
              to="/recruiter/jobs/new"
              className="flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white"
            >
              <Plus size={17} /> Post Job
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500 font-semibold">
            Loading...
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="p-5">Job</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Type</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Applicants</th>
                    <th className="p-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length ? (
                    jobs.map((j) => (
                      <tr key={j._id} className="border-t border-gray-100">
                        <td className="p-5">
                          <p className="font-black">{j.title}</p>
                          <p className="text-xs text-gray-500">{j.company}</p>
                        </td>
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
                        <td className="p-5">
                          <Link
                            to={`/recruiter/jobs/${j._id}/applicants`}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-brand hover:bg-indigo-100"
                          >
                            <Users size={14} /> {j.applicantCount || 0} applicants
                          </Link>
                        </td>
                        <td className="p-5">
                          <Link
                            to={`/recruiter/jobs/edit/${j._id}`}
                            className="mr-2 inline-block rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => removeJob(j._id)}
                            className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-gray-500">
                        You haven't posted any jobs yet.{" "}
                        <Link to="/recruiter/jobs/new" className="font-bold text-brand">
                          Post your first job →
                        </Link>
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

export default MyJobs;