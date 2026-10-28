// ✅ PATCHED: now uses /api/my-applications (server-filtered by JWT)
//    — no more client-side filtering, faster + safer
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, BriefcaseBusiness, UserCheck, UserX } from "lucide-react";
import BackButton from "../BackButton";
import UserNavbar from "./UserNavbar";
import api from "../../utils/api";

const stages = [
  { key: "Pending", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
  { key: "Shortlisted", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50" },
  { key: "Interview", icon: BriefcaseBusiness, color: "text-purple-500", bg: "bg-purple-50" },
  { key: "Hired", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  { key: "Rejected", icon: UserX, color: "text-red-500", bg: "bg-red-50" },
];

const ApplicationTracking = () => {
  const [apps, setApps] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    setUser(storedUser);

    if (storedUser) {
      api.get("/my-applications")
        .then((res) => setApps(res.data.data || []))
        .catch((err) => console.error("Error fetching applications:", err));
    }
  }, []);

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-10 text-center">
        <p>Please log in to view your applications.</p>
        <Link to="/login" className="mt-4 inline-block text-brand font-bold">Login</Link>
      </main>
    );
  }

  return (
    <>
      <UserNavbar />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallback="/dashboard" />
          <h1 className="text-2xl font-black">My Applications</h1>
        </div>

        {apps.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-soft">
            You haven't applied to any jobs yet.
            <Link to="/jobs" className="block mt-4 font-bold text-brand">Browse jobs →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {apps.map((app) => {
              const currentStage = stages.find(s => s.key === app.status) || stages[0];
              const StageIcon = currentStage.icon;
              return (
                <div key={app._id || app.id} className="rounded-3xl bg-white p-6 shadow-soft border border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-black text-lg">{app.jobTitle}</h2>
                      <p className="text-sm text-gray-500">{app.company} · Applied on {app.appliedAt}</p>
                    </div>
                    <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${currentStage.bg} ${currentStage.color}`}>
                      <StageIcon size={16} />
                      {app.status}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-medium text-gray-400">
                      {stages.map((stage, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div className={`h-2 w-2 rounded-full ${idx <= stages.findIndex(s => s.key === app.status) ? "bg-brand" : "bg-gray-200"}`} />
                          <span className="hidden md:block">{stage.key}</span>
                        </div>
                      ))}
                    </div>
                    <div className="relative mt-2 h-1.5 w-full rounded-full bg-gray-200">
                      <div
                        className="absolute h-1.5 rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${(stages.findIndex(s => s.key === app.status) + 1) / stages.length * 100}%` }}
                      />
                    </div>
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

export default ApplicationTracking;