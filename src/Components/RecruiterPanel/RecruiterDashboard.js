
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatBot from "../ChatBot";
import {
  Briefcase,
  Users,
  UserCheck,
  CheckCircle,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import RecruiterNavbar from "./RecruiterNavbar";
import api from "../../utils/api";

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  useEffect(() => {
    api.get("/recruiter/dashboard")
      .then((res) => setData(res.data.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <RecruiterNavbar />

      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand">
              Welcome back
            </p>
            <h1 className="text-3xl font-black mt-1">
              {user?.name || "Recruiter"}
            </h1>
            {user?.company && (
              <p className="text-gray-500 mt-1">{user.company}</p>
            )}
          </div>

          <Link
            to="/recruiter/jobs/new"
            className="flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-bold text-white hover:bg-indigo-700"
          >
            <PlusCircle size={18} /> Post New Job
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-500 font-semibold">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-10">
              <StatCard
                label="My Jobs"
                value={data?.stats?.totalJobs || 0}
                Icon={Briefcase}
              />
              <StatCard
                label="Total Applicants"
                value={data?.stats?.totalApplicants || 0}
                Icon={Users}
              />
              <StatCard
                label="Shortlisted"
                value={data?.stats?.shortlisted || 0}
                Icon={UserCheck}
              />
              <StatCard
                label="Hired"
                value={data?.stats?.hired || 0}
                Icon={CheckCircle}
              />
            </div>

            {/* Pipeline snapshot + recent applicants */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-7 shadow-soft">
                <h2 className="text-xl font-black mb-5">
                  Pipeline Snapshot
                </h2>

                <div className="space-y-3">
                  <PipelineRow
                    label="Pending"
                    value={data?.stats?.pending || 0}
                    color="bg-yellow-50 text-yellow-600"
                  />
                  <PipelineRow
                    label="Shortlisted"
                    value={data?.stats?.shortlisted || 0}
                    color="bg-blue-50 text-blue-600"
                  />
                  <PipelineRow
                    label="Interview"
                    value={data?.stats?.interview || 0}
                    color="bg-purple-50 text-purple-600"
                  />
                  <PipelineRow
                    label="Hired"
                    value={data?.stats?.hired || 0}
                    color="bg-emerald-50 text-emerald-600"
                  />
                  <PipelineRow
                    label="Rejected"
                    value={data?.stats?.rejected || 0}
                    color="bg-red-50 text-red-600"
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-7 shadow-soft">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-black">
                    Recent Applicants
                  </h2>

                  <Link
                    to="/recruiter/pipeline"
                    className="flex items-center gap-1 text-sm font-bold text-brand"
                  >
                    View All <ArrowRight size={16} />
                  </Link>
                </div>

                {data?.recentApplicants?.length ? (
                  <div className="space-y-3">
                    {data.recentApplicants.map((a) => (
                      <div
                        key={a._id}
                        className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
                      >
                        <div>
                          <p className="font-bold text-sm">
                            {a.candidate}
                          </p>
                          <p className="text-xs text-gray-500">
                            {a.jobTitle} · {a.appliedAt}
                          </p>
                        </div>

                        <StatusBadge status={a.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-10">
                    No applicants yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* AI Chatbot for Recruiter Panel */}
      <ChatBot panel="recruiter" />
    </>
  );
};

const StatCard = ({ label, value, Icon }) => (
  <div className="rounded-[2rem] bg-white p-6 shadow-soft flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <h3 className="text-3xl font-black text-gray-900 mt-2">
        {value}
      </h3>
    </div>

    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-brand">
      <Icon size={22} />
    </span>
  </div>
);

const PipelineRow = ({ label, value, color }) => (
  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
    <span className="font-semibold text-sm">{label}</span>
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>
      {value}
    </span>
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

export default RecruiterDashboard;
